/**
 * THE CODEX — Bibliothèque des mots.
 * Parcours du vocabulaire thématique de la langue active (Codex.VOCAB) :
 * mot + gloss dans la langue du joueur, écoute TTS au clic.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  function R(x) {
    if (x && typeof x === "object") return x[Codex.i18n.get()] ?? x.fr ?? x.en;
    return x;
  }

  Codex.router.register("library", (screenEl) => {
    const arc = Codex.arc();
    const bank = Codex.VOCAB[arc.id] || { themes: [] };
    const total = bank.themes.reduce((a, t) => a + t.words.length, 0);

    Codex.ui.fxLayers(screenEl);
    screenEl.appendChild(pageHeader(Codex.t("library.title"), "studio", { flagCode: arc.id }));

    const wrap = el(`
      <div class="screen-scroll"><div class="library-wrap">
        <div class="small muted center mb-2">${esc(Codex.t("library.sub", { n: total }))}</div>
      </div></div>`);
    const box = wrap.querySelector(".library-wrap");
    screenEl.appendChild(wrap);

    for (const theme of bank.themes) {
      const card = el(`
        <div class="card library-theme">
          <div class="label cyan mb-1">${esc(R(theme.name).toUpperCase())} <span class="muted">· ${theme.words.length}</span></div>
          <div class="library-grid"></div>
        </div>`);
      const grid = card.querySelector(".library-grid");
      for (const word of theme.words) {
        const w = el(`
          <button class="library-word">
            <span class="data lw-word"></span>
            <span class="small muted lw-gloss"></span>
          </button>`);
        w.querySelector(".lw-word").textContent = word.w;
        w.querySelector(".lw-gloss").textContent = R(word.g);
        w.addEventListener("click", () => {
          Codex.audio.sfx.hover();
          Codex.audio.speak(word.w);
        });
        grid.appendChild(w);
      }
      box.appendChild(card);
    }

    Codex.fx.stagger([...box.children]);
  });
})();
