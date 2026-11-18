// Game logic
const Game = {
  s: null, level: 0, paused: true, shake: 0, flashA: 0, flashC: '#fff', time: 0, msg: '', msgT: 0, onWin: null,

  load(i) {
    const L = LEVELS[i], tiles = [], boxes = [], chars = [{}, {}];
    L.map.forEach((row, y) => { tiles[y] = [...row].map((c, x) => {
      if (c === '1') { chars[0] = { x, y }; return '.'; }
      if (c === '2') { chars[1] = { x, y }; return '.'; }
      if (c === 'B') { boxes.push({ x, y }); return '.'; }
      return c;
    }); });
    this.level = i;
    this.s = { tiles, boxes, chars, res: L.start || 0, active: 0, won: false, moves: 0, w: L.map[0].length, h: L.map.length };
  },
restart() { this.load(this.level); Input.held = []; this.say('Level restarted'); },

  say(t) { this.msg = t; this.msgT = 2.2; },
  fail(t) { this.shake = .25; Sound.play('bad'); if (t) this.say(t); },

  switchChar() {
    if (this.paused || this.s.won) return;
    this.s.active = 1 - this.s.active;
    this.flashC = this.s.active ? '#000' : '#fff'; this.flashA = .5;
    Sound.play('switch');
  },

  // ---- objects states ----
  pressed(x, y) { const s = this.s; return s.chars.some(c => c.x === x && c.y === y) || s.boxes.some(b => b.x === x && b.y === y); },
  doorOpen(x, y) {
    const s = this.s, plate = Object.keys(LINKS).find(k => LINKS[k] === s.tiles[y][x]);
    if (this.pressed(x, y)) return true;
    for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) if (s.tiles[j][i] === plate && this.pressed(i, j)) return true;
    return false;
  },
  blocks(ci, x, y) {
    const t = this.s.tiles[y][x];
    return t === '#' || (t === 't' && ci === 0) || (t === 'v' && ci === 1) || ((t === 'D' || t === 'R') && !this.doorOpen(x, y));
  },
  boxCan(x, y) {
    const s = this.s; if (x < 0 || y < 0 || x >= s.w || y >= s.h) return false;
    return '.PQ'.includes(s.tiles[y][x]) && !this.pressed(x, y);
  },

  move(dx, dy) {
    const s = this.s; if (this.paused || s.won) return;
    const c = s.chars[s.active], nx = c.x + dx, ny = c.y + dy;
    if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h) return this.fail();
    const t = s.tiles[ny][nx];
    if (t === 'G') {
      if (s.res > 0) { s.res--; s.tiles[ny][nx] = '.'; Sound.play('open'); this.say('Barrier opened (−1 coin)'); }
      else this.fail('You need 1 coin to pass');
      return;
    }
    if (this.blocks(s.active, nx, ny) || s.chars.some(o => o !== c && o.x === nx && o.y === ny)) return this.fail();
    const b = s.boxes.find(b => b.x === nx && b.y === ny);
    if (b) { if (!this.boxCan(nx + dx, ny + dy)) return this.fail(); b.x += dx; b.y += dy; Sound.play('push'); }
    c.x = nx; c.y = ny; s.moves++;
    if (t === '*') {
      if (s.res < MAX_RESOURCE) { s.res++; s.tiles[ny][nx] = '.'; Sound.play('pick'); }
      else this.say('Reserve full (3/3)');
    }
    if (t === 'E') { s.won = true; this.paused = true; Sound.play('win'); setTimeout(() => this.onWin && this.onWin(), 450); }
  },

  update(dt) {
    this.time += dt; this.shake = Math.max(0, this.shake - dt); this.flashA = Math.max(0, this.flashA - dt * 1.5);
    this.msgT = Math.max(0, this.msgT - dt);
  }
};
