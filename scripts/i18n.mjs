// Translation memory for the Spanish version. The translations live in content/es/ and are the
// reusable base: nothing is ever translated twice. Each entry remembers a fingerprint of the English
// text it was made from (content/es/source-hash.json), so a changed English text is flagged as stale.
//
//   npm run i18n -- todo [maxChars]     print what is missing or stale, ready to hand to a translator
//   npm run i18n -- apply <patch.json>  merge translations and refresh their fingerprints
//   npm run i18n -- restamp <id...>     accept the current Spanish after a harmless English edit (typo)
//   npm run i18n -- stamp               fingerprint everything translated so far (one time)
//
// A patch is {"DB-07": {"q": "...", "o": [...], "e": "...", "r": "..."}, "g:cache": ["Caché", "..."]}.
// Omit "o" when every option is literal code, it is copied from English.
import fs from "node:fs";
import { loadContent, sourceOf, fingerprint, HASH_FILE } from "./content.mjs";

const [cmd, ...args] = process.argv.slice(2);
const c = loadContent();
const byId = new Map(c.questions.map((q) => [q.id, q]));
const hashes = c.hashes;

const english = (q) => {
  const o = { id: q.id, q: q.q };
  if (q.o) o.o = q.o;
  if (q.t === "f") o.a = q.a;
  for (const k of ["fa", "e", "r"]) if (q[k]) o[k] = q[k];
  return o;
};
const pending = () => {
  const out = [];
  for (const q of c.questions) {
    const done = c.esQ[q.id];
    if (!done) out.push({ id: q.id, why: "missing", line: JSON.stringify(english(q)) });
    else if (hashes[q.id] !== fingerprint(sourceOf(q))) out.push({ id: q.id, why: hashes[q.id] ? "stale" : "unstamped", line: JSON.stringify(english(q)) });
  }
  for (const [k, v] of Object.entries(c.glossary)) {
    const id = `g:${k}`;
    if (!c.esGl[k]) out.push({ id, why: "missing", line: JSON.stringify([id, v[0], v[1]]) });
    else if (hashes[id] !== fingerprint(sourceOf(v))) out.push({ id, why: hashes[id] ? "stale" : "unstamped", line: JSON.stringify([id, v[0], v[1]]) });
  }
  return out;
};
const save = (file, obj) => fs.writeFileSync(file, "{\n" + Object.entries(obj).map(([k, v]) => JSON.stringify(k) + ":" + JSON.stringify(v)).join(",\n") + "\n}\n");
const stampOne = (id) => {
  if (id.startsWith("g:")) hashes[id] = fingerprint(sourceOf(c.glossary[id.slice(2)]));
  else hashes[id] = fingerprint(sourceOf(byId.get(id)));
};
const writeHashes = () => save(HASH_FILE, Object.fromEntries(Object.entries(hashes).sort(([a], [b]) => a.localeCompare(b))));

if (cmd === "todo") {
  const max = +args[0] || 27000, list = pending();
  let n = 0;
  const batch = [];
  for (const p of list) { if (n + p.line.length > max && batch.length) break; n += p.line.length; batch.push(p); }
  console.log(`# ${list.length} pending (${list.filter((p) => p.why === "missing").length} missing, ${list.filter((p) => p.why !== "missing").length} stale or unstamped). This batch: ${batch.length}, ${n} chars.`);
  for (const p of batch) console.log(`# ${p.why}: ${p.id}\n${p.line}`);
} else if (cmd === "apply") {
  const patch = JSON.parse(fs.readFileSync(args[0], "utf8"));
  const touched = new Set(), gl = { ...c.esGl };
  let glTouched = false;
  const perCat = {};
  for (const [id, v] of Object.entries(patch)) {
    if (id.startsWith("g:")) {
      if (!c.glossary[id.slice(2)]) throw new Error(`unknown term ${id}`);
      gl[id.slice(2)] = v; glTouched = true;
    } else {
      const q = byId.get(id);
      if (!q) throw new Error(`unknown question ${id}`);
      const e = { ...v };
      if (q.t === "m" && !e.o) e.o = q.o;
      (perCat[q.cat] ||= { ...JSON.parse(fs.readFileSync(`content/es/questions/${q.cat}.json`, "utf8")) })[id] = e;
    }
    stampOne(id); touched.add(id);
  }
  for (const [cat, obj] of Object.entries(perCat)) {
    const order = c.questions.filter((q) => q.cat === cat).map((q) => q.id);
    save(`content/es/questions/${cat}.json`, Object.fromEntries(order.filter((i) => obj[i]).map((i) => [i, obj[i]])));
  }
  if (glTouched) save("content/es/glossary.json", Object.fromEntries(Object.keys(c.glossary).filter((k) => gl[k]).map((k) => [k, gl[k]])));
  writeHashes();
  console.log(`applied ${touched.size}. Run npm test to validate.`);
} else if (cmd === "restamp") {
  for (const id of args) { if (!c.esQ[id] && !c.esGl[id.replace(/^g:/, "")]) throw new Error(`${id} has no translation`); stampOne(id); }
  writeHashes();
  console.log(`restamped ${args.length}`);
} else if (cmd === "stamp") {
  for (const id of Object.keys(c.esQ)) stampOne(id);
  for (const k of Object.keys(c.esGl)) stampOne(`g:${k}`);
  writeHashes();
  console.log(`stamped ${Object.keys(hashes).length}`);
} else {
  console.log("usage: npm run i18n -- todo|apply|restamp|stamp  (see the comment at the top of scripts/i18n.mjs)");
}
