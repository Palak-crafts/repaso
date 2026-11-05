# Contributing

Corrections are the most useful thing. New questions are welcome too.

## The quick way

Every question on the site has a "Suggest a correction" link. It opens an issue here with the question id already filled in. You don't need to touch the code.

## Fixing it yourself

The content is plain JSON:

- `content/questions/<topic>.json`: the English questions. Each has a stable `id`. Never reuse or change an id.
- `content/es/questions/<topic>.json`: the Spanish version, by `id`. Code stays in English.
- `content/glossary.json` and `content/es/glossary.json`: the glossary.

1. Edit the English text.
2. `npm run i18n -- todo` lists the Spanish that is now out of date. Update it, or open the pull request with the English change and say so.
3. `npm test`. It checks ids, answers, glossary links, and that a translation keeps every code span and the same line structure.

Adding a question: use a new `id`, give it one of the four levels, add any glossary term it uses to the glossary and list its key in the question's `g`. [docs/maintenance.md](docs/maintenance.md#adding-content) has the details.

## Changing the site

Plain HTML, CSS and JavaScript modules, no dependencies. `npm run serve` builds and serves it on http://localhost:4173. Please keep these promises, a test guards the first two:

- No third-party scripts, fonts or styles.
- Nothing leaves the site until someone signs in.
- Every animation stops under `prefers-reduced-motion`.

Before a pull request: `npm test`, and `npm run e2e` if you changed anything in `public/` (see the README for how to set up Playwright). For visual changes, look at the home page in light and dark, in both languages, at 390 px and 1280 px. [docs/design.md](docs/design.md) explains where the colors, fonts and effects live.

## License

By contributing you agree that code is under [MIT](LICENSE) and questions and glossary under [CC BY 4.0](content/LICENSE.md).
