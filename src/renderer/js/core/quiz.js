/**
 * THE CODEX — Générateur de questions partagé (Daily Signal, Arène,
 * Challenge de Révision). Puise dans : les quiz des cartes Intel acquises,
 * le vocabulaire du Coffre-Fort, les verbes de la base de connaissances
 * (QCM générés : « forme X de VERBE ? » avec distracteurs d'autres verbes),
 * et la banque de secours de l'arc.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** 3 options { t, ok } mélangées, la première donnée étant la bonne. */
  function mc(correct, wrong1, wrong2) {
    return shuffle([
      { t: correct, ok: true },
      { t: wrong1, ok: false },
      { t: wrong2, ok: false },
    ]);
  }

  function R(x) {
    if (x && typeof x === "object" && !Array.isArray(x)) return x[Codex.i18n.get()] ?? x.fr ?? x.en;
    return x;
  }

  /** QCM générés depuis les verbes de la KB de l'arc actif. */
  function kbVerbQuestions() {
    const arc = Codex.arc();
    const kb = Codex.KB[arc.id];
    if (!kb || !Array.isArray(kb.verbs) || kb.verbs.length < 3) return [];
    const qs = [];
    const verbs = kb.verbs;

    function others(i, pick) {
      const out = [];
      const idx = shuffle(verbs.map((_, k) => k).filter((k) => k !== i));
      for (const k of idx) {
        const val = pick(verbs[k]);
        if (val && !out.includes(val)) out.push(val);
        if (out.length === 2) break;
      }
      return out;
    }

    verbs.forEach((v, i) => {
      if (v.past && v.pp) {
        // Schéma anglais
        const wp = others(i, (o) => o.past);
        if (wp.length === 2) qs.push({ q: Codex.t("quiz.formOf", { form: Codex.t("quiz.past"), verb: v.inf.toUpperCase() }), options: mc(v.past, wp[0], wp[1]) });
        const wpp = others(i, (o) => o.pp);
        if (wpp.length === 2) qs.push({ q: Codex.t("quiz.formOf", { form: Codex.t("quiz.pp"), verb: v.inf.toUpperCase() }), options: mc(v.pp, wpp[0], wpp[1]) });
      } else if (v.pc) {
        // Schéma français
        const w = others(i, (o) => o.pc);
        if (w.length === 2) qs.push({ q: Codex.t("quiz.formOf", { form: "passé composé", verb: v.inf.toUpperCase() }), options: mc(v.pc, w[0], w[1]) });
        const wf = others(i, (o) => o.futur);
        if (wf.length === 2) qs.push({ q: Codex.t("quiz.formOf", { form: "futur", verb: v.inf.toUpperCase() }), options: mc(v.futur, wf[0], wf[1]) });
      } else if (Array.isArray(v.forms) && v.forms.length) {
        // Schéma générique (espagnol, allemand…) : [label, valeur]
        const row = v.forms[Math.floor(Math.random() * v.forms.length)];
        const w = others(i, (o) => {
          const m = (o.forms || []).find((f) => f[0] === row[0]);
          return m ? m[1] : null;
        });
        if (w.length === 2) qs.push({ q: Codex.t("quiz.formOf", { form: row[0], verb: v.inf.toUpperCase() }), options: mc(row[1], w[0], w[1]) });
      }
    });
    return qs;
  }

  /** Questions issues du Coffre-Fort (cartes quiz + vocabulaire). */
  function vaultQuestions() {
    const st = Codex.state;
    const qs = [];
    for (const item of st.vaultItems()) {
      const d = item.data;
      if (Array.isArray(d.quiz)) {
        for (const q of d.quiz) {
          qs.push({ q: q.q, options: q.options.map((t, i) => ({ t, ok: i === q.a })), vaultId: item.id });
        }
      }
      if (item.kind === "vocab" && d.entries && d.entries.length >= 3) {
        const entry = d.entries[Math.floor(Math.random() * d.entries.length)];
        const others = shuffle(d.entries.filter((e) => e !== entry)).map((e) => e.en);
        qs.push({ q: `« ${R(entry.note)} »`, options: mc(entry.en, others[0], others[1]), vaultId: item.id });
      }
    }
    return qs;
  }

  function fallbackQuestions() {
    return (Codex.arc().dailyFallback || []).map((fb) => ({
      q: R(fb.q),
      options: (fb.options || []).map((t, i) => ({ t: R(t), ok: i === fb.correct })),
    }));
  }

  /** QCM tirés de la Bibliothèque des mots (Codex.VOCAB) : gloss → mot. */
  function vocabBankQuestions() {
    const bank = Codex.VOCAB && Codex.VOCAB[Codex.arc().id];
    if (!bank) return [];
    const qs = [];
    for (const theme of bank.themes) {
      if (theme.words.length < 3) continue;
      for (const word of shuffle(theme.words).slice(0, 4)) {
        const others = shuffle(theme.words.filter((w) => w !== word)).slice(0, 2);
        qs.push({
          q: `« ${R(word.g)} »`,
          options: mc(word.w, others[0].w, others[1].w),
        });
      }
    }
    return qs;
  }

  Codex.quiz = {
    /**
     * Génère n questions uniques (les questions du Coffre-Fort sont
     * prioritaires : c'est la répétition espacée déguisée).
     */
    generate(n) {
      const pool = [...shuffle(vaultQuestions()), ...shuffle([...kbVerbQuestions(), ...vocabBankQuestions(), ...fallbackQuestions()])];
      const seen = new Set();
      const out = [];
      for (const q of pool) {
        if (seen.has(q.q)) continue;
        seen.add(q.q);
        out.push(q);
        if (out.length >= n) break;
      }
      return out;
    },

    /** Flux sans fin pour l'Arène : re-génère par lots en évitant la répétition immédiate. */
    stream() {
      let batch = [];
      return () => {
        if (!batch.length) batch = this.generate(40);
        return batch.shift();
      };
    },
  };
})();
