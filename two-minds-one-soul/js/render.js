// Interface
// Sprites kept in case assets don't load
const cv = document.getElementById('game'), ctx = cv.getContext('2d');

function sprite(name, w, x, y) {
  const im = getImg(name, w);
  if (im) ctx.drawImage(im, x * TILE, y * TILE, TILE, TILE);
  return !!im;
}

function drawTile(t, x, y, w, P) {
  const T = TILE, px = x * T, py = y * T;
  if (t === '#') {
    if (!sprite('wall', w, x, y)) { ctx.fillStyle = P.wall; ctx.fillRect(px, py, T, T); ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.strokeRect(px + .5, py + .5, T - 1, T - 1); }
    return;
  }
  if (!sprite('floor', w, x, y)) { ctx.fillStyle = P.floor; ctx.fillRect(px, py, T, T); ctx.strokeStyle = P.grid; ctx.lineWidth = 1; ctx.strokeRect(px + .5, py + .5, T - 1, T - 1); }
  const cx = px + T / 2, cy = py + T / 2;
  if (t === 't') {
    if (w !== 'light' || !sprite('danger', 'light', x, y)) {
      ctx.fillStyle = PALETTE.light.void; ctx.fillRect(px, py, T, T);
    }
  } else if (t === 'v') {
    if (w !== 'dark' || !sprite('danger', 'dark', x, y)) {
      ctx.fillStyle = PALETTE.dark.void; ctx.fillRect(px, py, T, T);
    }
  } else if (t === 'P' || t === 'Q') {
    const on = Game.pressed(x, y);
    if (!sprite(on ? 'plate_on' : 'plate', w, x, y)) {
      ctx.fillStyle = LINK_COL[t]; ctx.globalAlpha = on ? 1 : .4; ctx.beginPath(); ctx.arc(cx, cy, T / 2 - 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = LINK_COL[t]; ctx.lineWidth = 3; ctx.stroke();
    }
  } else if (t === 'D' || t === 'R') {
    const open = Game.doorOpen(x, y);
    if (!sprite(open ? 'door_open' : 'door', w, x, y)) {
      ctx.fillStyle = ctx.strokeStyle = LINK_COL[t];
      if (open) { ctx.globalAlpha = .2; ctx.fillRect(px + 4, py + 4, T - 8, T - 8); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.strokeRect(px + 4, py + 4, T - 8, T - 8); ctx.setLineDash([]); }
      else ctx.fillRect(px + 3, py + 3, T - 6, T - 6);
    }
  } else if (t === 'G' && !sprite('barrier', w, x, y)) {
    ctx.fillStyle = P.barrier; ctx.fillRect(px + 3, py + 3, T - 6, T - 6);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1', cx, cy);
  } else if (t === '*' && !sprite('crystal', w, x, y)) {
    ctx.fillStyle = w === 'light' ? '#f4b400' : '#a98bf5'; ctx.beginPath();
    ctx.moveTo(cx, cy - 15); ctx.lineTo(cx + 11, cy); ctx.lineTo(cx, cy + 15); ctx.lineTo(cx - 11, cy); ctx.fill();
  } else if (t === 'E' && !sprite('exit', w, x, y)) {
    const k = 1 + Math.sin(Game.time * 3) * .08;
    for (let i = 3; i > 0; i--) { ctx.strokeStyle = w === 'light' ? '#f4b400' : '#9a74e6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, i * 7 * k, 0, 7); ctx.stroke(); }
  }
}

function drawChar(c, i, active, w) {
  const T = TILE, cx = c.x * T + T / 2, cy = c.y * T + T / 2, name = WORLD[i];
  ctx.globalAlpha = active ? 1 : .5;
  if (!sprite(name, w, c.x, c.y)) {
    if (i === 0) { ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = active ? 18 : 0; ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(cx, cy, 18, 0, 7); ctx.fill(); }
    else { ctx.shadowColor = '#b9a3f0'; ctx.shadowBlur = active ? 14 : 0; ctx.fillStyle = '#4b2f8f'; ctx.beginPath(); ctx.roundRect(cx - 17, cy - 17, 34, 34, 8); ctx.fill(); }
    ctx.shadowBlur = 0; ctx.fillStyle = i === 0 ? '#3a2c14' : '#fff';
    ctx.beginPath(); ctx.arc(cx - 6, cy - 3, 2.5, 0, 7); ctx.arc(cx + 6, cy - 3, 2.5, 0, 7); ctx.fill();
  }
  if (active) { ctx.strokeStyle = i === 0 ? '#3a2c14' : '#e6defa'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 18, cy + T / 2 - 4); ctx.lineTo(cx + 18, cy + T / 2 - 4); ctx.stroke(); }
  ctx.globalAlpha = 1;
}

function render() {
  const s = Game.s, w = WORLD[s.active], P = PALETTE[w], T = TILE;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.bg; ctx.fillRect(0, 0, cv.width, cv.height);
  if (Game.shake > 0) ctx.translate((Math.random() - .5) * 8, (Math.random() - .5) * 8);
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) drawTile(s.tiles[y][x], x, y, w, P);
  s.boxes.forEach(b => {
    if (sprite('box', w, b.x, b.y)) return;
    ctx.fillStyle = P.box; ctx.fillRect(b.x * T + 8, b.y * T + 8, T - 16, T - 16);
    ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.strokeRect(b.x * T + 8, b.y * T + 8, T - 16, T - 16);
    ctx.beginPath(); ctx.moveTo(b.x * T + 8, b.y * T + 8); ctx.lineTo(b.x * T + T - 8, b.y * T + T - 8); ctx.stroke();
  });
  s.chars.forEach((c, i) => { if (i !== s.active) drawChar(c, i, false, w); });
  drawChar(s.chars[s.active], s.active, true, w);
  if (Game.flashA > 0) { ctx.globalAlpha = Game.flashA; ctx.fillStyle = Game.flashC; ctx.fillRect(-10, -10, cv.width + 20, cv.height + 20); ctx.globalAlpha = 1; }
}
