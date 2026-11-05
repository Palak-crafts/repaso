# Design notes

The look: a pile of index cards under a study lamp. Violet-to-blue light, a coral header rule on every card, a yellow highlighter.

## Where things live

- `public/assets/css/app.css`: all tokens (colors, shadows, radius) are variables at the top. Light and dark use the same names. Change a value there, not in a component.
- `public/icon.svg`: the logo (stacked cards, an R, a highlighter stroke). `scripts/make-icons.mjs` renders the PNG sizes from it. For `apple-touch-icon.png` replace `rx="15"` with `rx="0"` first, iOS rounds the corners itself.
- `public/assets/js/icons.js`: one line icon and one accent hue per topic key. A new topic without an entry gets a neutral icon.
- `public/assets/js/fx.js`: spotlight, tilt, scroll reveal and count-up. All optional.

## Fonts

Bricolage Grotesque (headings, logo word, numbers), Atkinson Hyperlegible (text), JetBrains Mono (code). All self-hosted under `public/assets/fonts/` with their OFL licences; no request leaves the site.

## Effects and the rules they follow

Aurora, grid, border beam, marquee, shine and confetti are CSS. Every one stops under `prefers-reduced-motion`. Scroll reveal only hides content when `theme.js` has run (it adds `.js` to `<html>`), so nothing stays invisible without scripts.

The idea of these effects comes from component libraries such as Aceternity UI and Magic UI. They are React and Tailwind, this site is plain JS with a strict CSP and no dependencies, so the effects are written from scratch instead of installed.

## Checks before a design change ships

`npm test`, then `npm run e2e` (it checks horizontal scroll at 320 px, console errors and third-party requests). Look at the home page in light and dark, in both languages, at 390 px and 1280 px.
