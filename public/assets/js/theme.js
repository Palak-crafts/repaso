// Runs before first paint so a saved theme never flashes the wrong colors.
document.documentElement.classList.add("js"); // lets the CSS use scroll-reveal only when scripts run
try {
  var t = localStorage.getItem("repaso-theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) { /* private window: follow the system theme */ }
// This site has nothing to do inside someone else's frame. Meta CSP cannot set frame-ancestors,
// and GitHub Pages cannot send X-Frame-Options, so hide the page instead.
try { if (window.top !== window.self) document.documentElement.style.display = "none"; } catch (e) { document.documentElement.style.display = "none"; }
