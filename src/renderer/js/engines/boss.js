/**
 * THE CODEX — Moteur L'EXTRACTION / Mission Boss (GDD §5.5).
 * Enchaîne les phases (infiltration → percée → négociation) en réutilisant
 * les moteurs existants. Aucun indice ECHO — l'agent puise dans son intel.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.engines = Codex.engines || {};

(function () {
  const { el, esc } = Codex.ui;

  function mount(screenEl, opts) {
    const mission = opts.content;
    const startTime = Date.now();
    const totals = { errors: 0, hintsUsed: 0, fragments: 0, cultural: 0, maxSuspicion: 0 };
    let phaseIdx = 0;

    function showPhaseBanner(phase, then) {
      screenEl.innerHTML = "";
      Codex.music.play(Codex.arc().theme, "tension");
      Codex.audio.sfx.tension();
      const banner = el(`
        <div class="phase-banner">
          <div class="phase-num">${esc(phase.title)}</div>
          <div class="h1 mt-2">${esc(mission.title)}</div>
          <div class="mt-2 muted">${esc(phase.desc)}</div>
          <button class="btn mt-3">${esc(Codex.t("terrain.engage"))}</button>
        </div>`);
      banner.querySelector(".btn").addEventListener("click", () => {
        Codex.audio.sfx.stamp();
        then();
      });
      screenEl.appendChild(banner);
    }

    function runPhase(i) {
      if (i >= mission.phases.length) return finish();
      const phase = mission.phases[i];

      showPhaseBanner(phase, () => {
        const phaseContent = {
          scene: phase.scene || mission.scene,
          interactions: phase.interactions,
          fragments: phase.fragments,
          rounds: phase.rounds,
        };
        const engine = Codex.engines[phase.kind];
        engine.mount(screenEl, {
          content: phaseContent,
          hints: 0, // Boss : aucun indice automatique (GDD §5.5)
          echoIntro: Codex.t("echo.bossSilent"),
          onDone: (r) => {
            totals.errors += r.errors;
            totals.hintsUsed += r.hintsUsed;
            totals.fragments += r.fragments;
            totals.cultural += r.cultural;
            totals.maxSuspicion = Math.max(totals.maxSuspicion, r.maxSuspicion);
            phaseIdx += 1;
            runPhase(phaseIdx);
          },
        });
      });
    }

    function finish() {
      opts.onDone({
        ...totals,
        timeSec: Math.round((Date.now() - startTime) / 1000),
      });
    }

    // Cinématique d'introduction (GDD : 30 s — version condensée)
    screenEl.innerHTML = "";
    Codex.music.play(Codex.arc().theme, "tension");
    const intro = el(`
      <div class="phase-banner">
        <div class="tag-classified">${esc(Codex.t("terrain.finalOp"))}</div>
        <div class="h1 mt-2">${esc(mission.title)}</div>
        <div class="mt-2" style="font-style:italic">${esc(mission.brief.narrative)}</div>
        <div class="mt-2 muted small">${esc(mission.brief.context)}</div>
        <button class="btn mt-3">${esc(Codex.t("terrain.launchFinal"))}</button>
      </div>`);
    intro.querySelector(".btn").addEventListener("click", () => {
      Codex.audio.sfx.scanner();
      runPhase(0);
    });
    screenEl.appendChild(intro);
    Codex.ui.maybeProtocol("extraction");
  }

  Codex.engines.extraction = { mount };

  Codex.router.register("terrain-extraction", (screenEl, params) => {
    mount(screenEl, {
      content: params.mission,
      onDone: (r) => Codex.flow.completeMission(params.mission, r),
    });
  });
})();
