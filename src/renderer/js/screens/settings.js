/**
 * THE CODEX — Paramètres (GDD §7.11).
 * Volumes musique/SFX séparés, ambiance, accessibilité, langue d'interface.
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

  function sliderRow(label, desc, value, onInput, onChange) {
    const row = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">${esc(label)}</div>
          <div class="small muted">${esc(desc)}</div>
        </div>
        <input type="range" min="0" max="100" value="${value}" aria-label="${esc(label)}" />
      </div>`);
    const input = row.querySelector("input");
    input.addEventListener("input", (e) => onInput(Number(e.target.value)));
    if (onChange) input.addEventListener("change", (e) => onChange(Number(e.target.value)));
    return row;
  }

  Codex.router.register("settings", (screenEl) => {
    const st = Codex.state;
    const s = st.data.settings;

    screenEl.appendChild(pageHeader(Codex.t("set.title")));
    const scroll = el(`<div class="screen-scroll"></div>`);
    const wrap = el(`<div class="settings-wrap"></div>`);

    // ----- AUDIO -----
    wrap.appendChild(el(`<div class="label">${esc(Codex.t("set.audio"))}</div>`));

    wrap.appendChild(sliderRow(Codex.t("set.music"), Codex.t("set.musicSub"), s.volMusic, (v) => {
      s.volMusic = v;
      Codex.audio.applyVolume();
      st.save();
      if (v > 0 && !Codex.music.state()) Codex.music.play(Codex.arc().theme, "calm");
      if (v === 0) Codex.music.stop(0.3);
    }));

    wrap.appendChild(sliderRow(Codex.t("set.sfx"), Codex.t("set.sfxSub"), s.volSfx, (v) => {
      s.volSfx = v;
      Codex.audio.applyVolume();
      st.save();
    }, () => Codex.audio.sfx.good()));

    wrap.appendChild(toggleRow(Codex.t("set.ambience"), Codex.t("set.ambienceSub"), s.ambience, (on) => {
      s.ambience = on;
      st.save();
      if (on) Codex.audio.startAmbience();
      else Codex.audio.stopAmbience();
    }));

    wrap.appendChild(toggleRow(Codex.t("set.echoVoice"), Codex.t("set.echoVoiceSub"), s.echoVoice, (on) => {
      s.echoVoice = on;
      st.save();
      if (on) Codex.audio.speakEcho(Codex.t("echoc.intro", { name: st.data.agent.codeName }));
      else window.speechSynthesis.cancel();
    }));

    // ----- ACCESSIBILITÉ & LANGUE -----
    wrap.appendChild(el(`<div class="label mt-2">${esc(Codex.t("set.access"))}</div>`));

    wrap.appendChild(toggleRow(Codex.t("set.reduced"), Codex.t("set.reducedSub"), s.reducedMotion, (on) => {
      s.reducedMotion = on;
      document.body.classList.toggle("reduced-motion", on);
      st.save();
    }));

    const langRow = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">${esc(Codex.t("set.lang"))}</div>
          <div class="small muted">${esc(Codex.t("set.langSub"))}</div>
        </div>
        <div class="seg-group">
          <button class="seg-btn ${st.l1() === "fr" ? "on" : ""}" data-l1="fr">🇫🇷 Français</button>
          <button class="seg-btn ${st.l1() === "en" ? "on" : ""}" data-l1="en">🇬🇧 English</button>
        </div>
      </div>`);
    langRow.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newL1 = btn.dataset.l1;
        if (newL1 === st.l1()) return;
        Codex.audio.sfx.stamp();
        st.data.agent.l1 = newL1;
        Codex.i18n.set(newL1);
        // Conserve la L2 si elle reste jouable, sinon premier arc disponible
        if (!Codex.isArcPlayable(st.lang(), newL1)) {
          const first = Codex.arcsFor(newL1)[0];
          if (first) st.setL2(first.id);
        }
        st.save();
        Codex.router.go("settings");
      });
    });
    wrap.appendChild(langRow);

    // ----- DONNÉES -----
    wrap.appendChild(el(`<div class="label mt-2">${esc(Codex.t("set.data"))}</div>`));
    const resetRow = el(`
      <div class="setting-row">
        <div>
          <div style="font-weight:600">${esc(Codex.t("set.reset"))}</div>
          <div class="small muted">${esc(Codex.t("set.resetSub"))}</div>
        </div>
        <button class="btn btn-danger" style="padding:10px 18px">${esc(Codex.t("set.resetBtn"))}</button>
      </div>`);
    resetRow.querySelector(".btn").addEventListener("click", () => {
      const popup = el(`
        <div class="fragment-popup" style="border-color: var(--accent-red)">
          <div class="fragment-popup-head"><span class="label red">${esc(Codex.t("set.confirmTitle"))}</span></div>
          <div class="fragment-section">${esc(Codex.t("set.confirmText"))}</div>
          <div class="fragment-footer">
            <button class="btn btn-muted cancel">${esc(Codex.t("set.cancel"))}</button>
            <button class="btn btn-danger confirm">${esc(Codex.t("set.confirmBtn"))}</button>
          </div>
        </div>`);
      const m = modal(popup);
      popup.querySelector(".cancel").addEventListener("click", () => { Codex.audio.sfx.click(); m.close(); });
      popup.querySelector(".confirm").addEventListener("click", async () => {
        Codex.audio.sfx.stamp();
        Codex.music.stop(0.2);
        await st.reset();
        m.close();
        Codex.router.go("title");
      });
    });
    wrap.appendChild(resetRow);

    wrap.appendChild(el(`<div class="small muted center mt-2" style="white-space:pre-line">${esc(Codex.t("set.offline"))}</div>`));

    scroll.appendChild(wrap);
    screenEl.appendChild(scroll);
  });
})();
