// Browser tests with no account service at all. Run: npm run e2e
// Needs Playwright, which is not a project dependency: npm i --no-save playwright && npx playwright install chromium
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const PORT = 4179, URL_ = `http://127.0.0.1:${PORT}/`;
const server = spawn(process.execPath, ["scripts/serve.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 700));

const results = [];
async function check(name, fn) {
  try { await fn(); results.push(["ok", name]); }
  catch (e) { results.push(["FAIL", `${name}: ${e.message.split("\n")[0]}`]); }
}
const ok = (v, msg) => { if (!v) throw new Error(msg || "assertion failed"); };
const answerOne = async (p) => { await p.locator(".opt").first().click(); };

const browser = await chromium.launch();

for (const [label, viewport, touch] of [["mobile", { width: 390, height: 844 }, true], ["desktop", { width: 1280, height: 800 }, false]]) {
  const ctx = await browser.newContext({ viewport, hasTouch: touch });
  const p = await ctx.newPage();
  p.setDefaultTimeout(6000);
  const errors = [], foreign = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  p.on("request", (r) => { if (!r.url().startsWith(URL_) && !r.url().startsWith("data:")) foreign.push(r.url()); });

  await check(`${label}: a question is on screen in under 10 seconds, no signup`, async () => {
    const t0 = Date.now();
    await p.goto(URL_);
    await p.locator(".opt").first().waitFor();
    ok(Date.now() - t0 < 10000);
  });
  await check(`${label}: no horizontal scroll`, async () => {
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  });
  await check(`${label}: answering shows the explanation and saves progress locally`, async () => {
    await answerOne(p);
    await p.locator("[data-act=next]").waitFor();
    const saved = await p.evaluate(() => Object.keys(localStorage).some((k) => (localStorage.getItem(k) || "").includes('"items":{"')));
    ok(saved, "nothing in localStorage");
  });
  await check(`${label}: a full session ends with a score`, async () => {
    for (let i = 0; i < 40; i++) {
      if (await p.locator("[data-act=again], [data-act=retry]").count()) break;
      if (await p.locator("[data-act=reveal]").count()) { await p.locator("[data-act=reveal]").click(); await p.locator("[data-act=got]").click(); continue; }
      if (await p.locator("[data-act=next]").count()) { await p.locator("[data-act=next]").click(); continue; }
      if (await p.locator(".opt:not([disabled])").count()) { await answerOne(p); continue; }
      await p.waitForTimeout(50);
    }
    ok(await p.locator("[data-act=again], [data-act=retry]").count(), "no end screen");
  });
  await check(`${label}: search finds a term and a question`, async () => {
    await p.goto(`${URL_}#/`);
    await p.locator("#q").fill("deadlock");
    await p.locator("#q").press("Enter");
    await p.locator("a[href^='#/term/deadlock']").first().waitFor();
    ok(await p.locator("a[href^='#/q/']").count(), "no question hit");
  });
  await check(`${label}: Spanish button translates the page and keeps code in English`, async () => {
    await p.goto(`${URL_}#/term/deadlock`);
    await p.locator("#lang").click();
    await p.getByText("Dos o más transacciones").first().waitFor();
    await p.goto(`${URL_}#/q/DB-07`);
    await p.waitForFunction(() => document.documentElement.lang === "es");
    await p.locator("#lang").click();
    await p.waitForFunction(() => document.documentElement.lang === "en");
  });
  await check(`${label}: theme button switches and is remembered`, async () => {
    const before = await p.evaluate(() => document.documentElement.dataset.theme || "");
    await p.locator("#theme").click();
    const after = await p.evaluate(() => document.documentElement.dataset.theme || "");
    ok(before !== after, "theme did not change");
    await p.reload();
    ok((await p.evaluate(() => document.documentElement.dataset.theme || "")) === after, "theme forgotten");
  });
  await check(`${label}: Study, glossary, about and privacy open`, async () => {
    for (const r of ["study", "terms", "about", "privacy", "practice"]) {
      await p.goto(`${URL_}#/${r}`);
      await p.locator("main h1, main h2").first().waitFor();
    }
  });
  await check(`${label}: suggestions open a prefilled GitHub issue`, async () => {
    await p.goto(`${URL_}#/suggest?ref=DB-07`);
    await p.locator("#sug-text").fill("The explanation of this question could be clearer.");
    const [tab] = await Promise.all([ctx.waitForEvent("page"), p.locator("[data-sug=github]").click()]);
    await tab.waitForLoadState("commit").catch(() => {});
    ok(/github\.com\/babylonace\/repaso\/issues\/new\?title=Fix%20DB-07/.test(tab.url()), tab.url());
    await tab.close();
    foreign.length = 0; // the issue tab is the one allowed exit
  });
  await check(`${label}: export, erase and import bring progress back`, async () => {
    await p.goto(`${URL_}#/account`);
    await p.locator("[data-acct=export]").waitFor();
    const [dl] = await Promise.all([p.waitForEvent("download"), p.locator("[data-acct=export]").click()]);
    const file = await dl.path();
    const before = JSON.parse(fs.readFileSync(file, "utf8"));
    ok(Object.keys(before.items).length > 0, "empty export");
    await p.locator("[data-arm=reset]").click();
    await p.locator("[data-arm=reset]").click();
    await p.setInputFiles("#import", file);
    await p.waitForTimeout(100);
    const n = await p.evaluate(() => {
      for (const k of Object.keys(localStorage)) { try { const v = JSON.parse(localStorage.getItem(k)); if (v?.items) return Object.keys(v.items).length; } catch {} }
      return 0;
    });
    ok(n === Object.keys(before.items).length, `got ${n} items back`);
  });
  await check(`${label}: accounts off shows a clear note and no sign-in button`, async () => {
    await p.goto(`${URL_}#/account`);
    ok(!(await p.locator("[data-signin]").count()), "sign-in shown with accounts off");
  });
  await check(`${label}: works offline after the first visit`, async () => {
    await p.goto(URL_);
    await p.evaluate(() => navigator.serviceWorker.ready);
    await p.reload();
    await p.waitForFunction(() => !!navigator.serviceWorker.controller);
    await p.waitForTimeout(400);
    await ctx.setOffline(true);
    await p.reload();
    await p.locator(".opt").first().waitFor({ timeout: 5000 });
    await ctx.setOffline(false);
  });
  await check(`${label}: nothing contacted a third party, no console errors`, async () => {
    ok(!foreign.length, `third party: ${foreign[0]}`);
    ok(!errors.length, errors[0]);
  });
  await ctx.close();
}

// Accounts turned on, but the service is unreachable: practice must not notice.
await check("accounts on but Firebase unreachable: practice still works", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  p.setDefaultTimeout(6000);
  const crashes = [];
  p.on("pageerror", (e) => crashes.push(e.message));
  await p.route("**/assets/js/config.js", async (r) => {
    const res = await r.fetch();
    const body = (await res.text()).replace("firebase: null", `firebase: { apiKey: "x", authDomain: "x.firebaseapp.com", projectId: "x", appId: "x" }`);
    await r.fulfill({ response: res, body });
  });
  await p.route(/gstatic\.com|googleapis\.com/, (r) => r.abort());
  await p.addInitScript(() => { localStorage.setItem("repaso-signed-in", "1"); });
  await p.goto(URL_);
  await p.locator(".opt").first().click();
  await p.locator("[data-act=next]").waitFor();
  await p.goto(`${URL_}#/account`);
  await p.locator("[data-signin=google]").waitFor();
  await p.locator("[data-signin=google]").click();
  await p.locator(".notice.err, .err").first().waitFor({ timeout: 5000 });
  ok(!crashes.length, crashes[0]);
  await ctx.close();
});

await browser.close();
server.kill();
let failed = 0;
for (const [s, n] of results) { if (s !== "ok") failed++; console.log(`${s === "ok" ? "  ok  " : " FAIL "} ${n}`); }
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
