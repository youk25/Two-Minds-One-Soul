const Input = {
  keys: Object.assign({}, DEFAULT_KEYS), repeatMs: 140, listening: null, held: [], last: 0, onRebind: null,
  dir: { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] },
  load() { try {
    const k = JSON.parse(localStorage.getItem('ls_keys')); if (k) Object.assign(this.keys, k);
    const r = +localStorage.getItem('ls_rep'); if (r) this.repeatMs = r;
  } catch (e) {} },
  save() { try { localStorage.setItem('ls_keys', JSON.stringify(this.keys)); localStorage.setItem('ls_rep', this.repeatMs); } catch (e) {} },
  actionOf(code) { return Object.keys(this.keys).find(a => this.keys[a] === code || ALT_KEYS[a] === code); },
  label(code) {
    const m = { ArrowUp:'↑', ArrowDown:'↓', ArrowLeft:'←', ArrowRight:'→', Space:'Space' };
    return m[code] || code.replace('Key', '').replace('Digit', '');
  },
  tick(now) {
    if (Game.paused) { this.held = []; return; }
    const a = this.held[this.held.length - 1];
    if (a && now - this.last >= this.repeatMs) { Game.move(...this.dir[a]); this.last = now; }
  }
};
Input.load();

addEventListener('keydown', e => {
  if (Input.listening) {
    e.preventDefault();
    if (e.code !== 'Escape') { Input.keys[Input.listening] = e.code; Input.save(); }
    Input.listening = null; Input.onRebind && Input.onRebind(); return;
  }
  if (Game.paused) return;
  const a = Input.actionOf(e.code); if (!a) return;
  e.preventDefault(); if (e.repeat) return;
  if (a === 'switch') Game.switchChar();
  else if (a === 'restart') Game.restart();
  else { Input.held.push(a); Game.move(...Input.dir[a]); Input.last = performance.now() + 120; }
});
addEventListener('keyup', e => { const a = Input.actionOf(e.code); if (a) Input.held = Input.held.filter(h => h !== a); });
