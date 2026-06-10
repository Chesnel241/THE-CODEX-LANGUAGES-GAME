/**
 * THE CODEX — Briefing format dossier confidentiel (GDD §7.4).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  Codex.router.register("briefing", (screenEl, { mission }) => {
    screenEl.appendChild(pageHeader(Codex.t("brief.title"), "missions"));
    Codex.audio.sfx.stamp();
    Codex.music.play(Codex.arc().theme, "calm");

    const scroll = el(`<div class="screen-scroll"></div>`);
    const doc = el(`
      <div class="briefing-doc">
        <div class="briefing-head">
          <span class="tag-classified">${esc(Codex.t("brief.topsecret"))}</span>
          <span class="data muted">#${esc(mission.id)}</span>
        </div>
        <div class="briefing-body">
          <div class="label">${esc(Codex.t("brief.operation"))}</div>
          <div class="h1" style="font-size:30px">${esc(mission.title)}</div>
          <div class="small muted mt-1">📍 ${esc(mission.location)} · ~${mission.durationMin} ${esc(Codex.t("missions.min"))} · ${esc(mission.typeName)}</div>

          <p class="mt-2">${esc(mission.brief.narrative)}</p>
          <p class="small muted mt-1">${esc(mission.brief.context)}</p>

          <div class="intel-required">
            <div class="label amber mb-1">${esc(Codex.t("brief.intelRequired"))}</div>
            <div class="mono" style="font-size:17px">${esc(mission.brief.intelPreview)}</div>
          </div>

          <div class="echo-panel">
            <div class="echo-head">
              <div class="echo-hex"></div>
              <span class="label purple">ECHO</span>
            </div>
            <div class="echo-text">${esc(mission.brief.echo)}</div>
          </div>

          <div class="center mt-3">
            <button class="btn">${esc(Codex.t("brief.begin"))}</button>
          </div>
        </div>
      </div>`);

    doc.querySelector(".btn").addEventListener("click", () => {
      Codex.audio.sfx.scanner();
      Codex.router.go(`terrain-${mission.type}`, { mission });
    });

    scroll.appendChild(doc);
    screenEl.appendChild(scroll);
  });
})();
