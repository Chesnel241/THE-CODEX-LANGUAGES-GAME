/**
 * THE CODEX — Profil Agent (GDD §7.10).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  Codex.router.register("profile", (screenEl) => {
    const st = Codex.state;
    const level = st.level();
    const next = st.nextLevel();
    const xp = st.prog().xp;

    screenEl.appendChild(pageHeader("🪪 Profil Agent"));
    const scroll = el(`<div class="screen-scroll"></div>`);
    const wrap = el(`<div class="profile-wrap"></div>`);

    // Identité
    const ident = el(`
      <div class="card row" style="gap:18px">
        <div class="hq-avatar" style="width:64px; height:64px; font-size:32px">🕶️</div>
        <div style="flex:1">
          <div class="label">NOM DE CODE</div>
          <input class="text-input mt-1" maxlength="24" value="${esc(st.data.agent.codeName)}" />
        </div>
        <div class="center">
          <div class="label">NIVEAU</div>
          <div class="data cyan" style="font-size:22px">${esc(level.name)}</div>
          <div class="small muted">${xp} XP${next ? ` · ${next.xp - xp} avant ${esc(next.name)}` : ""}</div>
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

    // Statistiques
    const s = st.data.stats;
    wrap.appendChild(el(`
      <div class="card">
        <div class="label mb-2">STATISTIQUES OPÉRATIONNELLES</div>
        <div class="stat-grid">
          <div class="stat-box"><div class="stat-val">${s.missionsCompleted}</div><div class="label">Missions</div></div>
          <div class="stat-box"><div class="stat-val">${s.fragmentsCollected}</div><div class="label">Fragments</div></div>
          <div class="stat-box"><div class="stat-val">${st.data.vault.length}</div><div class="label">Intel acquise</div></div>
          <div class="stat-box"><div class="stat-val">${s.daysActive.length}</div><div class="label">Jours actifs</div></div>
          <div class="stat-box"><div class="stat-val">${st.data.daily.count}</div><div class="label">Daily Signals</div></div>
          <div class="stat-box"><div class="stat-val">${s.culturalFound}</div><div class="label">Cultural Intel</div></div>
        </div>
      </div>`));

    // Médailles
    const medalsCard = el(`<div class="card"><div class="label mb-2">MÉDAILLES & ACCOMPLISSEMENTS</div><div class="medal-grid"></div></div>`);
    const grid = medalsCard.querySelector(".medal-grid");
    Codex.CONTENT.medals.forEach((def) => {
      const owned = st.hasMedal(def.id);
      grid.appendChild(el(`
        <div class="medal-badge ${owned ? "" : "locked"}">
          <span style="font-size:24px">${esc(def.icon)}</span>
          <div>
            <div style="font-weight:700; font-size:13.5px">${esc(def.name)}</div>
            <div class="small muted">${esc(def.desc)}</div>
          </div>
        </div>`));
    });
    wrap.appendChild(medalsCard);

    // Historique
    if (s.history.length) {
      const hist = el(`<div class="card"><div class="label mb-2">DERNIÈRES OPÉRATIONS</div></div>`);
      s.history.forEach((h) => {
        hist.appendChild(el(`
          <div class="spread small" style="padding:5px 0; border-bottom:1px solid var(--border)">
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
