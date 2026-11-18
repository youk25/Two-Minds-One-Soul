const TILE = 70;            // tile size in pixels
const MAX_RESOURCE = 3;     // maximum capacity of coins (instruction : 3 or less)
const WORLD = ['light', 'dark'];   // index 0 = LIGHT, 1 = DARK

// Levers and doors are linked by a letter: P opens D, Q opens R
const LINKS = { P: 'D', Q: 'R' };
const LINK_COL = { P: '#e9a100', D: '#e9a100', Q: '#2fb6a0', R: '#2fb6a0' };

// Colors in case assets don't load
const PALETTE = {
  light: { bg:'#fff4d6', floor:'#fffaf0', grid:'#f0e2b8', void:'#282829' },
  dark:  { bg:'#07050c', floor:'#969595', grid:'#0c0c0c', void:'#efe0b0' }
};

const ASSETS = {
  light:        '../assets/player-light.png',
  dark:         '../assets/player-dark.png',
  wall_light:   '../assets/wall-light.png',
  wall_dark:    '../assets/wall-dark.png',
  danger_light: '../assets/danger-light.png',
  danger_dark:  '../assets/danger-dark.png',
  door:         '../assets/door-closed.png',
  door_open:    '../assets/door-open.png',
  plate: '../assets/lever-closed.png',
  plate_on: '../assets/lever-open.png',
  box:     '../assets/box.png',
  crystal:    '../assets/coin.png',
  barrier:    '../assets/barrier.png',
  exit:       '../assets/end.png',
};
const IMG = {};
Object.entries(ASSETS).forEach(([k, src]) => { const i = new Image(); i.onload = () => IMG[k] = i; i.src = src; });
function getImg(name, world) { return IMG[name + '_' + world] || IMG[name] || null; }

// ===== Touches par défaut (event.code = touche physique) =====
const DEFAULT_KEYS = { up:'ArrowUp', down:'ArrowDown', left:'ArrowLeft', right:'ArrowRight', switch:'Space', restart:'KeyR' };
const ALT_KEYS = {};   // touches alternatives (vide : flèches uniquement)
