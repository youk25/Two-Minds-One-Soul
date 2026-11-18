const Sound = {
  on: true, ctx: null,
  S: { switch:[[440,.08],[660,.1]], pick:[[700,.07],[1000,.1]], open:[[300,.08],[500,.12]],
       push:[[130,.06]], bad:[[110,.16,'square']], win:[[523,.12],[659,.12],[784,.3]] },
  play(name) {
    if (!this.on) return;
    try {
      const c = this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      let t = c.currentTime;
      this.S[name].forEach(([f, d, type]) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = type || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d); t += d;
      });
    } catch (e) {}
  }
};
