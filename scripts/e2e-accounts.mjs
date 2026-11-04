// Account tests against the Firebase emulators, with no real project involved.
// Terminal 1: npx firebase-tools emulators:start --only auth,firestore --project demo-repaso (needs Java 21)
// Terminal 2: npm run e2e:accounts
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const PORT = 4181, BASE = `http://127.0.0.1:${PORT}/`;
const PROJECT = "demo-repaso", AUTH = "http://127.0.0.1:9099", STORE = "http://127.0.0.1:8080";
const DOCS = `${STORE}/v1/projects/${PROJECT}/databases/(default)/documents`;
const owner = { Authorization: "Bearer owner" };
const EMAIL = `ana${Date.now()}@example.com`;

// Start from empty emulators, so leftovers from an earlier run cannot be mistaken for this one.
await fetch(`${STORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE", headers: owner });

const server = spawn(process.execPath, ["scripts/serve.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 700));

const results = [];
async function check(name, fn) {
  try { await fn(); results.push(["ok", name]); console.log("  ok  ", name); }
  catch (e) { results.push(["FAIL", name]); console.log(" FAIL ", name, "::", e.message.split("\n")[0]); }
}
const ok = (v, msg) => { if (!v) throw new Error(msg || "assertion failed"); };

const browser = await chromium.launch();
async function device() {
  // Service workers are blocked so the patched config below is what the page really loads.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true, serviceWorkers: "block", locale: "en-US" });
  await ctx.route("**/assets/js/config.js", async (r) => {
    const res = await r.fetch();
    const body = (await res.text()).replace("firebase: null",
      `firebase: { apiKey: "demo", authDomain: "${PROJECT}.firebaseapp.com", projectId: "${PROJECT}", appId: "demo" }, emulator: { auth: "${AUTH}", firestore: "${STORE}" }`);
    await r.fulfill({ response: res, body });
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(12000);
  return { ctx, page };
}
const total = (p) => Object.values(p.items).reduce((n, x) => n + x.n, 0);
const itemCount = (p) => p.evaluate(() => Object.values(JSON.parse(localStorage.getItem("repaso-progress-v1") || '{"items":{}}').items).reduce((n, x) => n + x.n, 0));
async function answer(p) {
  await p.goto(BASE);
  await p.locator(".opt").first().click();
  await p.locator("[data-act=next]").waitFor();
}
async function signIn(p, ctx) {
  await p.goto(`${BASE}#/account`);
  const [popup] = await Promise.all([ctx.waitForEvent("page"), p.locator("[data-signin=google]").click()]);
  await popup.waitForLoadState();
  await popup.locator("#add-account-button").click();
  await popup.locator("#email-input").fill(EMAIL);
  await popup.locator("#display-name-input").fill("Ana Test");
  await popup.locator("#sign-in").click();
  await p.locator("[data-acct=out]").waitFor();
}
async function cloudDoc(minAnswers = 1) {
  for (let i = 0; i < 40; i++) {
    const list = await (await fetch(`${DOCS}/users`, { headers: owner })).json();
    const doc = (list.documents || []).find((d) => /"items"/.test(d.fields?.data?.stringValue || ""));
    if (doc && total(JSON.parse(doc.fields.data.stringValue)) >= minAnswers) return { uid: doc.name.split("/").pop(), data: JSON.parse(doc.fields.data.stringValue) };
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

const a = await device();
let answered = 0, firstUid = null;

await check("practice without an account first", async () => {
  await answer(a.page);
  answered = await itemCount(a.page);
  ok(answered === 1, `answers: ${answered}`);
});
await check("sign up: local progress reaches the cloud", async () => {
  await signIn(a.page, a.ctx);
  const doc = await cloudDoc(answered);
  ok(doc, "no cloud document");
  firstUid = doc.uid;
});
await check("a signed-in person can send a suggestion from the site", async () => {
  await a.page.goto(`${BASE}#/suggest?ref=DB-07`);
  await a.page.locator("#sug-text").fill("This explanation could use a shorter example.");
  await a.page.locator("#sug button[type=submit]").click();
  await a.page.locator("#sug-msg:not(.err)").waitFor();
  await a.page.waitForTimeout(200);
  const list = await (await fetch(`${DOCS}/suggestions`, { headers: owner })).json();
  ok(list.documents?.some((d) => d.fields.ref.stringValue === "DB-07"), "suggestion not stored");
});
await check("sign out: local progress stays and the sign-in buttons return", async () => {
  await a.page.goto(`${BASE}#/account`);
  await a.page.locator("[data-acct=out]").click();
  await a.page.locator("[data-signin=google]").waitFor();
  ok((await itemCount(a.page)) === answered);
});
await check("more practice while signed out, then sign in again: nothing is lost", async () => {
  await answer(a.page);
  answered = await itemCount(a.page);
  ok(answered === 2, `answers: ${answered}`);
  await signIn(a.page, a.ctx);
  const doc = await cloudDoc(answered);
  ok(doc, "cloud did not get the new answer");
  ok(doc.uid === firstUid, "got a different account");
});

const b = await device();
await check("a second device gets the same progress after signing in", async () => {
  await b.page.goto(BASE);
  ok((await itemCount(b.page)) === 0);
  await signIn(b.page, b.ctx);
  await b.page.waitForFunction((n) => Object.values(JSON.parse(localStorage.getItem("repaso-progress-v1")).items).reduce((t, x) => t + x.n, 0) === n, answered).catch(() => {});
  ok((await itemCount(b.page)) === answered, `answers: ${await itemCount(b.page)}`);
});

const idsOf = (p) => p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("repaso-progress-v1")).items));
const hide = (p) => p.evaluate(() => {
  Object.defineProperty(document, "visibilityState", { get: () => "hidden", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
});
async function cloudHas(ids) {
  for (let i = 0; i < 40; i++) {
    const d = await cloudDoc();
    if (d && ids.every((x) => x in d.data.items)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}
await check("two devices signed in at once: the second save keeps what the first one saved", async () => {
  await answer(a.page);                       // device A answers and saves
  const aIds = await idsOf(a.page);
  await hide(a.page);
  ok(await cloudHas(aIds), "A did not reach the cloud");
  // Device B has been open the whole time and has not seen A's answer. It answers without reloading.
  await b.page.evaluate(() => { location.hash = "#/"; });
  await b.page.locator(".opt").first().click();
  await b.page.locator("[data-act=next]").waitFor();
  const bIds = await idsOf(b.page);
  await hide(b.page);
  ok(await cloudHas([...aIds, ...bIds]), "B overwrote A, or never saved");
  ok((await idsOf(b.page)).length >= aIds.length, "B did not take A's answers");
});

/* ---------- security rules, through the REST API like the site uses it ---------- */
async function token(email) {
  const r = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "not-a-real-one", returnSecureToken: true }),
  });
  const j = await r.json();
  return { idToken: j.idToken, uid: j.localId };
}
const stranger = await token(`stranger${Date.now()}@example.com`);
const as = (t) => ({ Authorization: `Bearer ${t}`, "Content-Type": "application/json" });
const now = () => ({ timestampValue: new Date().toISOString() });
const put = (uid, fields, t) => fetch(`${DOCS}/users/${uid}`, { method: "PATCH", headers: as(t), body: JSON.stringify({ fields }) });

await check("rules: nobody can read another person's progress", async () => {
  ok((await fetch(`${DOCS}/users/${firstUid}`, { headers: as(stranger.idToken) })).status === 403);
  ok((await fetch(`${DOCS}/users/${firstUid}`)).status === 403);
});
await check("rules: nobody can overwrite or delete another person's progress", async () => {
  ok((await put(firstUid, { data: { stringValue: "{}" }, updatedAt: now() }, stranger.idToken)).status === 403);
  ok((await fetch(`${DOCS}/users/${firstUid}`, { method: "DELETE", headers: as(stranger.idToken) })).status === 403);
});
await check("rules: your own document accepts data and refuses junk", async () => {
  ok((await put(stranger.uid, { data: { stringValue: "{}" }, updatedAt: now() }, stranger.idToken)).ok);
  ok((await put(stranger.uid, { data: { stringValue: "{}" }, updatedAt: now(), admin: { booleanValue: true } }, stranger.idToken)).status === 403, "extra field accepted");
  ok((await put(stranger.uid, { data: { stringValue: "x".repeat(100001) }, updatedAt: now() }, stranger.idToken)).status === 403, "oversize accepted");
});
await check("rules: suggestions can be sent, validated, not forged and not listed", async () => {
  const f = (text, uid = stranger.uid) => ({ uid: { stringValue: uid }, kind: { stringValue: "new" }, ref: { stringValue: "" }, text: { stringValue: text }, lang: { stringValue: "en" }, createdAt: now() });
  const post = (fields, t) => fetch(`${DOCS}/suggestions`, { method: "POST", headers: t ? as(t) : { "Content-Type": "application/json" }, body: JSON.stringify({ fields }) });
  ok((await post(f("A perfectly fine suggestion"), stranger.idToken)).ok);
  ok((await post(f("short"), stranger.idToken)).status === 403, "short text accepted");
  ok((await post(f("Pretending to be someone else", firstUid), stranger.idToken)).status === 403, "forged uid accepted");
  ok((await post(f("Nobody signed in here at all"))).status === 403, "anonymous accepted");
  ok((await fetch(`${DOCS}/suggestions`, { headers: as(stranger.idToken) })).status === 403, "suggestions readable");
});
await check("rules: other collections are closed", async () => {
  const r = await fetch(`${DOCS}/anything/x`, { method: "PATCH", headers: as(stranger.idToken), body: JSON.stringify({ fields: { a: { stringValue: "b" } } }) });
  ok(r.status === 403);
});

await check("delete account: the cloud document is gone", async () => {
  await a.page.goto(`${BASE}#/account`);
  answered = await itemCount(a.page);
  await a.page.locator("[data-arm=delete]").click();
  await a.page.locator("[data-arm=delete]").click();
  await a.page.locator("[data-signin=google]").waitFor();
  const r = await fetch(`${DOCS}/users/${firstUid}`, { headers: owner });
  ok(r.status === 404, `status ${r.status}`);
  ok((await itemCount(a.page)) >= answered, "local progress should stay");
});
await check("delete account: the suggestions sent from the site are gone too", async () => {
  const list = await (await fetch(`${DOCS}/suggestions`, { headers: owner })).json();
  ok(!(list.documents || []).some((d) => d.fields.uid.stringValue === firstUid), "suggestion left behind");
  ok((list.documents || []).some((d) => d.fields.uid.stringValue === stranger.uid), "someone else's suggestion was removed");
});

await browser.close();
server.kill();
const failed = results.filter(([s]) => s !== "ok").length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
