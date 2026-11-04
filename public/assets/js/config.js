// Public settings. Nothing here is secret: a Firebase web config is meant to ship
// to the browser, and access is controlled by firebase/firestore.rules.
export const CONFIG = {
  repo: "babylonace/repaso",
  linkedin: "", // full URL of Adriana's LinkedIn profile. Empty hides the link.
  // Leave null to run without accounts. See docs/firebase-setup.md to turn them on.
  firebase: {
    apiKey: "AIzaSyA6pTzQjjkq_QIX1E9qsiWR9YsOQftEwWo",
    authDomain: "repaso-35cd7.firebaseapp.com",
    projectId: "repaso-35cd7",
    appId: "1:374376281521:web:ef315ef427afe3e188f990",
  },
  providers: ["google"], // add "github" once the GitHub sign-in is set up in Firebase
  sdkVersion: "13.2.0",
};
