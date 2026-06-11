/**
 * THE CODEX — Effets visuels : lecteur Lottie + micro-animations anime.js.
 * Tout est dégradable : si une librairie manque, repli CSS silencieux.
 * Les animations Lottie sont embarquées en JS (Codex.LOTTIE) — aucun
 * fetch, compatible CSP connect-src 'none'.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const fx = {
    /** Joue une animation Lottie embarquée dans un conteneur. */
    lottie(container, name, { loop = true } = {}) {
      if (!window.lottie || !Codex.LOTTIE || !Codex.LOTTIE[name]) return null;
      try {
        return window.lottie.loadAnimation({
          container,
          renderer: "svg",
          loop,
          autoplay: true,
          // copie défensive : lottie-web mute l'objet animationData
          animationData: JSON.parse(JSON.stringify(Codex.LOTTIE[name])),
        });
      } catch { return null; }
    },

    /** Remplissage animé d'une barre (XP…) avec rebond doux. */
    fillBar(el, pct, delay = 300) {
      if (window.anime) {
        window.anime({ targets: el, width: `${pct}%`, duration: 1100, delay, easing: "easeOutQuart" });
      } else {
        setTimeout(() => { el.style.width = `${pct}%`; }, delay);
      }
    },

    /** Entrée en cascade d'une liste d'éléments. */
    stagger(els, { dy = 14, step = 55 } = {}) {
      if (!window.anime || !els.length || Codex.state.data.settings.reducedMotion) return;
      els.forEach((el) => { el.style.opacity = "0"; });
      window.anime({
        targets: els,
        opacity: [0, 1],
        translateY: [dy, 0],
        duration: 420,
        delay: window.anime.stagger(step),
        easing: "easeOutCubic",
      });
    },

    /** Pop élastique (médaille, jeton de mot…). */
    pop(el) {
      if (!window.anime || Codex.state.data.settings.reducedMotion) return;
      window.anime({ targets: el, scale: [0.6, 1], duration: 500, easing: "easeOutElastic(1, .6)" });
    },
  };

  Codex.fx = fx;
})();
