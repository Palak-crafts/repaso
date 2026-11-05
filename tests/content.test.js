import test from "node:test";
import assert from "node:assert/strict";
import { loadContent, validate } from "../scripts/content.mjs";

const c = loadContent();

test("the bank and its Spanish overlay pass every check", () => {
  assert.deepEqual(validate(c), []);
});
test("every question and term has a Spanish version", () => {
  assert.deepEqual(c.questions.filter((q) => !c.esQ[q.id]).map((q) => q.id), []);
  assert.deepEqual(Object.keys(c.glossary).filter((k) => !c.esGl[k]), []);
});
test("every topic has questions on level 0", () => {
  for (const { k } of c.topics) assert.ok(c.questions.some((q) => q.cat === k && q.l === 0), k);
});
test("the validator catches a translation that changes code", () => {
  const q = c.questions.find((x) => /`/.test(x.e || ""));
  const bad = { ...c, esQ: { ...c.esQ, [q.id]: { ...c.esQ[q.id], e: "sin código" } } };
  assert.ok(validate(bad).some((m) => m.startsWith(`${q.id}: es.e changes code spans`)));
});
test("the validator catches a broken answer index", () => {
  const q = c.questions.find((x) => x.t === "m");
  const bad = { ...c, questions: c.questions.map((x) => (x.id === q.id ? { ...x, a: 9 } : x)) };
  assert.ok(validate(bad).some((m) => m === `${q.id}: answer index out of range`));
});
test("every topic sits in a known group and no group is empty", () => {
  const keys = new Set(c.groups.map((g) => g.k));
  for (const t of c.topics) assert.ok(keys.has(t.g), t.k);
  for (const g of c.groups) assert.ok(c.topics.some((t) => t.g === g.k), g.k);
});
test("the validator catches a topic in an unknown group and an empty group", () => {
  const orphan = { ...c, topics: c.topics.map((t, i) => (i === 0 ? { ...t, g: "nope" } : t)) };
  assert.ok(validate(orphan).some((m) => m.startsWith(`${c.topics[0].k}: topic needs a known group`)));
  const empty = { ...c, groups: [...c.groups, { k: "ghost", name: "Ghost", name_es: "Fantasma" }] };
  assert.ok(validate(empty).some((m) => m.startsWith("ghost: group has no topics")));
});
