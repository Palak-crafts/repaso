// Pure logic: no DOM, no storage, no network. Everything here is unit tested.

export const DAY = 864e5;
export const INTERVAL_DAYS = [0, 0, 1, 3, 7, 16]; // index = Leitner box
export const UNLOCK_RATIO = 0.7;

export function blankProgress() {
  return { v: 1, items: {}, stats: { answered: 0, correct: 0, streak: 0, best: 0 }, updatedAt: 0, studied: {}, levels: {} };
}
export function validProgress(p) {
  return !!p && typeof p === "object" && !!p.items && typeof p.items === "object" && !!p.stats && typeof p.stats === "object";
}

/**
 * Rebuilds a progress document from untrusted input (a file, the cloud, old storage).
 * Keeps only known question ids and clamps every number, so a damaged or hostile document
 * can never put NaN into the scheduler or add keys like "__proto__".
 */
export function sanitizeProgress(p, known) {
  if (!validProgress(p)) return blankProgress();
  const num = (v, max = Number.MAX_SAFE_INTEGER) => (Number.isFinite(v) ? Math.min(Math.max(Math.trunc(v), 0), max) : 0);
  const out = blankProgress();
  const has = (id) => (known ? known[id] !== undefined : true);
  for (const id of Object.keys(p.items)) {
    const x = p.items[id];
    if (!x || typeof x !== "object" || id === "__proto__" || !has(id)) continue;
    out.items[id] = { b: num(x.b, 5), d: num(x.d, 8.64e15), n: num(x.n), c: num(x.c), w: num(x.w), l: x.l ? 1 : 0, t: num(x.t, 8.64e15) };
  }
  const s = p.stats;
  out.stats = { answered: num(s.answered), correct: num(s.correct), streak: num(s.streak), best: num(s.best) };
  for (const [k, v] of Object.entries(p.studied && typeof p.studied === "object" ? p.studied : {})) if (v && k !== "__proto__" && has(k)) out.studied[k] = 1;
  for (const [k, v] of Object.entries(p.levels && typeof p.levels === "object" ? p.levels : {})) if (k !== "__proto__" && /^[a-z]{1,8}$/.test(k)) out.levels[k] = num(v, 3);
  out.updatedAt = num(p.updatedAt, 8.64e15);
  if (typeof p.owner === "string" && p.owner.length <= 128) out.owner = p.owner;
  return out;
}

export function shuffle(list, rand = Math.random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function pct(n, d) { return d ? Math.round((100 * n) / d) : 0; }

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export function inline(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }

export function richText(t) {
  let html = "", list = null;
  const close = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const l of String(t).split("\n")) {
    const ul = /^- (.*)/.exec(l), ol = /^\d+\. (.*)/.exec(l);
    if (ul) { if (list !== "ul") { close(); html += "<ul>"; list = "ul"; } html += `<li>${inline(ul[1])}</li>`; }
    else if (ol) { if (list !== "ol") { close(); html += "<ol>"; list = "ol"; } html += `<li>${inline(ol[1])}</li>`; }
    else if (l.trim()) { close(); html += `<p>${inline(l)}</p>`; }
  }
  close();
  return html;
}

/* ---------- spaced repetition ---------- */

/** Applies one answer to one item. Returns the new item. New correct answers skip box 1. */
export function gradeItem(item, ok, now = Date.now()) {
  const x = { b: 0, d: 0, n: 0, c: 0, w: 0, l: 0, t: 0, ...(item || {}) };
  x.n++;
  if (ok) { x.c++; x.b = x.b === 0 ? 2 : Math.min(5, x.b + 1); }
  else { x.w++; x.b = 1; }
  x.l = ok ? 1 : 0;
  x.t = now; // when it was last answered, so a merge can tell which device saw it last
  x.d = now + INTERVAL_DAYS[x.b] * DAY;
  return x;
}
export function gradeStats(st, ok) {
  const s = { ...st, answered: st.answered + 1 };
  if (ok) { s.correct++; s.streak++; if (s.streak > s.best) s.best = s.streak; }
  else s.streak = 0;
  return s;
}

export function levelStats(progress, bank, cat, level) {
  const qs = bank.filter((q) => q.cat === cat && q.l === level);
  const ok = qs.filter((q) => { const x = progress.items[q.id]; return x && x.b >= 2; }).length;
  return { total: qs.length, ok, need: Math.ceil(qs.length * UNLOCK_RATIO) };
}
/** Highest level per topic. A level unlocks at 70% of the previous one in box 2+, and never relocks. */
export function refreshLevels(progress, bank, topics) {
  const levels = progress.levels || (progress.levels = {});
  const ups = [];
  for (const { k } of topics) {
    let cur = levels[k] ?? 0;
    while (cur < 3) {
      const s = levelStats(progress, bank, k, cur);
      if (!s.total || s.ok >= s.need) { // an empty level never blocks the next one
        cur++; ups.push({ cat: k, level: cur }); }
      else break;
    }
    levels[k] = cur;
  }
  return ups;
}

/** Counts how many of the given questions sit in each box (index 0 = never seen). */
export function boxCounts(progress, bank) {
  const c = [0, 0, 0, 0, 0, 0];
  for (const q of bank) { const x = progress.items[q.id]; c[x ? x.b : 0]++; }
  return c;
}

/** Merges two progress documents without ever losing an answer. Used when signing in on a second device. */
export function mergeProgress(a, b) {
  if (!validProgress(a)) return validProgress(b) ? structuredClone(b) : blankProgress();
  if (!validProgress(b)) return structuredClone(a);
  const out = blankProgress();
  for (const id of new Set([...Object.keys(a.items), ...Object.keys(b.items)])) {
    const x = a.items[id], y = b.items[id];
    if (!x || !y) { out.items[id] = { ...(x || y) }; continue; }
    const tx = x.t || 0, ty = y.t || 0; // the most recent answer wins; without timestamps, the one with more answers
    out.items[id] = { ...(tx !== ty ? (tx > ty ? x : y) : x.n > y.n || (x.n === y.n && x.d >= y.d) ? x : y) };
  }
  const main = a.stats.answered >= b.stats.answered ? a.stats : b.stats;
  out.stats = { ...main, best: Math.max(a.stats.best || 0, b.stats.best || 0) };
  if (Object.keys(out.items).length) { // totals follow the merged items, so answers from both devices are counted
    const sum = (k) => Object.values(out.items).reduce((n, x) => n + (x[k] || 0), 0);
    out.stats.answered = sum("n");
    out.stats.correct = Math.min(sum("c"), out.stats.answered);
  }
  if (typeof a.owner === "string" || typeof b.owner === "string") out.owner = typeof a.owner === "string" ? a.owner : b.owner;
  out.studied = { ...(a.studied || {}), ...(b.studied || {}) };
  for (const k of new Set([...Object.keys(a.levels || {}), ...Object.keys(b.levels || {})]))
    out.levels[k] = Math.max(a.levels?.[k] ?? 0, b.levels?.[k] ?? 0);
  out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
  return out;
}

/* ---------- search ---------- */

export function normalize(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/`/g, "");
}
export function searchDocs({ bank, glossary, topics, groups = [], es }) {
  const docs = [];
  for (const t of topics)
    docs.push({ kind: "topic", key: t.k, title: normalize(`${t.name} ${t.name_es} ${groups.filter((g) => g.k === t.g).map((g) => `${g.name} ${g.name_es}`).join(" ")}`), body: "" });
  for (const [k, [name, def]] of Object.entries(glossary)) {
    const e = es?.gl?.[k];
    docs.push({ kind: "term", key: k, title: normalize(`${name} ${e?.[0] ?? ""}`), body: normalize(`${def} ${e?.[1] ?? ""}`) });
  }
  for (const q of bank) {
    const e = es?.q?.[q.id];
    docs.push({
      kind: "question", key: q.id,
      title: normalize(`${q.id} ${q.q} ${e?.q ?? ""}`),
      body: normalize([q.c, q.r, q.fa, typeof q.a === "string" ? q.a : "", q.t === "m" ? q.o[q.a] : "", e?.r, e?.fa, e?.a].filter(Boolean).join(" ")),
    });
  }
  return docs;
}
/** Every word must appear somewhere. Title hits outrank body hits; topics and terms outrank questions on ties. */
export function search(docs, query, limit = 40) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const weight = { topic: 3, term: 2, question: 1 };
  const hits = [];
  for (const d of docs) {
    let score = 0, all = true;
    for (const w of words) {
      const t = d.title.indexOf(w), b = t < 0 ? d.body.indexOf(w) : -1;
      if (t < 0 && b < 0) { all = false; break; }
      score += t === 0 ? 8 : t > 0 ? 5 : 1;
      if (t >= 0 && (t === 0 || /\W/.test(d.title[t - 1])) && !/\w/.test(d.title[t + w.length] ?? " ")) score += 4;
    }
    if (all) hits.push({ ...d, score: score * 10 + weight[d.kind] });
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, limit);
}

/* ---------- code highlighting ---------- */

const KW = {
  py: "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield print len range list dict set tuple str int self cls super isinstance type object",
  js: "var let const function return if else for while new this class extends import export from async await try catch finally throw typeof instanceof null undefined true false of in console setTimeout Promise",
  java: "public private protected static final void class interface extends implements new return if else for while do try catch finally throw throws import package this super null true false int long double boolean char byte short float var record enum abstract switch case default instanceof synchronized volatile",
  sql: "SELECT FROM WHERE AND OR NOT NULL IS JOIN LEFT INNER ON GROUP BY ORDER HAVING LIMIT OFFSET UPDATE SET INSERT INTO VALUES DELETE AS DESC ASC MAX MIN COUNT OVER PARTITION",
  docker: "FROM WORKDIR COPY RUN CMD ENTRYPOINT ENV EXPOSE ARG",
  plain: "", shell: "",
};
const KWS = Object.fromEntries(Object.entries(KW).map(([k, v]) => [k, new Set(v.split(" "))]));

export function lang(code) {
  if (/^\s*<[\w!?]/.test(code) || /^\s*(apiVersion|kind|metadata|spec|spring|resources|server):/m.test(code) || /^\s*(target\/|\.idea\/)/m.test(code)) return "plain";
  if (/^\s*(mvn|git|docker|kubectl|helm|npm|javac)\s/m.test(code)) return "shell";
  if (!/^\s*def\s+\w+\(/m.test(code) && /\b(public|private|protected)\s+(static\s+|final\s+|abstract\s+|volatile\s+|synchronized\s+)*[\w<>\[\],?]+\s+\w+\s*[(=;{]|System\.out|@Override|@(Service|Component|RestController|RestControllerAdvice|Entity|Test|Bean|Transactional|Query|Mock|ExtendWith|ParameterizedTest|CsvSource|Configuration|Aspect|SpringBootApplication|GetMapping|PostMapping)\b|\bString\[\]|\b(List|Map|Set|Optional|Future|CompletableFuture)<[\w<>, ?]+>\s+\w+|\b(WebDriver|WebDriverWait|WebElement|ExpectedConditions)\b|\bExecutors\.\w+|\w\s->\s|\brecord \w+\(|\b(ExecutorService|StringBuilder|AtomicInteger|Executors|Integer|String)\s+\w+\s*=|\bStream\.of\(|\bConnection conn\b|\bPreparedStatement\b|\benum \w+ \{|\bclass \w+ \{|\bstatic int \w+\(|\b[A-Z]\w+ \w+ = new [A-Z]\w+\(/.test(code)) return "java";
  if (/^\s*FROM\s/m.test(code) && /^\s*(RUN|COPY|CMD)\b/m.test(code)) return "docker";
  if (/^\s*@media|^\s*[.#]?[\w-]+\s*\{[^}]*:\s*[^}]*;/m.test(code)) return "plain";
  if (/\b(console\.log|const |let |=>|setTimeout|useState|function \w+\s*\()/.test(code)) return "js";
  if (/^\s*(SELECT|UPDATE|INSERT|BEGIN|CREATE|ALTER|WITH)\b/m.test(code) && !/\bdef\b/.test(code)) return "sql";
  return "py";
}
export function highlight(code) {
  const L = lang(code), kws = KWS[L];
  if (L === "plain") return esc(code);
  const com = L === "py" || L === "docker" || L === "shell" ? "#[^\\n]*" : L === "sql" ? "--[^\\n]*" : "\\/\\/[^\\n]*";
  const re = new RegExp(`(${com})|("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_]\\w*)`, "g");
  let out = "", last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += `<span class="tk-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tk-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tk-num">${m[3]}</span>`;
    else if (kws.has(m[4])) out += `<span class="tk-kw">${m[4]}</span>`;
    else if (code.charAt(re.lastIndex) === "(") out += `<span class="tk-fn">${m[4]}</span>`;
    else out += esc(m[4]);
  }
  return out + esc(code.slice(last));
}
