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

  /** Icône vectorielle Lucide embarquée (Codex.ICONS). Repli : span vide. */
  function icon(name, { size = 18, cls = "" } = {}) {
    const inner = (Codex.ICONS && Codex.ICONS[name]) || "";
    return el(
      `<svg class="ic ${esc(cls)}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
    );
  }

  /** Mini-drapeau SVG (Codex.FLAGS) — les emojis drapeaux n'existent pas sous Windows. */
  function flag(code, { w = 22 } = {}) {
    const key = (Codex.FLAG_BY_LANG && Codex.FLAG_BY_LANG[code]) || code;
    const inner = (Codex.FLAGS && Codex.FLAGS[key]) || "";
    return el(`<svg class="flag" width="${w}" height="${Math.round(w * 2 / 3)}" viewBox="0 0 24 16" aria-hidden="true">${inner}</svg>`);
  }

  /** Icône du type de mission (remplace les emojis du contenu). */
  const TYPE_ICONS = {
    percee: "lock-open",
    infiltration: "drama",
    surveillance: "file-search",
    negociation: "handshake",
    extraction: "target",
  };
  function typeIcon(type, opts = {}) {
    return icon(TYPE_ICONS[type] || "target", { size: opts.size || 24, cls: opts.cls || "" });
  }

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

  /** En-tête de page standard avec bouton retour (chevron vectoriel + drapeau optionnel). */
  function pageHeader(title, backTo = "hq", { flagCode = null } = {}) {
    const head = el(`
      <div class="page-header">
        <button class="back-btn" aria-label="${esc(Codex.t("common.back"))}"></button>
        <div>
          <div class="label">THE CODEX</div>
          <div class="h2 page-title"></div>
        </div>
      </div>`);
    const backBtn = head.querySelector(".back-btn");
    backBtn.appendChild(icon("chevron-left", { size: 16 }));
    backBtn.appendChild(document.createTextNode(Codex.t("common.back").replace(/^←\s*/, "")));
    const titleEl = head.querySelector(".page-title");
    if (flagCode) titleEl.appendChild(flag(flagCode));
    titleEl.appendChild(document.createTextNode(title));
    backBtn.addEventListener("click", () => {
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
        Codex.audio.speakEcho(text); // voix d'ECHO (si activée)
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
   * Construit la scène de terrain : environnement 3D temps réel (three.js)
   * quand WebGL est disponible, sinon couches CSS 2.5D (halo, sol, skyline,
   * poussière) + props emoji. Les hotspots ajoutés par les moteurs sont
   * automatiquement ancrés dans le monde 3D (projection par frame).
   */
  function buildScene(sceneDef) {
    const scene = el(`<div class="terrain-scene scene-${esc(sceneDef.ambiance)}"></div>`);

    // Tentative 3D — repli silencieux sur les couches CSS
    if (Codex.scene3d && Codex.scene3d.mount(scene, sceneDef)) {
      scene.classList.add("has-3d");
    }

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

  /** Couches d'ambiance plein écran (aurora animée, scanlines, grain). */
  function fxLayers(screenEl, { aurora = true, scanlines = true } = {}) {
    if (aurora) screenEl.appendChild(el(`<div class="fx-aurora" aria-hidden="true"></div>`));
    if (scanlines) screenEl.appendChild(el(`<div class="fx-scanlines" aria-hidden="true"></div>`));
  }

  Codex.ui = { el, esc, stars, icon, flag, typeIcon, typewrite, pageHeader, echoBar, fragDots, modal, toast, scanEffect, buildScene, fxLayers };
})();
