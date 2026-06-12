/**
 * THE CODEX — Visite guidée du QG (coach ECHO).
 * Projecteur sur chaque module du QG avec carte explicative, façon
 * tutoriel de jeu : anneau lumineux découpé dans un voile sombre,
 * navigation Suivant / Passer, étape finale vers le Manuel de l'Agent.
 * Déclenchée à la première visite du QG (state.tutorial.hqDone),
 * rejouable depuis le Manuel.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  // Étapes : sélecteur dans l'écran QG + clés i18n (coach.<k>.t / .x)
  const STEPS = [
    { sel: ".hq-map-wrap", k: "hq1" },
    { sel: ".echo-panel", k: "hq2" },
    { sel: ".hq-side .card-hover", k: "hq3" },
    { sel: ".xp-bar-wrap", k: "hq4" },
    { sel: ".hq-actions", k: "hq5" },
    { sel: null, k: "final" }, // carte centrée de conclusion
  ];

  function startHq() {
    const screen = document.querySelector(".screen");
    if (!screen || screen.querySelector(".coach-overlay")) return;

    const overlay = el(`<div class="coach-overlay"></div>`);
    const ring = el(`<div class="coach-ring"></div>`);
    const card = el(`
      <div class="coach-card">
        <div class="spread">
          <span class="label cyan coach-title"></span>
          <span class="label muted coach-count"></span>
        </div>
        <div class="coach-text small"></div>
        <div class="coach-actions">
          <button class="btn btn-ghost coach-skip"></button>
          <button class="btn coach-next"></button>
        </div>
      </div>`);
    overlay.appendChild(ring);
    overlay.appendChild(card);
    screen.appendChild(overlay);

    const steps = STEPS.filter((s) => !s.sel || screen.querySelector(s.sel));
    let i = 0;

    function finish(openManual) {
      const st = Codex.state;
      const tut = st.data.tutorial || (st.data.tutorial = { hqDone: false, seen: {} });
      tut.hqDone = true;
      st.save();
      overlay.remove();
      if (openManual) Codex.router.go("manual");
    }

    function show() {
      const step = steps[i];
      const last = i === steps.length - 1;
      card.querySelector(".coach-title").textContent = Codex.t(`coach.${step.k}.t`);
      card.querySelector(".coach-count").textContent = Codex.t("coach.step", { i: i + 1, n: steps.length });
      card.querySelector(".coach-text").textContent = Codex.t(`coach.${step.k}.x`);
      card.querySelector(".coach-skip").textContent = last ? Codex.t("coach.openManual") : Codex.t("coach.skip");
      card.querySelector(".coach-next").textContent = last ? Codex.t("coach.done") : Codex.t("coach.next");

      if (step.sel) {
        const target = screen.querySelector(step.sel);
        const r = target.getBoundingClientRect();
        const pad = 10;
        ring.style.display = "block";
        ring.style.left = `${r.left - pad}px`;
        ring.style.top = `${r.top - pad}px`;
        ring.style.width = `${r.width + pad * 2}px`;
        ring.style.height = `${r.height + pad * 2}px`;
        // Carte sous la cible si la place le permet, sinon au-dessus
        const ch = 190;
        const below = r.bottom + pad + ch < window.innerHeight;
        card.style.top = below ? `${r.bottom + pad + 12}px` : `${Math.max(12, r.top - pad - ch)}px`;
        card.style.left = `${Math.max(12, Math.min(window.innerWidth - 372, r.left))}px`;
        card.style.transform = "none";
      } else {
        // Étape finale : carte centrée, pas d'anneau
        ring.style.display = "none";
        card.style.left = "50%";
        card.style.top = "50%";
        card.style.transform = "translate(-50%, -50%)";
      }
      Codex.audio.sfx.echo();
    }

    card.querySelector(".coach-next").addEventListener("click", () => {
      Codex.audio.sfx.click();
      if (i === steps.length - 1) return finish(false);
      i += 1;
      show();
    });
    card.querySelector(".coach-skip").addEventListener("click", () => {
      Codex.audio.sfx.click();
      finish(i === steps.length - 1); // dernier écran : ouvre le Manuel
    });

    show();
  }

  Codex.coach = { startHq };
})();
