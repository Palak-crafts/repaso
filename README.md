# Repaso

Free practice for software engineering interviews, junior to mid level, in English and Spanish.

**https://babylonace.github.io/repaso/**

[Leer en español](README.es.md)

777 questions and 745 glossary terms across 14 topics: Python, Java, Spring, SQL, algorithms, system design, security, frontend, cloud, Git, testing and behavioral questions.

You open it and the first question is already there. No signup, no ads, no trackers. Your progress stays in your browser, and it works offline after the first visit. If you want your progress on another device you can sign in with Google or GitHub, but nothing depends on that.

"Repaso" means review in Spanish, which is all this is.

## How it works

- Questions you miss come back sooner. Questions you know come back later (five boxes, Leitner style, 0 to 16 days).
- Each topic has four levels. A level opens when you get 70% of the one before it right.
- Search on the home page covers questions, glossary and topics, in both languages.
- Study mode lets you read everything without being quizzed.

## Found a mistake?

Quite possible. The questions and the Spanish translation are AI-assisted, so please tell me. Every question has a "Suggest a correction" link that opens a prefilled issue here.

If you want to fix it yourself, the content is plain JSON:

- `content/questions/<topic>.json`: the English questions. Each one has a stable `id`.
- `content/es/questions/<topic>.json`: the Spanish version, by `id`. Code stays in English.
- `content/glossary.json` and `content/es/glossary.json`: the glossary.

`npm test` checks everything: ids, answers, glossary links, and that a translation does not change any code.

## Run it locally

You need Node 22 or newer. There are no dependencies to install.

```bash
npm run serve   # builds and serves on http://localhost:4173
npm test        # logic and content tests
```

Browser tests use Playwright, which I keep out of the project on purpose:

```bash
npm i --no-save playwright && npx playwright install chromium
npm run e2e            # mobile and desktop, without any account service
npm run e2e:accounts   # sign-up, sign-out and security rules, on the Firebase emulators
```

## How it's built

Plain HTML, CSS and JavaScript modules, built by a small Node script with no dependencies. Hosted on GitHub Pages.

Accounts are optional and use Firebase on its free plan, with no card attached. `config.js` ships with `firebase: null`, so the site runs fine without them. The Firebase code only loads if someone signs in. To turn them on, see [docs/firebase-setup.md](docs/firebase-setup.md).

The research behind these choices, the free limits and what to do when getting close to them are in [docs/research.md](docs/research.md).

## License

Code: [MIT](LICENSE). Questions and glossary: [CC BY 4.0](content/LICENSE.md). Fonts: SIL Open Font License, included next to the font files.

AI-assisted.
