// Optional accounts and cloud progress. This file is only loaded when a person chooses
// to sign in, or already signed in before. Anyone else never contacts Google.
// Every failure here stays here: local practice does not depend on this module.
import { CONFIG } from "./config.js";

const fb = CONFIG.firebase;
const emu = CONFIG.emulator; // only set by the local account tests
const FIRESTORE = `${emu?.firestore ?? "https://firestore.googleapis.com"}/v1/projects/${fb?.projectId}/databases/(default)/documents`;
const sdk = (name) => `https://www.gstatic.com/firebasejs/${CONFIG.sdkVersion}/firebase-${name}.js`;

let A = null, auth = null;

async function load() {
  if (auth) return;
  const [{ initializeApp }, mod] = await Promise.all([import(sdk("app")), import(sdk("auth"))]);
  A = mod;
  auth = A.getAuth(initializeApp(fb));
  if (emu) A.connectAuthEmulator(auth, emu.auth, { disableWarnings: true });
}

export async function watchUser(cb) {
  await load();
  await auth.authStateReady();
  A.onAuthStateChanged(auth, cb);
}
// A sign-in that hit an existing account with the same e-mail keeps its credential here until the person
// signs in with the method they used before. Then the two are linked, so both buttons open the same account.
let pendingLink = null;
export async function signIn(providerId) {
  await load();
  const P = providerId === "github" ? A.GithubAuthProvider : A.GoogleAuthProvider;
  try {
    const res = await A.signInWithPopup(auth, new P());
    if (pendingLink) {
      const cred = pendingLink;
      pendingLink = null;
      try { await A.linkWithCredential(res.user, cred); } catch { /* different e-mail or already linked: keep the sign-in */ }
    }
  } catch (e) {
    if (e?.code === "auth/account-exists-with-different-credential") {
      pendingLink = P.credentialFromError(e);
      const err = new Error("link needed");
      err.code = "repaso/link-needed";
      throw err;
    }
    throw e;
  }
}
export async function signOutUser() { await load(); await A.signOut(auth); }

async function call(path, init = {}) {
  const token = await auth.currentUser.getIdToken();
  return fetch(path.startsWith(":") ? `${FIRESTORE}${path}` : `${FIRESTORE}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
}
const userDoc = () => `users/${auth.currentUser.uid}`;

/** Returns the saved progress object, or null when this account has none yet. */
export async function pull() {
  const r = await call(userDoc());
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`pull ${r.status}`);
  const j = await r.json();
  return JSON.parse(j.fields?.data?.stringValue || "null");
}
/** Progress is stored as one JSON string, in one document per person. One save = one write. */
export async function push(progress) {
  const body = { fields: { data: { stringValue: JSON.stringify(progress) }, updatedAt: { timestampValue: new Date().toISOString() } } };
  const json = JSON.stringify(body);
  // keepalive lets the last save survive a closing tab, but the browser caps such a request at 64 KB
  const r = await call(userDoc(), { method: "PATCH", body: json, keepalive: json.length < 60000 });
  if (!r.ok) throw new Error(`push ${r.status}`);
}
export async function suggest({ kind, ref, text, lang }) {
  const body = { fields: {
    uid: { stringValue: auth.currentUser.uid }, kind: { stringValue: kind }, ref: { stringValue: ref || "" },
    text: { stringValue: text }, lang: { stringValue: lang }, createdAt: { timestampValue: new Date().toISOString() },
  } };
  const r = await call("suggestions", { method: "POST", body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`suggest ${r.status}`);
}
/** Erases the cloud document and the suggestions, then the account. Firebase may ask for a fresh sign-in first. */
export async function deleteAccount() {
  const uid = auth.currentUser.uid;
  const q = await call(":runQuery", { method: "POST", body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: "suggestions" }],
    where: { fieldFilter: { field: { fieldPath: "uid" }, op: "EQUAL", value: { stringValue: uid } } },
  } }) });
  if (!q.ok) throw new Error(`suggestions ${q.status}`);
  for (const row of await q.json()) {
    const name = row.document?.name; // full path: projects/.../documents/suggestions/<id>
    if (!name) continue;
    const d = await call(name.split("/documents/")[1], { method: "DELETE" });
    if (!d.ok && d.status !== 404) throw new Error(`delete suggestion ${d.status}`);
  }
  const r = await call(userDoc(), { method: "DELETE" });
  if (!r.ok && r.status !== 404) throw new Error(`delete ${r.status}`);
  try { await A.deleteUser(auth.currentUser); }
  catch (e) {
    if (e.code !== "auth/requires-recent-login") throw e;
    const id = auth.currentUser.providerData[0]?.providerId;
    await A.reauthenticateWithPopup(auth.currentUser, id === "github.com" ? new A.GithubAuthProvider() : new A.GoogleAuthProvider());
    await A.deleteUser(auth.currentUser);
  }
}
