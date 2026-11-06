// Builds the monthly maintenance report as Markdown. Used by .github/workflows/monthly.yml.
// No AI and no secrets: it only runs the checks, reads what GitHub already knows and checks that
// the documentation links still answer. A person reads the report and decides what to change.
//
// Inputs (set by the workflow): TEST_OUTCOME, I18N_OUTCOME, I18N_OUT (text), ISSUES_FILE, PRS_FILE (gh JSON).
import { readFileSync, readdirSync, existsSync } from "node:fs";

const month = new Date().toISOString().slice(0, 7);
const read = (f) => (f && existsSync(f) ? JSON.parse(readFileSync(f, "utf8") || "[]") : []);
// The report issues are the output of this script, not input for it.
const issues = read(process.env.ISSUES_FILE).filter((i) => !(i.labels || []).some((x) => x.name === "monthly-report"));
const prs = read(process.env.PRS_FILE);

// Links worth re-checking every month: the free-plan research and the per-topic source lists.
const docs = ["docs/research.md"];
if (existsSync("docs/sources")) for (const f of readdirSync("docs/sources")) if (f.endsWith(".md")) docs.push(`docs/sources/${f}`);
const urls = new Map();
for (const f of docs) {
  for (const m of readFileSync(f, "utf8").matchAll(/https?:\/\/[^\s)>"'`|\]]+/g)) {
    const u = m[0].replace(/[.,;:]+$/, "");
    if (!urls.has(u)) urls.set(u, f);
  }
}

async function check(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": "repaso-monthly-check" } });
    return r.ok ? null : `HTTP ${r.status}`;
  } catch (e) {
    return e.name === "AbortError" ? "timeout" : "no answer";
  } finally {
    clearTimeout(timer);
  }
}
const broken = [];
for (const [url, file] of urls) {
  const problem = await check(url);
  if (problem) broken.push(`- ${url} (${problem}), listed in \`${file}\``);
}

const mark = (o) => (o === "success" ? "pass" : "FAIL");
const list = (xs, f) => (xs.length ? xs.map(f).join("\n") : "- none");
const byLabel = (l) => issues.filter((i) => (i.labels || []).some((x) => x.name === l));
const i18n = (process.env.I18N_OUT || "").trim().split("\n").slice(-3).join("\n");

const needsPeople = [
  ...(process.env.TEST_OUTCOME !== "success" ? ["`npm test` fails on `main`. Nothing else in this report is trustworthy until it passes."] : []),
  ...(process.env.I18N_OUTCOME !== "success" ? ["Some Spanish text is missing or stale (`npm run i18n -- todo`)."] : []),
  ...(broken.length ? [`${broken.length} documentation link(s) no longer answer. See below.`] : []),
  ...(issues.length ? ["There are open issues to read."] : []),
];

console.log(`## Monthly report ${month}

**Summary:** ${needsPeople.length ? `${needsPeople.length} thing(s) need a look.` : "Nothing needed this month."}

### Needs a person
${list(needsPeople, (x) => `- ${x}`)}

### Checks
- \`npm test\` on \`main\`: ${mark(process.env.TEST_OUTCOME)}
- Spanish up to date (\`npm run i18n -- todo\`): ${mark(process.env.I18N_OUTCOME)}${i18n ? `\n\n\`\`\`\n${i18n}\n\`\`\`` : ""}

### Open issues (${issues.length})
${list(issues, (i) => `- #${i.number}: ${String(i.title).replace(/[\r\n]+/g, " ").slice(0, 120)}`)}

Corrections and new-question suggestions: ${byLabel("correction").length + byLabel("new-question").length}. Check each claim against the official documentation before changing a word.

### Open pull requests (${prs.length})
${list(prs, (p) => `- #${p.number}: ${String(p.title).replace(/[\r\n]+/g, " ").slice(0, 120)} (${p.author?.login || "unknown"})`)}

### Documentation links (${urls.size} checked)
${broken.length ? broken.join("\n") : "All of them answer."}

### Not covered here
Facts that age (Java and Spring Boot versions, cloud limits and prices) are not compared automatically. Open the pricing pages linked from \`docs/research.md\` and compare them with its "Limits" table by hand.
`);
