/**
 * THE CODEX — Manuel de l'Agent (règles du jeu).
 * Référence complète : concept, types de mission, score/XP/niveaux,
 * médailles, Coffre-Fort, Arène, Console ECHO, globe des langues.
 * Accessible depuis l'écran titre, le QG et la fin de la visite guidée.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, icon, typeIcon, pageHeader } = Codex.ui;

  const TYPES = ["percee", "infiltration", "surveillance", "negociation", "extraction"];

  function section(labelKey, iconName) {
    const s = el(`
      <div class="card manual-section">
        <div class="manual-head"><span class="manual-ic cyan"></span><span class="label">${esc(Codex.t(labelKey))}</span></div>
        <div class="manual-body"></div>
      </div>`);
    s.querySelector(".manual-ic").appendChild(icon(iconName, { size: 20 }));
    return s;
  }

  function para(parent, text) {
    parent.querySelector(".manual-body").appendChild(el(`<p class="small manual-p">${esc(text)}</p>`));
  }

  Codex.router.register("manual", (screenEl, params = {}) => {
    const backTo = params.from === "title" ? "title" : "hq";
    Codex.ui.fxLayers(screenEl);
    screenEl.appendChild(pageHeader(Codex.t("manual.title"), backTo));

    const scroll = el(`<div class="screen-scroll"><div class="manual-wrap"></div></div>`);
    const wrap = scroll.querySelector(".manual-wrap");
    screenEl.appendChild(scroll);

    // ----- Concept -----
    const concept = section("manual.concept", "shield");
    para(concept, Codex.t("manual.conceptText"));
    wrap.appendChild(concept);

    // ----- Types de mission -----
    const missions = section("manual.missions", "target");
    const grid = el(`<div class="manual-types"></div>`);
    for (const type of TYPES) {
      const c = el(`
        <div class="manual-type">
          <span class="mt-ic cyan"></span>
          <div>
            <div class="data manual-type-name">${esc(Codex.t(`proto.${type}.t`))}</div>
            <div class="small muted">${esc(Codex.t(`proto.${type}.obj`))}</div>
          </div>
          <button class="btn btn-ghost manual-proto-btn" data-type="${esc(type)}">?</button>
        </div>`);
      c.querySelector(".mt-ic").appendChild(typeIcon(type, { size: 24 }));
      grid.appendChild(c);
    }
    missions.querySelector(".manual-body").appendChild(grid);
    grid.querySelectorAll(".manual-proto-btn").forEach((b) => {
      b.addEventListener("click", () => {
        Codex.audio.sfx.paper();
        Codex.ui.protocolModal(b.dataset.type);
      });
    });
    wrap.appendChild(missions);

    // ----- Score, XP, niveaux -----
    const scoring = section("manual.scoring", "award");
    para(scoring, Codex.t("manual.scoring1"));
    para(scoring, Codex.t("manual.scoring2"));
    para(scoring, Codex.t("manual.scoring3"));
    const lvls = el(`<div class="manual-levels"></div>`);
    for (const l of Codex.CONTENT.levels) {
      lvls.appendChild(el(
        `<div class="manual-level"><span class="data">${esc(Codex.t(`lvl.${l.key}`))}</span>` +
        `<span class="small muted">${esc(Codex.t("manual.xpAt", { n: l.xp }))}</span></div>`
      ));
    }
    scoring.querySelector(".manual-body").appendChild(lvls);
    wrap.appendChild(scoring);

    // ----- Médailles -----
    const medals = section("manual.medals", "trophy");
    const mGrid = el(`<div class="manual-medals"></div>`);
    for (const m of Codex.CONTENT.medals) {
      mGrid.appendChild(el(
        `<div class="manual-medal"><span class="manual-medal-ic">${esc(m.icon)}</span>` +
        `<div><div class="data small">${esc(Codex.t(`medal.${m.id}`))}</div>` +
        `<div class="small muted">${esc(Codex.t(`medal.${m.id}.d`))}</div></div></div>`
      ));
    }
    medals.querySelector(".manual-body").appendChild(mGrid);
    wrap.appendChild(medals);

    // ----- Coffre-Fort, Arène, Console ECHO, Globe -----
    const vault = section("manual.vault", "archive");
    para(vault, Codex.t("manual.vaultText"));
    wrap.appendChild(vault);

    const arena = section("manual.arena", "zap");
    para(arena, Codex.t("manual.arenaText"));
    wrap.appendChild(arena);

    const echo = section("manual.echo", "satellite");
    para(echo, Codex.t("manual.echoText"));
    wrap.appendChild(echo);

    const globe = section("manual.globe", "globe");
    para(globe, Codex.t("manual.globeText"));
    wrap.appendChild(globe);

    // ----- Revoir la visite guidée (agents déjà enrôlés) -----
    if (Codex.state.onboarded()) {
      const replay = el(`<button class="btn btn-ghost manual-replay">${esc(Codex.t("manual.replayTour"))}</button>`);
      replay.addEventListener("click", () => {
        Codex.audio.sfx.click();
        Codex.router.go("hq");
        setTimeout(() => Codex.coach.startHq(), 450);
      });
      wrap.appendChild(replay);
    }

    Codex.fx.stagger([...wrap.children]);
  });
})();
