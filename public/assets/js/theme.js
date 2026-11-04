// Runs before first paint so a saved theme never flashes the wrong colors.
try {
  var t = localStorage.getItem("repaso-theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) { /* private window: follow the system theme */ }
