// Small visual effects, all optional: the page works the same without them.
// - .spot  a soft light that follows the pointer (set as --mx / --my)
// - .tilt  a slight 3D tilt toward the pointer
// - .rv    fades in once when scrolled into view
// - [data-count] counts up to its number once when scrolled into view
const calm = matchMedia("(prefers-reduced-motion: reduce)");
const fine = matchMedia("(hover: hover) and (pointer: fine)");

let io = null;
const seen = new WeakSet();

function countUp(el) {
  const to = +el.dataset.count;
  if (!Number.isFinite(to) || calm.matches) return;
  const t0 = performance.now(), ms = 1100;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    el.textContent = String(Math.round(to * e));
    if (k < 1) requestAnimationFrame(step);
  };
  el.textContent = "0";
  requestAnimationFrame(step);
}

/** Call after the page content changes: wires up any new .rv and [data-count] elements. */
export function scan(root = document) {
  if (!("IntersectionObserver" in window)) { root.querySelectorAll(".rv").forEach((e) => e.classList.add("in")); return; }
  io ||= new IntersectionObserver((list) => {
    for (const x of list) {
      if (!x.isIntersecting) continue;
      io.unobserve(x.target);
      x.target.classList.add("in");
      if (x.target.dataset.count) countUp(x.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  root.querySelectorAll(".rv, [data-count]").forEach((e) => { if (!seen.has(e)) { seen.add(e); io.observe(e); } });
}

export function initFx() {
  let raf = 0;
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || !fine.matches) return;
    const el = e.target.closest?.(".spot, .tilt");
    if (!el) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (el.classList.contains("tilt") && !calm.matches) {
        el.style.setProperty("--ry", `${((x / r.width) - 0.5) * 6}deg`);
        el.style.setProperty("--rx", `${(0.5 - (y / r.height)) * 5}deg`);
      }
    });
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    const el = e.target.closest?.(".tilt");
    if (el && !el.contains(e.relatedTarget)) { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); }
  });
}
