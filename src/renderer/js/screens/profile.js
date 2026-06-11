/**
 * THE CODEX — Profil Agent (GDD §7.10) avec progression par langue.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  function levelFor(xp) {
    let cur = Codex.CONTENT.levels[0];
    for (const l of Codex.CONTENT.levels) if (xp >= l.xp) cur = l;
    return cur;
  }

  Codex.router.register("profile", (screenEl) => {
    const st = Codex.state;
    const level = st.level();
    const next = st.nextLevel();
    const xp = st.prog().xp;

    screenEl.appendChild(pageHeader(Codex.t("profile.title")));
    const scroll = el(`<div class="screen-scroll"></div>`);
    const wrap = el(`<div class="profile-wrap"></div>`);

    // Identité
    const ident = el(`
      <div class="card row" style="gap:18px">
        <div class="hq-avatar" style="width:64px; height:64px; font-size:32px">🕶️</div>
        <div style="flex:1">
          <div class="label">${esc(Codex.t("profile.codename"))}</div>
          <input class="text-input mt-1" maxlength="24" value="${esc(st.data.agent.codeName)}" />
        </div>
        <div class="center">
          <div class="label">${esc(Codex.t("profile.level"))}</div>
          <div class="data cyan" style="font-size:22px">${esc(Codex.t(`lvl.${level.key}`))}</div>
          <div class="small muted">${xp} XP${next ? ` · ${esc(Codex.t("profile.before", { n: next.xp - xp, lvl: Codex.t(`lvl.${next.key}`) }))}` : ""}</div>
        </div>
      </div>`);
    const input = ident.querySelector("input");
    input.addEventListener("change", () => {
      const v = input.value.trim().slice(0, 24);
      if (v) {
        st.data.agent.codeName = v.toUpperCase();
        st.save();
        Codex.audio.sfx.lock();
      }
    });
    wrap.appendChild(ident);

    // Progression par langue (GDD §7.10)
    const langCard = el(`<div class="card"><div class="label mb-2">${esc(Codex.t("profile.langs"))}</div></div>`);
    Object.values(Codex.ARCS).forEach((arc) => {
      const p = st.data.progress[arc.id];
      const axp = p ? p.xp : 0;
      const lvl = levelFor(axp);
      const nxt = Codex.CONTENT.levels.find((l) => l.xp > axp);
      const pct = nxt ? Math.min(100, Math.round(((axp - lvl.xp) / (nxt.xp - lvl.xp)) * 100)) : 100;
      const row = el(`
        <div class="lang-progress-row">
          <span class="lang-flag"></span>
          <div style="width:140px">
            <div style="font-weight:600; font-size:14px">${esc(arc.language.name)}</div>
            <div class="small muted">${esc(Codex.t(`lvl.${lvl.key}`))} · ${axp} XP</div>
          </div>
          <div class="xp-bar"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
        </div>`);
      row.querySelector(".lang-flag").appendChild(Codex.ui.flag(arc.id, { w: 26 }));
      langCard.appendChild(row);
    });
    wrap.appendChild(langCard);

    // Statistiques
    const s = st.data.stats;
    wrap.appendChild(el(`
      <div class="card">
        <div class="label mb-2">${esc(Codex.t("profile.stats"))}</div>
        <div class="stat-grid">
          <div class="stat-box"><div class="stat-val">${s.missionsCompleted}</div><div class="label">${esc(Codex.t("profile.missions"))}</div></div>
          <div class="stat-box"><div class="stat-val">${s.fragmentsCollected}</div><div class="label">${esc(Codex.t("profile.fragments"))}</div></div>
          <div class="stat-box"><div class="stat-val">${st.data.vault.length}</div><div class="label">${esc(Codex.t("profile.intel"))}</div></div>
          <div class="stat-box"><div class="stat-val">${s.daysActive.length}</div><div class="label">${esc(Codex.t("profile.days"))}</div></div>
          <div class="stat-box"><div class="stat-val">${st.data.daily.count}</div><div class="label">${esc(Codex.t("profile.daily"))}</div></div>
          <div class="stat-box"><div class="stat-val">${s.culturalFound}</div><div class="label">${esc(Codex.t("profile.cultural"))}</div></div>
        </div>
      </div>`));

    // Médailles
    const medalsCard = el(`<div class="card"><div class="label mb-2">${esc(Codex.t("profile.medalsTitle"))}</div><div class="medal-grid"></div></div>`);
    const grid = medalsCard.querySelector(".medal-grid");
    Codex.CONTENT.medals.forEach((def) => {
      const owned = st.hasMedal(def.id);
      grid.appendChild(el(`
        <div class="medal-badge ${owned ? "" : "locked"}">
          <span style="font-size:24px">${esc(def.icon)}</span>
          <div>
            <div style="font-weight:700; font-size:13.5px">${esc(Codex.t(`medal.${def.id}`))}</div>
            <div class="small muted">${esc(Codex.t(`medal.${def.id}.d`))}</div>
          </div>
        </div>`));
    });
    wrap.appendChild(medalsCard);

    // Historique
    if (s.history.length) {
      const hist = el(`<div class="card"><div class="label mb-2">${esc(Codex.t("profile.history"))}</div></div>`);
      s.history.forEach((h) => {
        hist.appendChild(el(`
          <div class="spread small" style="padding:5px 0; border-bottom:1px solid var(--border-soft)">
            <span>${esc(h.title)}</span>
            <span class="muted">${esc(h.date)} · <span class="data cyan">${h.score}%</span></span>
          </div>`));
      });
      wrap.appendChild(hist);
    }

    scroll.appendChild(wrap);
    screenEl.appendChild(scroll);
  });
})();
