import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY, blankProgress, validProgress, esc, inline, richText, gradeItem, gradeStats, levelStats,
  refreshLevels, boxCounts, mergeProgress, normalize, searchDocs, search, highlight, shuffle, pct,
} from "../public/assets/js/core.js";

const NOW = 1_700_000_000_000;

test("a first correct answer skips box 1 and comes back tomorrow", () => {
  const x = gradeItem(undefined, true, NOW);
  assert.equal(x.b, 2);
  assert.equal(x.d, NOW + DAY);
  assert.equal(x.n, 1);
  assert.equal(x.c, 1);
});
test("a wrong answer always goes back to box 1, due right away", () => {
  const x = gradeItem({ b: 4, d: 0, n: 5, c: 4, w: 1, l: 1 }, false, NOW);
  assert.equal(x.b, 1);
  assert.equal(x.d, NOW);
  assert.equal(x.w, 2);
});
test("boxes stop at 5, with a 16 day gap", () => {
  let x;
  for (let i = 0; i < 9; i++) x = gradeItem(x, true, NOW);
  assert.equal(x.b, 5);
  assert.equal(x.d, NOW + 16 * DAY);
});
test("stats keep the streak and the best streak", () => {
  let s = blankProgress().stats;
  for (const ok of [true, true, false, true]) s = gradeStats(s, ok);
  assert.deepEqual(s, { answered: 4, correct: 3, streak: 1, best: 2 });
});

const bank = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: `A0${i}`, cat: "a", l: 0 })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `A1${i}`, cat: "a", l: 1 })),
];
const topics = [{ k: "a" }];

test("a level unlocks at 70 percent of the previous level", () => {
  const p = blankProgress();
  for (let i = 0; i < 6; i++) p.items[`A0${i}`] = { b: 2 };
  assert.deepEqual(levelStats(p, bank, "a", 0), { total: 10, ok: 6, need: 7 });
  assert.deepEqual(refreshLevels(p, bank, topics), []);
  p.items.A06 = { b: 3 };
  assert.deepEqual(refreshLevels(p, bank, topics), [{ cat: "a", level: 1 }]);
  assert.equal(p.levels.a, 1);
});
test("a level never relocks", () => {
  const p = blankProgress();
  p.levels.a = 1;
  refreshLevels(p, bank, topics);
  assert.equal(p.levels.a, 1);
});
test("box counts treat unseen questions as box 0", () => {
  const p = blankProgress();
  p.items.A00 = { b: 2 };
  assert.deepEqual(boxCounts(p, bank), [19, 0, 1, 0, 0, 0]);
});

test("merging keeps every answer from both devices", () => {
  const a = blankProgress(), b = blankProgress();
  a.items.X = { b: 3, d: 5, n: 4 };
  a.items.Y = { b: 2, d: 5, n: 1 };
  b.items.Y = { b: 4, d: 9, n: 7 };
  b.items.Z = { b: 1, d: 1, n: 1 };
  const m = mergeProgress(a, b);
  assert.deepEqual(Object.keys(m.items).sort(), ["X", "Y", "Z"]);
  assert.equal(m.items.Y.n, 7, "the item with more answers wins");
});
test("merging keeps the best streak and the highest level", () => {
  const a = blankProgress(), b = blankProgress();
  a.stats = { answered: 10, correct: 8, streak: 1, best: 3 };
  b.stats = { answered: 4, correct: 4, streak: 4, best: 6 };
  a.levels = { x: 1 }; b.levels = { x: 2, y: 1 };
  a.studied = { P: 1 }; b.studied = { Q: 1 };
  const m = mergeProgress(a, b);
  assert.equal(m.stats.answered, 10);
  assert.equal(m.stats.best, 6);
  assert.deepEqual(m.levels, { x: 2, y: 1 });
  assert.deepEqual(m.studied, { P: 1, Q: 1 });
});
test("merging survives a broken document on either side", () => {
  const good = blankProgress();
  good.items.X = { b: 2, d: 1, n: 1 };
  assert.deepEqual(mergeProgress(good, { nope: 1 }).items, good.items);
  assert.deepEqual(mergeProgress(null, good).items, good.items);
  assert.ok(validProgress(mergeProgress(null, null)));
});

test("search ignores case and accents", () => {
  const docs = searchDocs({ bank: [], glossary: { c: ["Cache", "Fast storage"] }, topics: [], es: { gl: { c: ["Caché", "Memoria rápida"] } } });
  assert.equal(search(docs, "CACHE")[0].key, "c");
  assert.equal(search(docs, "caché")[0].key, "c");
  assert.equal(search(docs, "memoria rapida")[0].key, "c");
});
test("search needs every word and ranks titles over bodies", () => {
  const docs = searchDocs({
    bank: [
      { id: "Q1", q: "What is a primary key?", t: "f", a: "Unique id", r: "" },
      { id: "Q2", q: "Unrelated", t: "f", a: "mentions primary key once", r: "" },
    ], glossary: {}, topics: [],
  });
  assert.deepEqual(search(docs, "primary key").map((h) => h.key), ["Q1", "Q2"]);
  assert.deepEqual(search(docs, "primary banana"), []);
  assert.deepEqual(search(docs, "   "), []);
});
test("normalize drops accents and backticks", () => {
  assert.equal(normalize("`Índice` Ñu"), "indice nu");
});

test("text from the bank can never become HTML", () => {
  assert.equal(esc(`<img src=x onerror="a('b')">`), "&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;");
  assert.equal(inline("use `<b>` here"), "use <code>&lt;b&gt;</code> here");
  assert.ok(!richText("- <script>alert(1)</script>").includes("<script>"));
  assert.ok(!highlight(`print("<script>")`).includes("<script>"));
  assert.ok(!highlight(`<script>alert(1)</script>`).includes("<script>"));
});
test("rich text builds lists and paragraphs", () => {
  assert.equal(richText("Hi\n- a\n- b\n1. c"), "<p>Hi</p><ul><li>a</li><li>b</li></ul><ol><li>c</li></ol>");
});
test("shuffle keeps the same items and pct handles zero", () => {
  assert.deepEqual(shuffle([1, 2, 3, 4]).sort(), [1, 2, 3, 4]);
  assert.equal(pct(1, 3), 33);
  assert.equal(pct(0, 0), 0);
});
