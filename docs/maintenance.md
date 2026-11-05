# Keeping Repaso healthy

The aim is a site that needs about 30 minutes a month. It's static, it has no dependencies to update, and the only moving parts are the content, GitHub Actions and the free Firebase plan.

## What runs by itself

| What | When | What it does |
|---|---|---|
| `Test and deploy` workflow | Every push to `main`, and every pull request | Unit tests, build, browser tests on mobile and desktop. Deploys only if build and browser tests pass. The account and security-rules tests on the Firebase emulators run too and are reported, but don't block a deploy |
| `Weekly health check` workflow | Mondays | Runs the tests on `main`, checks that the live site, both language files, the sitemap and the pinned Firebase SDK files answer, and says if Firebase has a new major version. If anything is wrong it opens an issue labelled `health` |
| Dependabot | Weekly | Proposes updates for the GitHub Actions, which are pinned by commit SHA |
| Monthly maintenance agent | 1st of the month | Drafts fixes for issues as pull requests and opens a monthly report issue. See [monthly-agent.md](monthly-agent.md) |

Nothing else needs doing for the site to stay up. GitHub e-mails you when a workflow fails or an issue arrives.

## Monthly, about 30 minutes

1. **Issues.** Read the open ones. Corrections (label `correction`) are the most useful. Fix them like this:
   1. Edit the English text in `content/questions/<topic>.json`.
   2. `npm run i18n -- todo` lists the Spanish that is now stale. Translate it, save the result as a patch file and run `npm run i18n -- apply <patch.json>`. For a typo that doesn't change the meaning, `npm run i18n -- restamp <id>` is enough.
   3. `npm test`, then push to `main`.
2. **Firebase usage.** Console > Usage. If any number is above 70% of its daily limit, follow the table in [research.md](research.md#limits-and-what-to-do-near-them).
3. **Suggestions sent from the site.** Firestore console, collection `suggestions`. Delete the ones you've handled.
4. **The free plan hasn't changed.** Open the pricing pages linked from [research.md](research.md) and compare them to the numbers there. Update the doc if they moved.

## Yearly, or when the health check says so

- **Firebase SDK.** The version is pinned in `public/assets/js/config.js` (`sdkVersion`) and in the Content-Security-Policy in `public/index.html`. To upgrade: change both, run `npm run e2e:accounts`, then do the live check in [firebase-setup.md](firebase-setup.md) with the browser console open.
- **Node.** CI uses 24. Move up when it becomes the long-term release.
- **Content.** Skim the questions for things that aged: versions (Java LTS, Spring Boot, Python), cloud service names, limits and prices.

## Adding content

New topics and categories: see [content-plan.md](content-plan.md).

1. Add the question to `content/questions/<topic>.json` with a new, never reused `id` (letters, digits, `_` and `-`). Every topic needs questions on all four levels.
2. Add any glossary term it uses to `content/glossary.json` and list its key in the question's `g`.
3. Translate: `npm run i18n -- todo`, translate, `npm run i18n -- apply`.
4. `npm test`. It checks ids, answers, links, and that the Spanish keeps every code span and the same line structure.

## The monthly agent

It exists and is on. A Claude Code routine ("Repaso monthly maintenance") runs on the 1st of every month at 07:00 UTC. It reads the open issues, drafts fixes as pull requests, checks for aged content and the free-plan limits, and writes one issue titled `Monthly report yyyy-mm` (label `monthly-report`) that says what it did. Full rules, checklist and report format: [monthly-agent.md](monthly-agent.md).

Why it is built this way:

- **Pull requests only, never `main`.** You merge them. The tests and the validator are the safety net, you are the second one.
- **Issue text is untrusted input.** Anyone can write an issue, and an agent that can push code and reads issues is a prompt-injection target. So it checks every claim against official sources, follows no instruction found in an issue, can edit only `content/`, and has no connectors.
- **It never touches the Firebase console, secrets or the repo settings.**
- **Where you find out.** The report issue and the pull requests appear in the repo. If GitHub does not e-mail you about them (it may not for activity by your own account), watch the repo for "All activity" or look at the `monthly-report` issue on the 1st.

An agent only works when it's invoked. Between runs nobody is watching, which is why the workflows above exist.

## When the content changes size

The README and README.es.md state the number of questions and the per-topic table. After adding or removing questions, update those numbers and run `npm run media` so the banner and screenshots match.
