// Reads and checks everything in content/. Used by the build, the tests and CI.
import fs from "node:fs";
import crypto from "node:crypto";

export const HASH_FILE = "content/es/source-hash.json";
/** The English fields that get translated. A change in any of them makes the Spanish stale. */
export const sourceOf = (x) => (Array.isArray(x) ? x : [x.q, x.o, x.t === "f" ? x.a : null, x.fa, x.e, x.r]);
export const fingerprint = (v) => crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 12);

const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const exists = (f) => fs.existsSync(f);

export function loadContent() {
  const topics = read("content/topics.json");
  const questions = [], esQ = {};
  for (const { k } of topics) {
    for (const q of read(`content/questions/${k}.json`)) questions.push({ ...q, cat: k });
    const f = `content/es/questions/${k}.json`;
    if (exists(f)) for (const [id, v] of Object.entries(read(f))) {
      if (id in esQ) throw new Error(`content/es: ${id} is translated twice`);
      esQ[id] = v;
    }
  }
  const glossary = read("content/glossary.json");
  const esGl = exists("content/es/glossary.json") ? read("content/es/glossary.json") : {};
  const hashes = exists(HASH_FILE) ? read(HASH_FILE) : {};
  return { topics, questions, glossary, esQ, esGl, hashes };
}

const ticks = (s) => (String(s).match(/`[^`]+`/g) || []).sort();
const shape = (s) => String(s).split("\n").map((l) => (l.startsWith("- ") ? "-" : /^\d+\. /.test(l) ? "#" : l.trim() ? "p" : "")).join("");

export function validate({ topics, questions, glossary, esQ, esGl, hashes = {} }) {
  const out = [], ids = new Set();
  const fail = (id, msg) => out.push(`${id}: ${msg}`);
  const known = new Set(topics.map((t) => t.k));
  const plain = /^[A-Za-z0-9_-]{1,32}$/;
  for (const t of topics) if (!plain.test(t.k)) fail(t.k, "topic key must be letters, digits, _ or -");
  for (const k of Object.keys(glossary)) if (!plain.test(k)) fail(k, "glossary key must be letters, digits, _ or -");
  for (const q of questions) {
    if (!plain.test(q.id)) fail(q.id, "id must be letters, digits, _ or -");
    if (ids.has(q.id)) fail(q.id, "duplicate id");
    ids.add(q.id);
    if (!known.has(q.cat)) fail(q.id, "unknown topic");
    if (![0, 1, 2, 3].includes(q.l)) fail(q.id, "level must be 0 to 3");
    if (!q.q) fail(q.id, "missing question");
    if (q.t === "m") {
      if (!Array.isArray(q.o) || q.o.length < 2) fail(q.id, "needs options");
      else if (!(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length)) fail(q.id, "answer index out of range");
      if (Array.isArray(q.o) && (q.o.length > 4 || q.o.some((o) => typeof o !== "string" || !o.trim()))) fail(q.id, "needs 2 to 4 non-empty options");
      if (!q.e) fail(q.id, "missing explanation");
    } else if (q.t === "f") {
      if (typeof q.a !== "string" || !q.a) fail(q.id, "flashcard needs an answer");
    } else fail(q.id, "type must be m or f");
    for (const k of q.g || []) if (!glossary[k]) fail(q.id, `unknown term ${k}`);
  }
  // Every topic needs questions at every level, or the levels above it stay locked behind an empty one.
  for (const t of topics) for (let l = 0; l < 4; l++) if (!questions.some((q) => q.cat === t.k && q.l === l)) fail(t.k, `no questions at level ${l}`);
  // Spanish overlay: anything present must line up with the English source.
  for (const [id, e] of Object.entries(esQ)) {
    const q = questions.find((x) => x.id === id);
    if (!q) { fail(id, "translation for unknown question"); continue; }
    if (!hashes[id]) fail(id, "translation has no source fingerprint (npm run i18n -- stamp)");
    else if (hashes[id] !== fingerprint(sourceOf(q))) fail(id, "English changed since this was translated (npm run i18n -- todo, or restamp if harmless)");
    const pairs = [["q", q.q, e.q], ["e", q.e, e.e], ["r", q.r, e.r], ["fa", q.fa, e.fa]];
    if (q.t === "f") pairs.push(["a", q.a, e.a]);
    for (const [f, src, tr] of pairs) {
      if (!src) continue;
      if (!tr) { fail(id, `es.${f} missing`); continue; }
      if (ticks(src).join("|") !== ticks(tr).join("|")) fail(id, `es.${f} changes code spans: ${ticks(src).filter((x) => !ticks(tr).includes(x)).join(" ")}`);
      if (shape(src) !== shape(tr)) fail(id, `es.${f} changes line structure`);
      if (/—/.test(tr)) fail(id, `es.${f} has an em dash`);
    }
    if (q.t === "m") {
      if (!Array.isArray(e.o) || e.o.length !== q.o.length) fail(id, "es.o length");
      else q.o.forEach((o, i) => {
        if (!e.o[i]) fail(id, `es.o[${i}] empty`);
        else if (ticks(o).join("|") !== ticks(e.o[i]).join("|")) fail(id, `es.o[${i}] changes code spans`);
      });
    }
  }
  for (const [k, v] of Object.entries(esGl)) {
    if (!glossary[k]) fail(k, "translation for unknown term");
    else {
      if (!hashes[`g:${k}`]) fail(k, "translation has no source fingerprint (npm run i18n -- stamp)");
      else if (hashes[`g:${k}`] !== fingerprint(sourceOf(glossary[k]))) fail(k, "English changed since this was translated (npm run i18n -- todo, or restamp if harmless)");
      if (!v[1]) fail(k, "es definition missing");
      if (ticks(glossary[k][1]).join("|") !== ticks(v[1]).join("|")) fail(k, "es definition changes code spans");
      if (/—/.test(v[1])) fail(k, "es definition has an em dash");
    }
  }
  return out;
}
