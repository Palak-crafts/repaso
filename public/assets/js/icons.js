// One small line icon and one accent hue per topic. Drawn here, 24x24, stroke only, so they
// take the text color and need no image requests.
const P = {
  py: '<path d="M16.5 5.5H9a3.5 3.5 0 0 0 0 7h6a3.5 3.5 0 0 1 0 7H7"/><circle cx="17.2" cy="5.5" r=".6" fill="currentColor"/><circle cx="6.8" cy="19.5" r=".6" fill="currentColor"/>',
  jv: '<path d="M5 9.5h11V14a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9.5Z"/><path d="M16 10.5h1.4a2.4 2.4 0 0 1 0 4.8H16M8.5 3.5c0 1.6 1.6 1.6 1.6 3.2M12.5 3.5c0 1.6 1.6 1.6 1.6 3.2"/>',
  spr: '<path d="M5 19c0-8 5-13.500 14-14 0 9-5 14-13 14"/><path d="M5 19l7-7"/>',
  oop: '<path d="m12 3 8 4.500-8 4.500-8-4.500L12 3Z"/><path d="m4 12 8 4.500 8-4.500M4 16.500 12 21l8-4.500"/>',
  api: '<path d="M6 8h11l-3-3M18 16H7l3 3"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.700 3.100 3 7 3s7-1.300 7-3V6M5 12v6c0 1.700 3.100 3 7 3s7-1.300 7-3v-6"/>',
  algo: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 7v3.500M12 10.500 6.800 16.200M12 10.500l5.200 5.700"/>',
  sys: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
  sec: '<path d="m12 3 7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
  fe: '<rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="M3 9.500h18M6.500 7.300h.01M9 7.300h.01"/>',
  ops: '<path d="M7 18a4 4 0 0 1-.6-7.960A6 6 0 0 1 18 9.500 4.300 4.300 0 0 1 17.500 18H7Z"/>',
  vcs: '<circle cx="6" cy="5.500" r="2"/><circle cx="6" cy="18.500" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7.500v9M18 10a6 6 0 0 1-6 6H8.200"/>',
  test: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.800 3h10.400a2 2 0 0 0 1.800-3l-5-9V3"/><path d="M8 15h8"/>',
  beh: '<path d="M4 5h16v11H9.500L4 20.500V5Z"/><path d="M8 9.500h8M8 12.500h5"/>',
};
const HUE = { py: 215, jv: 24, spr: 140, oop: 270, api: 330, db: 190, algo: 45, sys: 255, sec: 355, fe: 200, ops: 175, vcs: 15, test: 105, beh: 300 };

const FALLBACK = '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>';
export const topicIcon = (k) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || FALLBACK}</svg>`;
export const topicHue = (k) => HUE[k] ?? 230;
