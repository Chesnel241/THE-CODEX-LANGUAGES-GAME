/**
 * THE CODEX — Module vocal : lecture à voix haute et prononciation.
 *
 * 100 % hors-ligne : pas de reconnaissance vocale réseau. Le micro est
 * analysé localement (Web Audio / AnalyserNode) : enveloppe d'énergie,
 * durée parlée, pics de syllabes. La note compare le rythme mesuré au
 * rythme attendu de la phrase (syllabes × tempo de parole) — un vrai
 * entraînement de lecture/prononciation, honnête sur ce qu'il mesure.
 *
 * Sécurité : seul le flux audio local est consommé, jamais enregistré
 * ni transmis (CSP connect-src 'none') ; la piste est coupée après usage.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const FRAME_MS = 50;          // période d'échantillonnage de l'enveloppe
  const MAX_MS = 7000;          // durée max d'une prise
  const TRAIL_SILENCE_MS = 900; // arrêt auto après ce silence (une fois parlé)
  const MS_PER_SYLLABLE = 230;  // tempo moyen de lecture (~4,3 syll./s)

  function supported() {
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /** Estimation du nombre de syllabes : groupes de voyelles (heuristique). */
  function syllables(text, lang) {
    const t = String(text).toLowerCase();
    const groups = t.match(/[aeiouyàâäéèêëîïôöùûüáíóúñœæ]+/g) || [];
    let n = groups.length;
    // Anglais : « e » muet final très fréquent (time, make…)
    if (String(lang).startsWith("en")) {
      const words = t.match(/[a-z']+/g) || [];
      for (const w of words) {
        if (/[a-z]e$/.test(w) && !/(le|ee|ye)$/.test(w) && (w.match(/[aeiouy]+/g) || []).length > 1) n -= 1;
      }
    }
    return Math.max(1, n);
  }

  /** Métriques d'une enveloppe d'énergie (valeurs RMS 0..1 par trame). */
  function analyze(envelope) {
    const peak = Math.max(0, ...envelope);
    const threshold = Math.max(0.015, peak * 0.22);
    let voiced = 0;
    let peaks = 0;
    let lastPeakAt = -10;
    for (let i = 0; i < envelope.length; i++) {
      if (envelope[i] >= threshold) voiced += 1;
      // Pic local au-dessus du seuil, espacé d'au moins ~150 ms (≈ syllabe)
      if (i > 0 && i < envelope.length - 1 &&
          envelope[i] >= threshold &&
          envelope[i] >= envelope[i - 1] && envelope[i] > envelope[i + 1] &&
          i - lastPeakAt >= 3) {
        peaks += 1;
        lastPeakAt = i;
      }
    }
    return { voicedMs: voiced * FRAME_MS, peaks, peak };
  }

  /**
   * Note une prise (0..100) — fonction pure, testée par le smoke test.
   * @param envelope tableau RMS par trame de 50 ms
   * @param text phrase attendue
   * @param lang code langue (en, fr, es, de…)
   */
  function grade(envelope, text, lang) {
    const m = analyze(envelope || []);
    if (m.voicedMs < 200 || m.peak < 0.02) return { score: 0, metrics: m, verdict: "silent" };
    const syl = syllables(text, lang);
    const expectedMs = syl * MS_PER_SYLLABLE;
    const ratioDur = m.voicedMs / expectedMs;
    const ratioSyl = m.peaks / syl;
    const durPenalty = Math.min(1, Math.abs(1 - ratioDur));
    const sylPenalty = Math.min(1, Math.abs(1 - ratioSyl));
    const score = Math.max(5, Math.min(100, Math.round(100 - durPenalty * 45 - sylPenalty * 55)));
    const verdict = score >= 85 ? "excellent" : score >= 65 ? "good" : score >= 45 ? "rework" : "retry";
    return { score, metrics: m, verdict, expectedMs, syl };
  }

  /**
   * Enregistre le micro et retourne l'enveloppe d'énergie.
   * @param onLevel callback (0..1) pour le vumètre temps réel
   * @returns Promise<{ envelope, ms } | { error }>
   */
  async function record({ onLevel = null } = {}) {
    if (!supported()) return { error: "unsupported" };
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return { error: "denied" };
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    const envelope = [];
    let spokeAt = -1;

    return new Promise((resolve) => {
      const startedAt = Date.now();
      const timer = setInterval(() => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        envelope.push(rms);
        if (onLevel) onLevel(Math.min(1, rms * 9));
        if (rms > 0.03 && spokeAt < 0) spokeAt = Date.now();
        const elapsed = Date.now() - startedAt;
        const silentTail = spokeAt > 0 &&
          envelope.slice(-Math.ceil(TRAIL_SILENCE_MS / FRAME_MS)).every((v) => v < 0.02);
        if (elapsed >= MAX_MS || (silentTail && elapsed > 1200)) {
          clearInterval(timer);
          stream.getTracks().forEach((t) => t.stop());
          ctx.close().catch(() => {});
          resolve({ envelope, ms: elapsed });
        }
      }, FRAME_MS);
    });
  }

  Codex.voice = { supported, record, grade, analyze, syllables };
})();
