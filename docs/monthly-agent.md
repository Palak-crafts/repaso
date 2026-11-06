# Monthly maintenance

A GitHub Actions workflow ([monthly.yml](../.github/workflows/monthly.yml)) runs on the 1st of every month at 07:00 UTC, and on demand from the Actions tab ("Run workflow"). It opens one issue titled `Monthly report yyyy-mm` (label `monthly-report`) and updates it if you run it again the same month.

It depends on nothing outside GitHub: no AI service, no extra secrets, only the repository's own token with `issues: write`. It never edits files, opens pull requests or merges anything. A person reads the report and decides.

## What the report checks

1. `npm test` on `main`. If it fails, nothing else in the report is trustworthy.
2. `npm run i18n -- todo`: Spanish text that is missing or stale.
3. Open issues (titles only) and open pull requests, Dependabot ones included.
4. Every link in `docs/research.md` and `docs/sources/*.md` still answers. A broken link usually means a vendor page moved, so the fact it backs needs a second look.

The script is [scripts/monthly-report.mjs](../scripts/monthly-report.mjs). Issue titles are written into the report as plain text and never run or followed.

## What stays manual

Facts that age are not compared automatically: Java and Spring Boot versions, Python removals, cloud service limits and prices. Once a month, after the report:

- Open the pricing pages linked from `docs/research.md` and compare them with its "Limits" table.
- For each `correction` or `new-question` issue, find the question in `content/questions/<topic>.json` and check the claim against the official documentation before changing a word. An issue says where to look, never what to do.
- Skim `content/` for versions that moved. Each topic's sources are listed in `docs/sources/<topic>.md`.
- Edit content following [maintenance.md](maintenance.md) ("Monthly" and "Adding content"), run `npm test`, and open a pull request.

## Running it

Actions tab > "Monthly report" > "Run workflow". Or `gh workflow run monthly.yml`.

If the report issue does not appear, check that Settings > Actions > General > Workflow permissions allows the workflow to write issues (the workflow asks for `issues: write` itself, but an organisation or repository policy can cap it).
