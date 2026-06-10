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

  /** Effet machine à écrire (désactivé si animations réduites). */
  function typewrite(node, text, speed = 14) {
    if (Codex.state.data.settings.reducedMotion) {
      node.textContent = text;
      return;
    }
    node.textContent = "";
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      node.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    node.dataset.tw = String(id); // permet d'annuler si remplacé
  }

  /** En-tête de page standard avec bouton retour. */
  function pageHeader(title, backTo = "hq") {
    const head = el(`
      <div class="page-header">
        <button class="back-btn">${esc(Codex.t("common.back"))}</button>
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

  /** Barre ECHO commune aux terrains. Retourne { node, say, hintsUsed }. */
  function echoBar(initialText, { hints = Infinity, onHint = null } = {}) {
    let hintsLeft = hints;
    const node = el(`
      <div class="echo-bar">
        <div class="echo-hex"></div>
        <div class="echo-text"></div>
        ${onHint ? `<button class="echo-hint-btn">${esc(Codex.t("terrain.hint"))}${hints !== Infinity ? ` (${hints})` : ""}</button>` : ""}
      </div>`);
    const textEl = node.querySelector(".echo-text");
    typewrite(textEl, initialText);

    const btn = node.querySelector(".echo-hint-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        if (hintsLeft <= 0) return;
        hintsLeft -= 1;
        Codex.audio.sfx.echo();
        onHint();
        if (hintsLeft !== Infinity) btn.textContent = `${Codex.t("terrain.hint")} (${hintsLeft})`;
        if (hintsLeft <= 0) btn.disabled = true;
      });
    }

    return {
      node,
      say(text) {
        Codex.audio.sfx.echo();
        if (textEl.dataset.tw) clearInterval(Number(textEl.dataset.tw));
        typewrite(textEl, text);
      },
      hintsUsed: () => (hints === Infinity ? 0 : hints - hintsLeft),
    };
  }

  /** Points de progression des fragments. */
  function fragDots(total) {
    const wrap = el(`<div class="frag-dots"><span class="label" style="margin-right:6px">${esc(Codex.t("terrain.fragments"))}</span></div>`);
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

  /** Notification éphémère en haut de l'écran. */
  function toast(text, icon = "📡") {
    const t = el(`<div class="toast"><span>${esc(icon)}</span><span>${esc(text)}</span></div>`);
    document.getElementById("app").appendChild(t);
    setTimeout(() => t.classList.add("out"), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  /** Effet de balayage « scan » à l'entrée d'un terrain. */
  function scanEffect(sceneEl) {
    const line = el(`<div class="scene-scanline"></div>`);
    sceneEl.appendChild(line);
    Codex.audio.sfx.scanner();
    setTimeout(() => line.remove(), 700);
  }

  /**
   * Construit la scène 2.5D : couches d'atmosphère (halo lumineux, sol en
   * perspective, skyline, poussière animée) + props emoji.
   */
  function buildScene(sceneDef) {
    const scene = el(`<div class="terrain-scene scene-${esc(sceneDef.ambiance)}"></div>`);

    scene.appendChild(el(`<div class="scene-glow"></div>`));
    scene.appendChild(el(`<div class="scene-skyline"></div>`));
    scene.appendChild(el(`<div class="scene-floor"></div>`));

    (sceneDef.props || []).forEach((p, i) => {
      const prop = el(`<div class="scene-prop"></div>`);
      prop.textContent = p.e;
      prop.style.left = `${p.x}%`;
      prop.style.top = `${p.y}%`;
      prop.style.animationDelay = `${(i % 5) * 0.9}s`;
      if (p.size) prop.style.fontSize = `${p.size}px`;
      scene.appendChild(prop);
    });

    // Poussière / particules dérivantes
    const dust = el(`<div class="scene-dust"></div>`);
    for (let i = 0; i < 14; i++) {
      const d = el(`<i></i>`);
      d.style.left = `${Math.random() * 100}%`;
      d.style.animationDuration = `${9 + Math.random() * 14}s`;
      d.style.animationDelay = `${-Math.random() * 18}s`;
      dust.appendChild(d);
    }
    scene.appendChild(dust);

    scene.appendChild(el(`<div class="scene-vignette"></div>`));
    return scene;
  }

  Codex.ui = { el, esc, stars, typewrite, pageHeader, echoBar, fragDots, modal, toast, scanEffect, buildScene };
})();
