/**
 * THE CODEX — Sound design synthétisé (GDD §11).
 * Tous les sons sont générés via WebAudio : aucun asset binaire,
 * zéro dépendance, fonctionne 100 % hors-ligne.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  let ctx = null;
  let masterGain = null;
  let ambienceNodes = null;

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume();
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function volume() {
    const s = Codex.state && Codex.state.data ? Codex.state.data.settings : null;
    return s ? Math.max(0, Math.min(1, s.volume / 100)) : 0.7;
  }

  function applyVolume() {
    if (masterGain) masterGain.gain.value = volume();
  }

  /** Oscillateur simple avec enveloppe et glissando optionnel. */
  function tone(freq, dur, { type = "sine", gain = 0.12, when = 0, slideTo = null } = {}) {
    const c = ensureCtx();
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** Bruit filtré (souffle, papier, statique radio…). */
  function noise(dur, { gain = 0.08, when = 0, freq = 1000, q = 1, type = "bandpass", slideTo = null } = {}) {
    const c = ensureCtx();
    const t0 = c.currentTime + when;
    const len = Math.ceil(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t0);
    if (slideTo) filter.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
    filter.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(g).connect(masterGain);
    src.start(t0);
  }

  const sfx = {
    click() { tone(850, 0.04, { type: "square", gain: 0.06 }); },
    hover() { tone(1300, 0.025, { gain: 0.025 }); },
    paper() { noise(0.35, { freq: 2400, gain: 0.05, slideTo: 900 }); },
    stamp() {
      noise(0.08, { freq: 350, gain: 0.2, type: "lowpass" });
      tone(95, 0.16, { type: "sine", gain: 0.25, slideTo: 50 });
    },
    scanner() { tone(1250, 0.55, { type: "sawtooth", gain: 0.05, slideTo: 280 }); },
    intercept() {
      tone(1500, 0.08, { type: "square", gain: 0.05 });
      tone(1900, 0.08, { type: "square", gain: 0.05, when: 0.09 });
      noise(0.18, { freq: 3200, gain: 0.03, when: 0.05 });
    },
    lock() {
      tone(210, 0.05, { type: "square", gain: 0.12 });
      tone(2100, 0.05, { type: "square", gain: 0.06, when: 0.05 });
    },
    popup() {
      noise(0.22, { freq: 700, gain: 0.05, slideTo: 2600 });
      sfx.lock();
    },
    vaultOpen() {
      tone(70, 0.3, { type: "sine", gain: 0.22, slideTo: 45 });
      for (let i = 0; i < 5; i++) tone(170 + i * 40, 0.04, { type: "square", gain: 0.07, when: 0.25 + i * 0.09 });
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.5, { gain: 0.07, when: 0.75 + i * 0.04 }));
    },
    xp() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, { gain: 0.07, when: i * 0.09 })); },
    levelUp() {
      [392, 523, 659, 784].forEach((f, i) => tone(f, 0.6, { gain: 0.08, when: i * 0.12 }));
      tone(1568, 0.9, { gain: 0.05, when: 0.5 });
      noise(0.8, { freq: 5000, gain: 0.02, when: 0.4 });
    },
    medal() {
      tone(1318, 0.7, { gain: 0.09 });
      tone(2637, 0.5, { gain: 0.04, when: 0.05 });
      tone(1976, 0.6, { gain: 0.05, when: 0.18 });
    },
    error() {
      tone(310, 0.2, { type: "triangle", gain: 0.07 });
      tone(293, 0.22, { type: "triangle", gain: 0.07, when: 0.02 });
    },
    tension() {
      tone(110, 0.4, { type: "sawtooth", gain: 0.06 });
      tone(116.5, 0.4, { type: "sawtooth", gain: 0.06 });
    },
    suspicionUp() { tone(440, 0.18, { type: "sawtooth", gain: 0.04, slideTo: 520 }); },
    echo() { tone(784, 0.1, { gain: 0.05 }); tone(988, 0.14, { gain: 0.05, when: 0.1 }); },
    fanfare() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.22, { gain: 0.08, when: i * 0.13 }));
      tone(1319, 0.8, { gain: 0.07, when: 0.78 });
    },
    daily() {
      noise(0.25, { freq: 2000, gain: 0.04 });
      tone(1175, 0.18, { gain: 0.07, when: 0.28 });
    },
    pageTurn() { noise(0.14, { freq: 1800, gain: 0.04, slideTo: 600 }); },
    cultural() {
      tone(1397, 0.25, { gain: 0.07 });
      [2794, 3520, 4186].forEach((f, i) => tone(f, 0.3, { gain: 0.02, when: 0.1 + i * 0.06 }));
    },
    good() { tone(880, 0.1, { gain: 0.07 }); tone(1109, 0.16, { gain: 0.07, when: 0.08 }); },
  };

  /** Ambiance : drone discret + souffle, par type de lieu. */
  function startAmbience() {
    const s = Codex.state.data.settings;
    if (!s.ambience || ambienceNodes) return;
    const c = ensureCtx();
    const g = c.createGain();
    g.gain.value = 0.035;
    const o1 = c.createOscillator();
    o1.type = "sine"; o1.frequency.value = 55;
    const o2 = c.createOscillator();
    o2.type = "sine"; o2.frequency.value = 55.6;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(g.gain);
    o1.connect(g); o2.connect(g);
    g.connect(masterGain);
    o1.start(); o2.start(); lfo.start();
    ambienceNodes = { o1, o2, lfo, g };
  }

  function stopAmbience() {
    if (!ambienceNodes) return;
    try {
      ambienceNodes.o1.stop(); ambienceNodes.o2.stop(); ambienceNodes.lfo.stop();
      ambienceNodes.g.disconnect();
    } catch { /* déjà arrêté */ }
    ambienceNodes = null;
  }

  /** Prononciation via le moteur TTS du système (hors-ligne sous Windows). */
  function speak(text, lang = "en-GB") {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.92;
      const v = window.speechSynthesis.getVoices().find((v) => v.lang === lang || v.lang.startsWith(lang.split("-")[0]));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch { /* TTS indisponible : silencieux */ }
  }

  Codex.audio = { sfx, speak, startAmbience, stopAmbience, applyVolume };
})();
