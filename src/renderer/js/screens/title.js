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

    const bg = el(`<div class="title-code-bg"></div>`);
    bg.textContent = codeRain() + codeRain();
    screenEl.appendChild(bg);
    screenEl.appendChild(el(`<div class="title-halo"></div>`));

    screenEl.appendChild(el(`<div class="tag-classified" style="animation: fadeUp 1s ease 0.3s both; z-index:1">DOCUMENT CONFIDENTIEL</div>`));
    screenEl.appendChild(el(`<div class="title-logo mt-2">THE CODEX</div>`));
    screenEl.appendChild(el(`<div class="title-tagline">La langue est ton arme. Chaque mission, un nouveau pouvoir.</div>`));

    const startBtn = el(`<button class="btn title-start" disabled>INITIALISATION…</button>`);
    screenEl.appendChild(startBtn);

    // Déverrouillage après 1,5 s (GDD : sentiment de sécurité)
    setTimeout(() => {
      startBtn.disabled = false;
      startBtn.textContent = "DÉMARRER";
      Codex.audio.sfx.lock();
    }, 1500);

    startBtn.addEventListener("click", () => {
      Codex.audio.sfx.stamp();
      Codex.audio.startAmbience();
      Codex.router.go("hq");
    });

    const ver = el(`<div class="title-version">v—</div>`);
    screenEl.appendChild(ver);
    if (window.codexBridge) {
      window.codexBridge.appInfo()
        .then((info) => { ver.textContent = `v${info.version}`; })
        .catch(() => { ver.textContent = ""; });
    }
  });
})();
