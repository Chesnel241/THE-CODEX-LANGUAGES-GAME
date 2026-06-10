/**
 * THE CODEX — Helpers UI partagés.
 * NB : CSP stricte → aucun handler inline ; tout passe par addEventListener.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  /** Crée un élément depuis une chaîne HTML (un seul nœud racine). */
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /** Échappe le texte injecté dans du HTML (défense XSS systématique). */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

  /** En-tête de page standard avec bouton retour. */
  function pageHeader(title, backTo = "hq") {
    const head = el(`
      <div class="page-header">
        <button class="back-btn">← RETOUR</button>
        <div>
          <div class="label">THE CODEX</div>
          <div class="h2">${esc(title)}</div>
        </div>
      </div>`);
    head.querySelector(".back-btn").addEventListener("click", () => {
      Codex.audio.sfx.click();
      Codex.router.go(backTo);
    });
    return head;
  }

  /** Barre ECHO commune aux terrains. Retourne { node, say, setHint }. */
  function echoBar(initialText, { hints = Infinity, onHint = null } = {}) {
    let hintsLeft = hints;
    const node = el(`
      <div class="echo-bar">
        <div class="echo-hex"></div>
        <div class="echo-text"></div>
        ${onHint ? `<button class="echo-hint-btn">INDICE ECHO${hints !== Infinity ? ` (${hints})` : ""}</button>` : ""}
      </div>`);
    const textEl = node.querySelector(".echo-text");
    textEl.textContent = initialText;

    const btn = node.querySelector(".echo-hint-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        if (hintsLeft <= 0) return;
        hintsLeft -= 1;
        Codex.audio.sfx.echo();
        onHint();
        if (hintsLeft !== Infinity) btn.textContent = `INDICE ECHO (${hintsLeft})`;
        if (hintsLeft <= 0) btn.disabled = true;
      });
    }

    return {
      node,
      say(text) {
        Codex.audio.sfx.echo();
        textEl.textContent = text;
      },
      hintsUsed: () => (hints === Infinity ? 0 : hints - hintsLeft),
    };
  }

  /** Points de progression des fragments. */
  function fragDots(total) {
    const wrap = el(`<div class="frag-dots"><span class="label" style="margin-right:6px">FRAGMENTS</span></div>`);
    const dots = [];
    for (let i = 0; i < total; i++) {
      const d = el(`<div class="frag-dot"></div>`);
      wrap.appendChild(d);
      dots.push(d);
    }
    return { node: wrap, fill(i) { if (dots[i]) dots[i].classList.add("filled"); } };
  }

  /** Modale générique. Retourne l'overlay ; close() pour fermer. */
  function modal(contentNode, { closable = true } = {}) {
    const overlay = el(`<div class="modal-overlay"></div>`);
    overlay.appendChild(contentNode);
    if (closable) {
      overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    }
    function close() { overlay.remove(); }
    document.querySelector(".screen").appendChild(overlay);
    return { overlay, close };
  }

  /** Effet de balayage "scan" à l'entrée d'un terrain. */
  function scanEffect(sceneEl) {
    const line = el(`<div class="scene-scanline"></div>`);
    sceneEl.appendChild(line);
    Codex.audio.sfx.scanner();
    setTimeout(() => line.remove(), 700);
  }

  /** Construit la scène 2.5D : décor + props d'ambiance. */
  function buildScene(sceneDef) {
    const scene = el(`<div class="terrain-scene scene-${esc(sceneDef.ambiance)}"></div>`);
    (sceneDef.props || []).forEach((p) => {
      const prop = el(`<div class="scene-prop"></div>`);
      prop.textContent = p.e;
      prop.style.left = `${p.x}%`;
      prop.style.top = `${p.y}%`;
      if (p.size) prop.style.fontSize = `${p.size}px`;
      scene.appendChild(prop);
    });
    scene.appendChild(el(`<div class="scene-vignette"></div>`));
    return scene;
  }

  Codex.ui = { el, esc, stars, pageHeader, echoBar, fragDots, modal, scanEffect, buildScene };
})();
