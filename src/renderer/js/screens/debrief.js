/**
 * THE CODEX — Debriefing (GDD §7.8).
 * Récompenses, barre XP animée, médailles, level-up, fins de boss.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  Codex.router.register("debrief", (screenEl, { mission, result }) => {
    const st = Codex.state;
    const arc = Codex.arc();
    const r = result;

    // Fin narrative pour le boss (GDD §5.5)
    let ending = null;
    if (mission.type === "extraction" && mission.endings) {
      const score = r.score;
      ending = [mission.endings.perfect, mission.endings.good, mission.endings.rough, mission.endings.bad]
        .find((e) => score >= e.min);
    }

    const echoPool = r.perfect ? arc.echo.perfect : arc.echo.success;
    const echoLine = echoPool[Math.floor(Math.random() * echoPool.length)];

    const card = el(`
      <div class="debrief-card">
        ${r.levelUp ? `<div class="levelup-banner">${esc(Codex.t("debrief.promotion", { lvl: Codex.t(`lvl.${r.levelUp.key}`) }))}</div>` : ""}
        <div class="debrief-head">
          <div class="debrief-check">${ending ? "🎯" : ""}</div>
          <div class="h2 mt-1">${esc(ending ? ending.title : mission.title.toUpperCase())}</div>
          <div class="small muted">${ending ? "" : esc(Codex.t("debrief.done")) + " · "}${esc(Codex.t("debrief.score"))} : <span class="data cyan">${r.score}%</span></div>
        </div>
        ${ending ? `<div class="debrief-section" style="font-style:italic">${esc(ending.text)}</div>` : ""}
        <div class="debrief-section">
          <div class="label mb-1">${esc(Codex.t("debrief.intelSecured"))}</div>
          <div class="green">✓ ${esc(mission.intelCard.lemma)} — ${esc(mission.intelCard.tag)}</div>
          ${r.culturalAwarded ? `<div class="amber">${esc(Codex.t("debrief.culturalBonus"))}</div>` : ""}
        </div>
        <div class="debrief-section">
          <div class="row spread">
            <span class="xp-gain">+${r.xp} XP</span>
            <span class="medals-zone"></span>
          </div>
          <div class="xp-bar mt-1"><div class="xp-bar-fill" style="width:0%"></div></div>
          <div class="small muted xp-detail mt-1"></div>
        </div>
        <div class="debrief-section echo-panel" style="border:none; border-radius:0">
          <div class="echo-head"><div class="echo-hex"></div><span class="label purple">ECHO</span></div>
          <div class="echo-text">${esc(echoLine)}</div>
        </div>
        <div class="debrief-section row" style="justify-content:center; border:none">
          <button class="btn btn-ghost" data-go="vault">${esc(Codex.t("debrief.seeIntel"))}</button>
          <button class="btn" data-go="hq">${esc(Codex.t("debrief.returnHq"))}</button>
        </div>
      </div>`);

    // Détail XP
    const details = [];
    details.push(Codex.t("debrief.xpBase", { n: r.xpBreakdown.base }));
    if (r.xpBreakdown.fragments) details.push(Codex.t("debrief.xpFrag", { n: r.xpBreakdown.fragments }));
    if (r.xpBreakdown.cultural) details.push(Codex.t("debrief.xpCult", { n: r.xpBreakdown.cultural }));
    if (r.xpBreakdown.perfect) details.push(Codex.t("debrief.xpPerfect", { n: r.xpBreakdown.perfect }));
    if (r.xpBreakdown.silent) details.push(Codex.t("debrief.xpSilent", { n: r.xpBreakdown.silent }));
    card.querySelector(".xp-detail").textContent = details.join(" · ");

    // Médailles
    const medalsZone = card.querySelector(".medals-zone");
    (r.newMedals || []).forEach((id, i) => {
      const def = Codex.CONTENT.medals.find((m) => m.id === id);
      if (!def) return;
      setTimeout(() => {
        Codex.audio.sfx.medal();
        medalsZone.appendChild(el(`<span class="medal-pop">${esc(def.icon)} ${esc(Codex.t(`medal.${id}`))}</span>`));
      }, 600 + i * 500);
    });

    // Coche animée (Lottie) — repli emoji si indisponible
    if (!ending) {
      const checkSlot = card.querySelector(".debrief-check");
      if (!Codex.fx.lottie(checkSlot, "check", { loop: false })) checkSlot.textContent = "✅";
    }

    // Animation barre XP + sons
    setTimeout(() => {
      Codex.audio.sfx.xp();
      const level = st.level();
      const next = st.nextLevel();
      const xp = st.prog().xp;
      const pct = next ? Math.min(100, Math.round(((xp - level.xp) / (next.xp - level.xp)) * 100)) : 100;
      Codex.fx.fillBar(card.querySelector(".xp-bar-fill"), pct, 0);
    }, 400);
    if (r.levelUp) setTimeout(() => Codex.audio.sfx.levelUp(), 900);

    card.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Codex.audio.sfx.click();
        Codex.router.go(btn.dataset.go);
      });
    });

    screenEl.appendChild(card);
  });
})();
