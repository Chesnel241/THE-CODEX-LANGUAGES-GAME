/**
 * THE CODEX — Écran Titre (GDD §7.1).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el } = Codex.ui;

  function codeRain() {
    const chars = "01ΛΣΦΨΩ◢◣▓░⟨⟩/\\|=+-*#$%&@";
    let out = "";
    for (let i = 0; i < 90; i++) {
      let line = "";
      for (let j = 0; j < 110; j++) line += chars[Math.floor(Math.random() * chars.length)];
      out += line + "\n";
    }
    return out;
  }

  Codex.router.register("title", (screenEl) => {
    screenEl.classList.add("title-screen");
    const known = Codex.state.onboarded();

    const bg = el(`<div class="title-code-bg"></div>`);
    bg.textContent = codeRain() + codeRain();
    screenEl.appendChild(bg);
    screenEl.appendChild(el(`<div class="title-halo"></div>`));
    screenEl.appendChild(el(`<div class="title-grid"></div>`));

    const confidential = known ? Codex.t("title.confidential") : "DOCUMENT CONFIDENTIEL · CLASSIFIED DOCUMENT";
    const tagline = known
      ? Codex.t("app.tagline")
      : "La langue est ton arme. · Language is your weapon.";

    Codex.ui.fxLayers(screenEl);
    screenEl.appendChild(el(`
      <div class="title-emblem" aria-hidden="true">
        <div class="ring"></div>
        <div class="ring r2"></div>
        <div class="core"></div>
      </div>`));
    screenEl.appendChild(el(`<div class="tag-classified" style="animation: fadeUp 1s ease 0.3s both; z-index:1">${Codex.ui.esc(confidential)}</div>`));
    screenEl.appendChild(el(`<div class="title-logo mt-2">THE CODEX</div>`));
    screenEl.appendChild(el(`<div class="title-tagline">${Codex.ui.esc(tagline)}</div>`));

    const startBtn = el(`<button class="btn title-start" disabled>${Codex.ui.esc(known ? Codex.t("title.init") : "INITIALISATION… / INITIALISING…")}</button>`);
    screenEl.appendChild(startBtn);

    // Déverrouillage après 1,5 s (GDD : sentiment de sécurité)
    setTimeout(() => {
      startBtn.disabled = false;
      startBtn.textContent = known ? Codex.t("title.start") : "DÉMARRER / START";
      Codex.audio.sfx.lock();
    }, 1500);

    startBtn.addEventListener("click", () => {
      Codex.audio.sfx.stamp();
      Codex.audio.startAmbience();
      if (Codex.state.onboarded()) Codex.router.go("hq");
      else Codex.router.go("onboarding");
    });

    // Manuel de l'Agent : les règles avant même de s'enrôler
    const helpBtn = el(`<button class="btn btn-ghost title-help">${Codex.ui.esc(known ? Codex.t("title.howto") : "COMMENT JOUER · HOW TO PLAY")}</button>`);
    helpBtn.insertBefore(Codex.ui.icon("book-open", { size: 15 }), helpBtn.firstChild);
    helpBtn.addEventListener("click", () => {
      Codex.audio.sfx.paper();
      Codex.router.go("manual", { from: "title" });
    });
    screenEl.appendChild(helpBtn);

    const ver = el(`<div class="title-version">v—</div>`);
    screenEl.appendChild(ver);
    if (window.codexBridge) {
      window.codexBridge.appInfo()
        .then((info) => { ver.textContent = `v${info.version}`; })
        .catch(() => { ver.textContent = ""; });
    }
  });
})();
