/**
 * THE CODEX — Routeur d'écrans minimal.
 * Chaque écran s'enregistre avec { id, render(container, params) }.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const screens = {};
  let current = null;

  Codex.router = {
    register(id, renderFn) { screens[id] = renderFn; },

    go(id, params = {}) {
      const render = screens[id];
      if (!render) {
        console.error(`Écran inconnu : ${id}`);
        return;
      }
      const app = document.getElementById("app");
      app.innerHTML = "";
      window.speechSynthesis && window.speechSynthesis.cancel();
      const el = document.createElement("div");
      el.className = "screen";
      app.appendChild(el);
      current = id;
      render(el, params);
    },

    current() { return current; },
  };
})();
