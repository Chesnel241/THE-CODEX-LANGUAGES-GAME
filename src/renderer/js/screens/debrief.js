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
    const r = result;

    // Fin narrative pour le boss (GDD §5.5)
    let ending = null;
    if (mission.type === "extraction" && mission.endings) {
      const score = r.score;
      ending = [mission.endings.perfect, mission.endings.good, mission.endings.rough, mission.endings.bad]
        .find((e) => score >= e.min);
    }

    const echoPool = r.perfect ? Codex.CONTENT.echo.perfect : Codex.CONTENT.echo.success;
    const echoLine = echoPool[Math.floor(Math.random() * echoPool.length)];

    const card = el(`
      <div class="debrief-card">
        ${r.levelUp ? `<div class="levelup-banner">▲ PROMOTION — NIVEAU ${esc(r.levelUp.name)} ▲</div>` : ""}
        <div class="debrief-head">
          <div class="debrief-check">${ending ? "🎯" : "✅"}</div>
          <div class="h2 mt-1">${esc(ending ? ending.title : "OPÉRATION " + mission.title.replace(/^Opération\s+/i, ""))}</div>
          <div class="small muted">${ending ? "" : "Mission accomplie"} · Score : <span class="data cyan">${r.score}%</span></div>
        </div>
        ${ending ? `<div class="debrief-section" style="font-style:italic">${esc(ending.text)}</div>` : ""}
        <div class="debrief-section">
          <div class="label mb-1">INTEL SÉCURISÉE</div>
          <div class="green">✓ ${esc(mission.intelCard.lemma)} — ${esc(mission.intelCard.tag)}</div>
          ${r.culturalAwarded ? `<div class="amber">✓ +1 Cultural Intel bonus</div>` : ""}
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
          <button class="btn btn-ghost" data-go="vault">VOIR L'INTEL</button>
          <button class="btn" data-go="hq">RETOUR AU QG</button>
        </div>
      </div>`);

    // Détail XP
    const details = [];
    details.push(`Base ${r.xpBreakdown.base}`);
    if (r.xpBreakdown.fragments) details.push(`Fragments +${r.xpBreakdown.fragments}`);
    if (r.xpBreakdown.cultural) details.push(`Cultural Intel +${r.xpBreakdown.cultural}`);
    if (r.xpBreakdown.perfect) details.push(`Sans erreur +${r.xpBreakdown.perfect}`);
    if (r.xpBreakdown.silent) details.push(`Sans ECHO +${r.xpBreakdown.silent}`);
    card.querySelector(".xp-detail").textContent = details.join(" · ");

    // Médailles
    const medalsZone = card.querySelector(".medals-zone");
    (r.newMedals || []).forEach((id, i) => {
      const def = Codex.CONTENT.medals.find((m) => m.id === id);
      if (!def) return;
      setTimeout(() => {
        Codex.audio.sfx.medal();
        medalsZone.appendChild(el(`<span class="medal-pop">${esc(def.icon)} ${esc(def.name)}</span>`));
      }, 600 + i * 500);
    });

    // Animation barre XP + sons
    setTimeout(() => {
      Codex.audio.sfx.xp();
      const level = st.level();
      const next = st.nextLevel();
      const xp = st.prog().xp;
      const pct = next ? Math.min(100, Math.round(((xp - level.xp) / (next.xp - level.xp)) * 100)) : 100;
      card.querySelector(".xp-bar-fill").style.width = `${pct}%`;
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
