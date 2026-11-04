// Public settings. Nothing here is secret: a Firebase web config is meant to ship
// to the browser, and access is controlled by firebase/firestore.rules.
export const CONFIG = {
  repo: "babylonace/repaso",
  linkedin: "", // full URL of Adriana's LinkedIn profile. Empty hides the link.
  // Leave null to run without accounts. See docs/firebase-setup.md to turn them on.
  firebase: null,
  providers: ["google", "github"],
  sdkVersion: "13.2.0",
};
