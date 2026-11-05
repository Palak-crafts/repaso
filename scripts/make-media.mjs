// One-off: renders the pictures the README and the link previews use, from the real built site.
//   public/og.png          the preview when a link is shared (1200x630)
//   docs/img/social.png    the same banner at GitHub's social preview size (1280x640)
//   docs/img/demo.gif      a short walk through a session
//   docs/img/*.jpg         screenshots, light and dark, desktop and phone
// Needs Playwright (npm i --no-save playwright) and ffmpeg on the PATH.
// Run: node scripts/make-media.mjs
import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = 4179, URL_ = `http://127.0.0.1:${PORT}/`;
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
const server = spawn(process.execPath, ["scripts/serve.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
fs.mkdirSync("docs/img", { recursive: true });

const browser = await chromium.launch();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const seedTheme = (theme) => (t) => { try { localStorage.setItem("repaso-theme", t); localStorage.setItem("repaso-prefs-v1", JSON.stringify({ lang: "en" })); } catch {} };

/** Finds, in the page, which option button holds the right answer of the question on screen. */
const rightOption = (page) => page.evaluate(async () => {
  window.__bank ||= await (await fetch("data/bank.en.json")).json();
  const norm = (s) => s.replace(/[`*_\s]/g, "");
  const title = norm(document.querySelector(".qtext")?.textContent || "");
  const q = window.__bank.questions.find((x) => x.t === "m" && norm(x.q) === title);
  const opts = [...document.querySelectorAll(".opt")];
  if (!opts.length) return null;
  const k = q ? opts.findIndex((o) => norm(o.lastElementChild.textContent) === norm(q.o[q.a])) : -1;
  return { right: k < 0 ? 0 : k, n: opts.length };
});

/* ---------- 1. banner ---------- */
async function banner(file, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
  const p = await ctx.newPage();
  await p.addInitScript(seedTheme("dark"), "dark");
  await p.goto(URL_);
  await p.locator(".opt").first().waitFor();
  await p.evaluate(async () => {
    const d = await (await fetch("data/bank.en.json")).json();
    const q = d.questions.find((x) => x.t === "m" && !x.c && x.l === 0 && /framework|index|thread/i.test(x.q)) || d.questions.find((x) => x.t === "m" && !x.c);
    const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const topic = d.topics.find((t) => t.k === q.cat).name;
    const st = document.createElement("style");
    st.textContent = `body{display:block;overflow:hidden}#bn{height:100vh;display:grid;grid-template-columns:1.08fr .92fr;gap:54px;align-items:center;padding:0 76px}
      #bn .hero-copy{gap:22px}.brand.big{font-size:2.5rem}.brand.big img{width:68px;height:68px;border-radius:19px}
      #bn h1{font-size:3.6rem}#bn .lead{font-size:1.3rem}#bn .pills{display:flex;flex-wrap:wrap;gap:10px}
      #bn .pills span{padding:6px 16px;border-radius:999px;background:var(--glass);border:1px solid var(--glass-line);font-weight:700;font-size:.95rem;color:var(--ink-2)}
      #bn .beam::before{animation:none;--ang:210deg}#bn .deck .card{transform:rotate(1.6deg)}`;
    document.head.append(st);
    document.body.innerHTML = `<div id="bn"><div class="hero-copy">
      <div class="brand big"><img src="icon.svg" alt=""><span>Repaso</span></div>
      <h1>Practice for your <mark class="grad">software interview</mark>.</h1>
      <p class="lead">${d.questions.length} questions. English and Spanish. No signup.</p>
      <div class="pills"><span>Python</span><span>Java</span><span>Spring</span><span>SQL</span><span>System design</span><span>Security</span></div></div>
      <div class="deck"><article class="card beam"><div class="qmeta"><a>${esc(topic)}</a><span>Foundations</span></div>
      <p class="qtext">${esc(q.q)}</p>
      <div class="opts">${q.o.map((o, i) => `<div class="opt ${i === q.a ? "ok" : "dim"}" style="animation:none"><span class="k">${i + 1}</span><span>${esc(o)}</span></div>`).join("")}</div></article></div></div>`;
  });
  await wait(700);
  await p.screenshot({ path: file });
  await ctx.close();
}
await banner("public/og.png", 1200, 630);
await banner("docs/img/social.png", 1280, 640);

/* ---------- 2. screenshots ---------- */
async function shot(name, { theme, w, h, dpr = 1, hash = "#/", after }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, colorScheme: theme, locale: "en-US" });
  const p = await ctx.newPage();
  await p.addInitScript(seedTheme(theme), theme);
  await p.goto(URL_ + hash);
  await p.locator(".opt, .chip").first().waitFor();
  await p.evaluate(() => document.querySelectorAll(".rv").forEach((e) => e.classList.add("in")));
  if (after) await after(p);
  await wait(900);
  await p.screenshot({ path: `docs/img/${name}.jpg`, type: "jpeg", quality: 90 });
  await ctx.close();
}
await shot("home-dark", { theme: "dark", w: 1280, h: 800 });
await shot("home-light", { theme: "light", w: 1280, h: 800 });
await shot("mobile-dark", { theme: "dark", w: 390, h: 844, dpr: 2 });
await shot("mobile-light", { theme: "light", w: 390, h: 844, dpr: 2 });
await shot("topics-dark", { theme: "dark", w: 1280, h: 760, after: async (p) => { await p.evaluate(() => document.querySelector(".topics").scrollIntoView({ block: "center" })); await wait(900); } });

/* ---------- 3. the demo ---------- */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "repaso-demo-"));
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, colorScheme: "dark", locale: "en-US", recordVideo: { dir: tmp, size: { width: 1280, height: 720 } } });
  const p = await ctx.newPage();
  await p.addInitScript(seedTheme("dark"), "dark");
  // a visible pointer, because the video does not draw one
  await p.addInitScript(() => addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style");
    st.textContent = "body::before{animation:none!important}";
    document.head.append(st);
    const c = document.createElement("div");
    c.style.cssText = "position:fixed;left:0;top:0;width:22px;height:22px;margin:-4px 0 0 -4px;border-radius:50%;background:rgba(255,255,255,.92);border:2px solid #5b45ee;box-shadow:0 4px 14px rgba(0,0,0,.45);z-index:99999;pointer-events:none;transition:transform .12s;opacity:0";
    document.body.append(c);
    addEventListener("mousemove", (e) => { c.style.opacity = "1"; c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; });
    addEventListener("mousedown", () => { c.style.transform = "scale(.75)"; });
    addEventListener("mouseup", () => { c.style.transform = "scale(1)"; });
  }));
  await p.goto(URL_);
  await p.locator(".opt").first().waitFor();
  const t0 = Date.now();
  const click = async (sel, steps = 22) => {
    const b = await p.locator(sel).first().boundingBox();
    await p.mouse.move(b.x + b.width * 0.55, b.y + b.height / 2, { steps });
    await wait(180);
    await p.mouse.down(); await wait(70); await p.mouse.up();
  };
  const answer = async (right) => {
    const r = await rightOption(p);
    if (!r) { // a flashcard: show it, then say we knew it
      await click("[data-act=reveal]"); await wait(900); await click("[data-act=got]"); return "card";
    }
    const k = right ? r.right : (r.right + 1) % r.n;
    await click(`.opt[data-k="${k}"]`);
    return "mc";
  };
  await p.mouse.move(250, 560); await wait(700);
  await p.mouse.move(930, 330, { steps: 30 }); await wait(1000);
  // 1. a right answer from the home page, then the explanation
  await answer(true);
  await wait(900);
  await p.screenshot({ path: "docs/img/quiz-dark.jpg", type: "jpeg", quality: 90 });
  await p.mouse.wheel(0, 300); await wait(1200);
  // 2. one wrong answer (flashcards are skipped, they have no wrong option)
  const nextIfAny = async (steps = 22) => { if (await p.locator("[data-act=next]").count()) await click("[data-act=next]", steps); };
  await nextIfAny(16); await wait(500);
  for (let i = 0; i < 4; i++) {
    const kind = await answer(false);
    if (kind === "mc") { await wait(1300); break; }
    await wait(400);
  }
  // 3. a quick run of right ones, then end the session
  for (let i = 0; i < 3; i++) {
    await nextIfAny(10); await wait(250);
    await answer(true); await wait(550);
  }
  await click("[data-act=end]", 10); await wait(450);
  // 4. results
  await p.screenshot({ path: "docs/img/results-dark.jpg", type: "jpeg", quality: 90 });
  await wait(1700);
  await click("[data-act=home]", 12); await wait(700);
  await click("#lang", 12); await wait(1000);
  await click("#theme", 10); await wait(1000);
  await p.mouse.move(640, 420, { steps: 8 });
  await p.mouse.wheel(0, 640); await wait(1500);
  console.log(`demo: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await ctx.close();
}
const video = fs.readdirSync(tmp).find((f) => f.endsWith(".webm"));
const vf = "fps=10,scale=760:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle";
execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "0.6", "-i", path.join(tmp, video), "-vf", vf, "-loop", "0", "docs/img/demo.gif"], { stdio: "inherit" });
fs.rmSync(tmp, { recursive: true, force: true });

await browser.close();
server.kill();
for (const f of ["public/og.png", ...fs.readdirSync("docs/img").map((x) => "docs/img/" + x)]) console.log(f.padEnd(28), Math.round(fs.statSync(f).size / 1024), "KB");
