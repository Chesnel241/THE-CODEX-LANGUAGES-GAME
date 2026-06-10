/**
 * THE CODEX — Sélection de mission (GDD §7.3).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, stars, pageHeader } = Codex.ui;

  Codex.router.register("missions", (screenEl) => {
    const st = Codex.state;
    screenEl.appendChild(pageHeader(`${Codex.CONTENT.language.flag} Londres — ${Codex.CONTENT.zone.domain}`));

    const scroll = el(`<div class="screen-scroll"></div>`);
    const list = el(`<div class="mission-list"></div>`);

    Codex.CONTENT.missions.forEach((m) => {
      const unlocked = st.isMissionUnlocked(m.id);
      const done = st.isMissionDone(m.id);
      const best = st.prog().missions[m.id];

      let status, statusClass;
      if (!unlocked) { status = "VERROUILLÉE"; statusClass = "st-locked"; }
      else if (done) { status = `COMPLÉTÉE · ${best.bestScore}%`; statusClass = "st-done"; }
      else { status = "NOUVELLE"; statusClass = "st-new"; }

      const card = el(`
        <div class="card card-hover mission-item ${unlocked ? "" : "mission-locked"}">
          <div class="mission-icon">${esc(m.icon)}</div>
          <div class="mission-info">
            <div class="row">
              <span style="font-weight:700">${esc(m.title)}</span>
              <span class="label">${esc(m.typeName)}</span>
            </div>
            <div class="small muted">${esc(m.subtitle)} — 📍 ${esc(m.location)}</div>
            <div class="small">
              <span class="stars">${stars(m.difficulty)}</span>
              <span class="muted"> · ~${m.durationMin} min · </span>
              <span class="mono muted">${esc(m.brief.intelPreview)}</span>
            </div>
          </div>
          <div class="mission-status ${statusClass}">${esc(status)}</div>
        </div>`);

      if (unlocked) {
        card.addEventListener("click", () => {
          Codex.audio.sfx.paper();
          Codex.router.go("briefing", { mission: m });
        });
      } else {
        card.addEventListener("click", () => {
          Codex.audio.sfx.error();
        });
      }
      list.appendChild(card);
    });

    scroll.appendChild(list);
    screenEl.appendChild(scroll);
  });
})();
