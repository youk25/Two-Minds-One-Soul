// Interface: menu, HUD, settings, main loop
const $ = id => document.getElementById(id);
const overlay = $('overlay'), card = $('card'), pips = [...document.querySelectorAll('#res span')];
const ACTIONS = { up:'Up', down:'Down', left:'Left', right:'Right', switch:'Switch character', restart:'Restart' };

function showCard(html) { card.innerHTML = html; overlay.classList.remove('hidden'); Game.paused = true; }
function hideCard() { overlay.classList.add('hidden'); Game.paused = false; }
function keysText() {
  const k = Input.keys, l = a => Input.label(k[a]);
  return `Move: arrow keys · Switch character: ${l('switch')} · Restart: ${l('restart')} or button`;
}

function startLevel(i) {
  Game.load(i); cv.width = Game.s.w * TILE; cv.height = Game.s.h * TILE;
  $('lvl').textContent = `Level ${i + 1}/${LEVELS.length}`;
  $('hint').textContent = LEVELS[i].hint; $('keysLine').textContent = keysText();
  hideCard();
}

function showMenu() {
  showCard(`<h2>Two Minds One Soul</h2>
    <p>One mind, two voices. LIGHT keeps hope alive, DARK carries the fears. They share the same world without seeing it the same way.</p>
    <p class="small">${keysText()}</p><button id="play" class="big">Play</button>`);
  $('play').onclick = () => startLevel(0); $('play').focus();
}

Game.onWin = () => {
  const last = Game.level === LEVELS.length - 1;
  showCard(last
    ? `<h2>Light overcame the darkness</h2><p><em>Together, they found the way out. Even in the darkest place, there is always a light.</em></p><button id="nx" class="big">Back to menu</button>`
    : `<h2>Level complete</h2><p>${Game.s.moves} moves.</p><button id="nx" class="big">Next level</button> <button id="rp">Replay this level</button>`);
    $('nx').onclick = () => last ? location.href = '../main.html' : startLevel(Game.level + 1);
  if ($('rp')) $('rp').onclick = () => startLevel(Game.level);
  $('nx').focus();
};

function openSettings() {
  const rows = Object.keys(ACTIONS).map(a => `<div class="row"><span>${ACTIONS[a]}</span>
    <button data-a="${a}">${Input.listening === a ? 'Press a key…' : Input.label(Input.keys[a])}</button></div>`).join('');
  showCard(`<h2>Settings</h2>${rows}
    <div class="row"><span>Hold-to-move speed: <b id="repV">${Input.repeatMs}</b> ms</span>
    <input id="rep" type="range" min="60" max="300" step="10" value="${Input.repeatMs}"></div>
    <p class="small">Click a key to change it (Esc to cancel).</p>
    <button id="reset">Default keys</button> <button id="close" class="big">Close</button>`);
  card.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { Input.listening = b.dataset.a; openSettings(); });
  $('rep').oninput = e => { Input.repeatMs = +e.target.value; $('repV').textContent = e.target.value; Input.save(); };
  $('reset').onclick = () => { Object.assign(Input.keys, DEFAULT_KEYS); Input.save(); openSettings(); };
  $('close').onclick = () => { $('keysLine').textContent = keysText(); hideCard(); };
}
Input.onRebind = openSettings;

// HUD buttons (we remove focus so SPACE doesn't "click" them)
const btn = (id, fn) => $(id).onclick = e => { fn(); e.currentTarget.blur(); };
btn('bRestart', () => { if (!Game.paused) Game.restart(); });
btn('bSet', () => { if (!Game.paused) openSettings(); });
btn('bMute', () => { Sound.on = !Sound.on; $('bMute').textContent = 'Sound: ' + (Sound.on ? 'on' : 'off'); });

function hud() {
  const s = Game.s, w = WORLD[s.active];
  document.body.dataset.world = w;
  $('who').textContent = w === 'light' ? 'LIGHT' : 'DARK';
  pips.forEach((p, i) => p.classList.toggle('on', i < s.res));
  $('resN').textContent = s.res + ' / ' + MAX_RESOURCE;
  $('msg').className = Game.msgT > 0 ? 'on' : '';
  if (Game.msgT > 0) $('msg').innerHTML = '<span></span>', $('msg').firstChild.textContent = Game.msg;
}

let prev = 0;
function loop(t) {
  const dt = Math.min((t - prev) / 1000, .1); prev = t;
  Input.tick(t); Game.update(dt); render(); hud();
  requestAnimationFrame(loop);
}

startLevel(0); requestAnimationFrame(loop);