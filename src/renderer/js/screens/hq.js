/**
 * THE CODEX — QG / Quartier Général (GDD §7.2).
 * Carte mondiale stylisée (SVG radar), panneau ECHO, mission en vedette.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, stars } = Codex.ui;
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  }

  function buildMap(wrap) {
    const svg = svgEl("svg", { viewBox: "0 0 1000 520", class: "hq-map" });

    // Grille radar
    for (let x = 0; x <= 1000; x += 50) {
      svg.appendChild(svgEl("line", { x1: x, y1: 0, x2: x, y2: 520, stroke: "#0F1B30", "stroke-width": 1 }));
    }
    for (let y = 0; y <= 520; y += 50) {
      svg.appendChild(svgEl("line", { x1: 0, y1: y, x2: 1000, y2: y, stroke: "#0F1B30", "stroke-width": 1 }));
    }

    // Continents stylisés (silhouettes abstraites, opacité faible)
    const continents = [
      "M120,120 Q200,70 290,110 Q330,160 290,230 Q250,300 190,280 Q130,240 120,120 Z", // Amérique N.
      "M270,310 Q330,290 350,350 Q360,430 310,460 Q270,420 270,310 Z", // Amérique S.
      "M430,100 Q520,70 580,110 Q600,150 560,180 Q480,200 440,170 Q420,130 430,100 Z", // Europe
      "M460,220 Q540,190 590,240 Q620,330 560,400 Q500,420 470,340 Q450,270 460,220 Z", // Afrique
      "M610,120 Q750,80 870,140 Q920,200 860,260 Q760,290 670,250 Q610,190 610,120 Z", // Asie
      "M790,380 Q860,360 890,400 Q880,450 820,450 Q780,420 790,380 Z", // Océanie
    ];
    continents.forEach((d) => {
      svg.appendChild(svgEl("path", { d, fill: "#00D4FF", opacity: "0.05", stroke: "#00D4FF", "stroke-opacity": "0.12" }));
    });

    const tooltip = el(`<div class="map-tooltip" style="display:none"></div>`);
    wrap.appendChild(tooltip);

    Codex.CONTENT.countries.forEach((c) => {
      const g = svgEl("g", { class: c.active ? "map-node" : "map-node map-node-locked" });
      const color = c.active ? "#00D4FF" : "#22324d";

      if (c.active) {
        g.appendChild(svgEl("circle", { cx: c.x, cy: c.y, r: 14, fill: color, opacity: "0.3", class: "map-pulse" }));
      }
      g.appendChild(svgEl("circle", { cx: c.x, cy: c.y, r: 7, fill: c.active ? color : "transparent", stroke: color, "stroke-width": 2 }));

      const label = svgEl("text", {
        x: c.x, y: c.y + 26, "text-anchor": "middle", fill: c.active ? "#D8E6F0" : "#33415c",
        "font-size": "12", "font-family": "Consolas, monospace",
      });
      label.textContent = c.active ? `${c.flag} ${c.name}` : "🔒";
      g.appendChild(label);

      g.addEventListener("mouseenter", (e) => {
        Codex.audio.sfx.hover();
        tooltip.style.display = "block";
        tooltip.innerHTML = c.active
          ? `<span class="cyan">${esc(c.name)}</span> — ${esc(c.lang)}<br><span class="muted small">Zone active · cliquez pour les missions</span>`
          : `<span class="muted">${esc(c.name)} — ${esc(c.lang)}</span><br><span class="amber small">Verrouillé · terminez l'arc Londres</span>`;
        const rect = wrap.getBoundingClientRect();
        const pt = svg.createSVGPoint();
        pt.x = c.x; pt.y = c.y;
        const sp = pt.matrixTransform(svg.getScreenCTM());
        tooltip.style.left = `${sp.x - rect.left}px`;
        tooltip.style.top = `${sp.y - rect.top}px`;
      });
      g.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
      if (c.active) {
        g.addEventListener("click", () => {
          Codex.audio.sfx.click();
          Codex.router.go("missions");
        });
      }
      svg.appendChild(g);
    });

    return svg;
  }

  Codex.router.register("hq", (screenEl) => {
    const st = Codex.state;
    const level = st.level();
    const next = st.nextLevel();
    const xp = st.prog().xp;
    const pct = next ? Math.min(100, Math.round(((xp - level.xp) / (next.xp - level.xp)) * 100)) : 100;

    // ----- Barre agent -----
    const topbar = el(`
      <div class="hq-topbar">
        <div class="hq-avatar" title="Profil Agent">🕶️</div>
        <div>
          <div class="data">${esc(st.data.agent.codeName)}</div>
          <div class="label">${esc(level.name)} · ${esc(Codex.CONTENT.language.name)}</div>
        </div>
        <div class="xp-bar-wrap">
          <div class="spread small">
            <span class="muted">XP ${xp}</span>
            <span class="muted">${next ? `→ ${esc(next.name)} (${next.xp})` : "NIVEAU MAX"}</span>
          </div>
          <div class="xp-bar"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="hq-actions">
          <button class="icon-btn" data-go="daily" title="Daily Agent Signal">📻</button>
          <button class="icon-btn" data-go="vault" title="Coffre-Fort">🗄️</button>
          <button class="icon-btn" data-go="profile" title="Profil Agent">🪪</button>
          <button class="icon-btn" data-go="settings" title="Paramètres">⚙️</button>
        </div>
      </div>`);
    topbar.querySelector(".hq-avatar").addEventListener("click", () => {
      Codex.audio.sfx.click();
      Codex.router.go("profile");
    });
    topbar.querySelectorAll(".icon-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        Codex.audio.sfx.click();
        Codex.router.go(btn.dataset.go);
      });
    });
    screenEl.appendChild(topbar);

    // ----- Corps : carte + panneau latéral -----
    const main = el(`<div class="hq-main"></div>`);
    const mapWrap = el(`<div class="hq-map-wrap"></div>`);
    mapWrap.appendChild(buildMap(mapWrap));
    main.appendChild(mapWrap);

    const side = el(`<div class="hq-side"></div>`);

    // Panneau ECHO
    const echoLines = Codex.CONTENT.echo.hq;
    const echoMsg = echoLines[Math.floor(Math.random() * echoLines.length)];
    const dailyOk = st.dailyAvailable();
    const echoPanel = el(`
      <div class="echo-panel">
        <div class="echo-head">
          <div class="echo-hex"></div>
          <span class="label purple">TRANSMISSION ECHO</span>
        </div>
        <div class="echo-text">${esc(echoMsg)}</div>
        ${dailyOk
          ? `<button class="btn btn-ghost mt-2" style="width:100%">📻 SIGNAL QUOTIDIEN DISPONIBLE</button>`
          : `<div class="small muted mt-2">Signal quotidien : complété ✓ (jour ${st.data.daily.count})</div>`}
      </div>`);
    const dailyBtn = echoPanel.querySelector(".btn");
    if (dailyBtn) dailyBtn.addEventListener("click", () => {
      Codex.audio.sfx.daily();
      Codex.router.go("daily");
    });
    side.appendChild(echoPanel);

    // Mission en vedette
    const featured = Codex.CONTENT.missions.find((m) => !st.isMissionDone(m.id) && st.isMissionUnlocked(m.id));
    if (featured) {
      const card = el(`
        <div class="card card-hover">
          <div class="label amber mb-1">MISSION EN VEDETTE</div>
          <div class="row"><span style="font-size:26px">${esc(featured.icon)}</span>
            <div>
              <div style="font-weight:700">${esc(featured.title)}</div>
              <div class="small muted">${esc(featured.location)}</div>
            </div>
          </div>
          <div class="small mt-1">
            <span class="stars">${stars(featured.difficulty)}</span>
            <span class="muted"> · ${esc(featured.typeName)} · ~${featured.durationMin} min</span>
          </div>
          <div class="small mt-1 mono muted">INTEL : ${esc(featured.brief.intelPreview)}</div>
        </div>`);
      card.addEventListener("click", () => {
        Codex.audio.sfx.paper();
        Codex.router.go("briefing", { mission: featured });
      });
      side.appendChild(card);
    } else {
      side.appendChild(el(`
        <div class="card center">
          <div style="font-size:32px">🏆</div>
          <div class="mt-1" style="font-weight:700">Arc Londres complété</div>
          <div class="small muted mt-1">D'autres capitales s'allumeront en Phase 2, Agent.</div>
        </div>`));
    }

    // Stats rapides
    const done = Codex.CONTENT.missions.filter((m) => st.isMissionDone(m.id)).length;
    side.appendChild(el(`
      <div class="card">
        <div class="label mb-1">ÉTAT DE L'ARC — LONDRES</div>
        <div class="spread small"><span class="muted">Missions</span><span class="data">${done}/${Codex.CONTENT.missions.length}</span></div>
        <div class="spread small"><span class="muted">Intel au Coffre-Fort</span><span class="data">${st.data.vault.length}</span></div>
        <div class="spread small"><span class="muted">Médailles</span><span class="data">${st.data.medals.length}/${Codex.CONTENT.medals.length}</span></div>
        <div class="spread small"><span class="muted">Jours actifs</span><span class="data">${st.data.stats.daysActive.length}</span></div>
      </div>`));

    main.appendChild(side);
    screenEl.appendChild(main);
  });
})();
