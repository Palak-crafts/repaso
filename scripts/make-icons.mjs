// One-off: renders public/icon.svg to the PNG sizes that installable apps and iOS want.
// Needs Playwright (npm i --no-save playwright). Run: node scripts/make-icons.mjs
import { chromium } from "playwright";
import fs from "node:fs";
const svg = fs.readFileSync("public/icon.svg", "utf8");
const b = await chromium.launch();
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await p.screenshot({ path: "public/" + name, omitBackground: true });
  await p.close();
}
await b.close();
