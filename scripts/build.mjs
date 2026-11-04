// Builds the static site into dist/. No dependencies: Node 20+ only.
// content/ is the source of truth; public/ holds the app shell.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { loadContent, validate } from "./content.mjs";

const content = loadContent();
const problems = validate(content);
if (problems.length) {
  console.error(problems.slice(0, 40).join("\n"));
  console.error(`\n${problems.length} content problem(s).`);
  process.exit(1);
}

fs.rmSync("dist", { recursive: true, force: true });
fs.cpSync("public", "dist", { recursive: true });
fs.mkdirSync("dist/data", { recursive: true });

const en = { topics: content.topics, questions: content.questions, glossary: content.glossary };
const es = { q: content.esQ, gl: content.esGl };
fs.writeFileSync("dist/data/bank.en.json", JSON.stringify(en));
fs.writeFileSync("dist/data/bank.es.json", JSON.stringify(es));

// Stamp the service worker so every deploy refreshes the offline copy.
const hash = crypto.createHash("sha256");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk("dist").sort();
for (const f of files) hash.update(fs.readFileSync(f));
const version = hash.digest("hex").slice(0, 10);
const list = files.filter((f) => !/sw\.js$|_headers$|robots\.txt$/.test(f)).map((f) => path.relative("dist", f).replaceAll("\\", "/"));
const sw = fs.readFileSync("dist/sw.js", "utf8").replace("__VERSION__", version).replace('"__FILES__"', JSON.stringify(list).slice(1, -1));
fs.writeFileSync("dist/sw.js", sw);

const kb = (f) => Math.round(fs.statSync(f).size / 1024);
console.log(`Built dist/ (${version}): ${content.questions.length} questions, ${Object.keys(content.glossary).length} terms, ${Object.keys(content.esQ).length} translated.`);
console.log(`bank.en.json ${kb("dist/data/bank.en.json")} KB, bank.es.json ${kb("dist/data/bank.es.json")} KB`);
