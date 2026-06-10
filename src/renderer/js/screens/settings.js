/**
 * THE CODEX — Paramètres (GDD §7.11).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader, modal } = Codex.ui;

  function toggleRow(label, desc, value, onChange) {
    const row = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">${esc(label)}</div>
          <div class="small muted">${esc(desc)}</div>
        </div>
        <button class="toggle ${value ? "on" : ""}" role="switch" aria-checked="${value}" aria-label="${esc(label)}"></button>
      </div>`);
    const t = row.querySelector(".toggle");
    t.addEventListener("click", () => {
      const on = !t.classList.contains("on");
      t.classList.toggle("on", on);
      t.setAttribute("aria-checked", String(on));
      Codex.audio.sfx.click();
      onChange(on);
    });
    return row;
  }

  Codex.router.register("settings", (screenEl) => {
    const st = Codex.state;
    const s = st.data.settings;

    screenEl.appendChild(pageHeader("⚙️ Paramètres"));
    const scroll = el(`<div class="screen-scroll"></div>`);
    const wrap = el(`<div class="settings-wrap"></div>`);

    wrap.appendChild(el(`<div class="label">AUDIO</div>`));

    const volRow = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">Volume global</div>
          <div class="small muted">Effets, ambiances et signaux ECHO</div>
        </div>
        <input type="range" min="0" max="100" value="${s.volume}" aria-label="Volume global" />
      </div>`);
    volRow.querySelector("input").addEventListener("input", (e) => {
      s.volume = Number(e.target.value);
      Codex.audio.applyVolume();
      st.save();
    });
    volRow.querySelector("input").addEventListener("change", () => Codex.audio.sfx.good());
    wrap.appendChild(volRow);

    wrap.appendChild(toggleRow("Ambiance sonore", "Drone atmosphérique du QG et des terrains", s.ambience, (on) => {
      s.ambience = on;
      st.save();
      if (on) Codex.audio.startAmbience();
      else Codex.audio.stopAmbience();
    }));

    wrap.appendChild(el(`<div class="label mt-2">ACCESSIBILITÉ</div>`));
    wrap.appendChild(toggleRow("Animations réduites", "Désactive pulsations, glitchs et transitions longues", s.reducedMotion, (on) => {
      s.reducedMotion = on;
      document.body.classList.toggle("reduced-motion", on);
      st.save();
    }));

    wrap.appendChild(el(`<div class="label mt-2">DONNÉES</div>`));
    const resetRow = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">Réinitialiser la progression</div>
          <div class="small muted">Efface XP, Coffre-Fort, médailles — irréversible</div>
        </div>
        <button class="btn btn-danger" style="padding:10px 18px">EFFACER</button>
      </div>`);
    resetRow.querySelector(".btn").addEventListener("click", () => {
      const popup = el(`
        <div class="fragment-popup" style="border-color: var(--accent-red)">
          <div class="fragment-popup-head"><span class="label red">⚠ CONFIRMATION REQUISE</span></div>
          <div class="fragment-section">Toute votre progression sera définitivement effacée. L'Institut ne conserve aucune copie. Continuer ?</div>
          <div class="fragment-footer">
            <button class="btn btn-muted cancel">ANNULER</button>
            <button class="btn btn-danger confirm">TOUT EFFACER</button>
          </div>
        </div>`);
      const m = modal(popup);
      popup.querySelector(".cancel").addEventListener("click", () => { Codex.audio.sfx.click(); m.close(); });
      popup.querySelector(".confirm").addEventListener("click", async () => {
        Codex.audio.sfx.stamp();
        await st.reset();
        m.close();
        Codex.router.go("title");
      });
    });
    wrap.appendChild(resetRow);

    wrap.appendChild(el(`
      <div class="small muted center mt-2">
        THE CODEX — données stockées localement, aucune connexion réseau.<br>
        ECHO IA dynamique (API Claude) : prévue en Phase 2.
      </div>`));

    scroll.appendChild(wrap);
    screenEl.appendChild(scroll);
  });
})();
