/**
 * THE CODEX — Musique adaptative générative (GDD §11.2).
 * Bande-son procédurale en WebAudio : aucun fichier audio.
 *
 * 4 états : calm (QG) → exploration → tension → climax.
 * Chaque état ajoute des couches (pad, basse, mélodie, arpège, hats).
 * Palette par langue (GDD §11.3) : Londres = jazz électronique feutré,
 * Paris = valse manouche mineure (3 temps, accordéon synthétique).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  // ---------- Thèmes ----------
  // notes en demi-tons MIDI ; progressions = degrés d'accords par mesure
  const N = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  const THEMES = {
    // Londres — Am · F · C · G, 4/4, feutré nocturne
    "en-UK": {
      bpm: 88,
      beatsPerBar: 4,
      swing: 0.18,
      chords: [
        [57, 60, 64], // Am
        [53, 57, 60], // F
        [48, 52, 55], // C
        [55, 59, 62], // G
      ],
      bassOffset: -24,
      scale: [57, 60, 62, 64, 67, 69, 72, 76], // A min pentatonique étendue
      lead: { type: "triangle", gain: 0.045, cutoff: 2400 },
      pad: { type: "sine", gain: 0.035, detune: 4 },
      bass: { type: "triangle", gain: 0.075 },
      hat: { freq: 7000, gain: 0.012 },
    },
    // Madrid — Am · G · F · E (cadence andalouse), guitare flamenca
    "es-ES": {
      bpm: 112,
      beatsPerBar: 4,
      swing: 0.08,
      chords: [
        [57, 60, 64], // Am
        [55, 59, 62], // G
        [53, 57, 60], // F
        [52, 56, 59], // E
      ],
      bassOffset: -12,
      scale: [57, 59, 60, 62, 64, 65, 68, 69], // mode phrygien dominant coloré
      lead: { type: "triangle", gain: 0.04, cutoff: 2600 },
      pad: { type: "sawtooth", gain: 0.014, detune: 6, cutoff: 1100 },
      bass: { type: "triangle", gain: 0.08 },
      hat: { freq: 7500, gain: 0.014 },
    },
    // Berlin — Am · Am · F · G, motorik minimal, séquenceur
    "de-DE": {
      bpm: 122,
      beatsPerBar: 4,
      swing: 0,
      chords: [
        [57, 60, 64], // Am
        [57, 60, 64], // Am
        [53, 57, 60], // F
        [55, 59, 62], // G
      ],
      bassOffset: -24,
      scale: [57, 60, 62, 64, 67, 69, 72, 74], // A mineur pentatonique étendu
      lead: { type: "square", gain: 0.022, cutoff: 1900 },
      pad: { type: "sawtooth", gain: 0.011, detune: 4, cutoff: 700 },
      bass: { type: "square", gain: 0.055 },
      hat: { freq: 8000, gain: 0.011 },
    },
    // Paris — Dm · Gm · A7 · Dm, 3/4 (valse manouche), accordéon
    "fr-FR": {
      bpm: 132,
      beatsPerBar: 3,
      swing: 0,
      chords: [
        [50, 53, 57], // Dm
        [43, 46, 50], // Gm
        [45, 49, 52, 55], // A7
        [50, 53, 57], // Dm
      ],
      bassOffset: -12,
      scale: [50, 53, 55, 57, 58, 61, 62, 65], // D min harmonique colorée
      lead: { type: "sawtooth", gain: 0.022, cutoff: 1600, detune: 7 }, // accordéon
      pad: { type: "sawtooth", gain: 0.012, detune: 9, cutoff: 900 },
      bass: { type: "triangle", gain: 0.07 },
      hat: { freq: 6000, gain: 0.008 },
    },
  };

  // Densités par état (probabilité de note de mélodie par croche, couches actives)
  const STATES = {
    calm: { lead: 0.10, arp: false, hats: false, padOct: false, bassBeats: [0] },
    exploration: { lead: 0.18, arp: false, hats: false, padOct: false, bassBeats: [0, 2] },
    tension: { lead: 0.25, arp: true, hats: true, padOct: false, bassBeats: [0, 2] },
    climax: { lead: 0.4, arp: true, hats: true, padOct: true, bassBeats: [0, 1, 2, 3] },
  };

  let current = null; // { themeId, theme, state, step, bar, nextTime, timer, stateGain }
  let lastLeadIdx = 3;

  function voice(ctx, dest, { freq, t0, dur, type = "sine", gain = 0.05, attack = 0.02, detune = 0, cutoff = null }) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    let node = osc;
    if (cutoff) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = cutoff;
      osc.connect(f);
      node = f;
    }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur * 0.55));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    node.connect(g).connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.1);
  }

  function hatHit(ctx, dest, t0, freq, gain) {
    const len = Math.ceil(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
    src.connect(f).connect(g).connect(dest);
    src.start(t0);
  }

  /** Programme une croche (demi-temps) de musique. */
  function scheduleStep(ctx, dest, c, t0) {
    const th = c.theme;
    const st = STATES[c.state];
    const stepsPerBar = th.beatsPerBar * 2; // croches
    const stepInBar = c.step % stepsPerBar;
    const beat = Math.floor(stepInBar / 2);
    const offBeat = stepInBar % 2 === 1;
    const chord = th.chords[c.bar % th.chords.length];
    const eighth = 30 / th.bpm; // durée d'une croche
    const swingDelay = offBeat ? th.swing * eighth : 0;
    const t = t0 + swingDelay;

    // PAD — accord tenu en début de mesure
    if (stepInBar === 0) {
      const barDur = th.beatsPerBar * 2 * eighth;
      for (const m of chord) {
        voice(ctx, dest, { freq: N(m), t0: t, dur: barDur * 1.05, type: th.pad.type, gain: th.pad.gain, attack: barDur * 0.3, detune: th.pad.detune, cutoff: th.pad.cutoff || 1800 });
        if (st.padOct) {
          voice(ctx, dest, { freq: N(m + 12), t0: t, dur: barDur, type: "sine", gain: th.pad.gain * 0.5, attack: barDur * 0.3 });
        }
      }
    }

    // BASSE — fondamentale sur les temps de l'état
    if (!offBeat && st.bassBeats.includes(beat)) {
      voice(ctx, dest, { freq: N(chord[0] + th.bassOffset), t0: t, dur: eighth * 1.6, type: th.bass.type, gain: th.bass.gain, attack: 0.01 });
    }

    // MÉLODIE — marche aléatoire sur la gamme
    if (Math.random() < st.lead && stepInBar !== 0) {
      lastLeadIdx = Math.max(0, Math.min(th.scale.length - 1, lastLeadIdx + (Math.floor(Math.random() * 5) - 2)));
      voice(ctx, dest, {
        freq: N(th.scale[lastLeadIdx] + 12), t0: t, dur: eighth * (Math.random() < 0.3 ? 3 : 1.4),
        type: th.lead.type, gain: th.lead.gain, attack: 0.03, detune: th.lead.detune || 0, cutoff: th.lead.cutoff,
      });
    }

    // ARPÈGE — notes d'accord en croches (tension+)
    if (st.arp && offBeat) {
      const note = chord[(c.step >> 1) % chord.length];
      voice(ctx, dest, { freq: N(note + 24), t0: t, dur: eighth * 0.9, type: "square", gain: 0.013, attack: 0.005, cutoff: 3200 });
    }

    // HATS
    if (st.hats && (offBeat || c.state === "climax")) {
      hatHit(ctx, dest, t, th.hat.freq, th.hat.gain * (offBeat ? 1 : 0.6));
    }

    c.step += 1;
    if (c.step % stepsPerBar === 0) c.bar += 1;
  }

  function tick() {
    if (!current) return;
    const { ctx, musicGain } = Codex.audio._ensure();
    const eighth = 30 / current.theme.bpm;
    while (current.nextTime < ctx.currentTime + 0.4) {
      scheduleStep(ctx, current.stateGain, current, current.nextTime);
      current.nextTime += eighth;
    }
  }

  const music = {
    /** Démarre (ou poursuit) le thème donné dans l'état donné. */
    play(themeId, state = "exploration") {
      const s = Codex.state && Codex.state.data.settings;
      if (s && s.volMusic === 0) return;
      if (!THEMES[themeId]) themeId = "en-UK";
      if (current && current.themeId === themeId) {
        music.setState(state);
        return;
      }
      music.stop(0.4);
      const { ctx, musicGain } = Codex.audio._ensure();
      const stateGain = ctx.createGain();
      stateGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      stateGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
      stateGain.connect(musicGain);
      current = {
        themeId,
        theme: THEMES[themeId],
        state: STATES[state] ? state : "exploration",
        step: 0,
        bar: 0,
        nextTime: ctx.currentTime + 0.1,
        stateGain,
        timer: setInterval(tick, 120),
      };
    },

    setState(state) {
      if (current && STATES[state]) current.state = state;
    },

    state() { return current ? current.state : null; },

    stop(fade = 0.8) {
      if (!current) return;
      const c = current;
      current = null;
      clearInterval(c.timer);
      try {
        const { ctx } = Codex.audio._ensure();
        c.stateGain.gain.setValueAtTime(c.stateGain.gain.value, ctx.currentTime);
        c.stateGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
        setTimeout(() => { try { c.stateGain.disconnect(); } catch { /* ok */ } }, fade * 1000 + 200);
      } catch { /* contexte audio absent */ }
    },

    /** Sting de victoire dans la couleur du thème (Intel Reveal, GDD §11.6). */
    sting(themeId) {
      const th = THEMES[themeId] || THEMES["en-UK"];
      const { ctx, musicGain } = Codex.audio._ensure();
      const t0 = ctx.currentTime + 0.05;
      const chord = th.chords[0];
      chord.forEach((m, i) => {
        voice(ctx, musicGain, { freq: N(m + 12), t0: t0 + i * 0.07, dur: 1.4, type: th.lead.type, gain: 0.05, attack: 0.02, cutoff: 2800 });
      });
      voice(ctx, musicGain, { freq: N(chord[0] + 24), t0: t0 + 0.3, dur: 1.6, type: "sine", gain: 0.05, attack: 0.05 });
      voice(ctx, musicGain, { freq: N(chord[0] - 12), t0, dur: 1.8, type: "triangle", gain: 0.07, attack: 0.02 });
    },
  };

  Codex.music = music;
})();
