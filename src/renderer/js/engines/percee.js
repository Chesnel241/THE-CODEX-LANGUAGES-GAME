/**
 * THE CODEX — Moteur LA PERCÉE (GDD §5.1).
 * Fragments cachés dans la scène → popup d'intel → Carte Intel finale.
 * Pas d'échec possible : l'exploration est toujours récompensée.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.engines = Codex.engines || {};

(function () {
  const { el, esc, fragDots, echoBar, modal, scanEffect, buildScene } = Codex.ui;

  /**
   * Monte le moteur dans screenEl.
   * @param opts { content, hints, onDone } — content : { scene, fragments, cultural?, brief? }
   */
  function mount(screenEl, opts) {
    const { content, onDone } = opts;
    const hints = opts.hints ?? Codex.state.level().hints;
    const startTime = Date.now();
    const total = content.fragments.length;
    let collected = 0;
    let culturalFound = 0;

    screenEl.innerHTML = "";

    const dots = fragDots(total);
    const topbar = el(`
      <div class="terrain-topbar">
        <div>
          <div class="label">TERRAIN ACTIF</div>
          <div class="data">${esc(content.scene.name)}</div>
        </div>
      </div>`);
    topbar.appendChild(dots.node);
    screenEl.appendChild(topbar);

    const scene = buildScene(content.scene);
    screenEl.appendChild(scene);

    const echo = echoBar(opts.echoIntro || "Scannez la zone. Les fragments pulsent en cyan.", {
      hints,
      onHint: () => {
        const next = content.fragments.find((f) => !f.collected);
        if (next) echo.say(`Concentrez-vous sur : ${next.label}. L'intel y est dissimulée.`);
        else echo.say("Tous les fragments sont sécurisés, Agent.");
      },
    });
    screenEl.appendChild(echo.node);

    scanEffect(scene);

    function openFragment(frag, hotspotEl, index) {
      Codex.audio.sfx.intercept();
      const popup = el(`
        <div class="fragment-popup">
          <div class="fragment-popup-head">
            <span class="label cyan">⚡ FRAGMENT INTERCEPTÉ</span>
            <span class="data muted">[${collected + 1}/${total}]</span>
          </div>
          <div class="fragment-section fragment-scene">${esc(frag.sceneText)}</div>
          <div class="fragment-section">
            <div class="label mb-1">INTEL DÉCODÉE</div>
            <div class="fragment-intel">${esc(frag.intel)}</div>
            <div class="small muted mt-1">${esc(frag.rule)}</div>
          </div>
          <div class="fragment-section fragment-echo">
            <div class="echo-hex"></div>
            <div class="echo-text">${esc(frag.echo)}</div>
          </div>
          <div class="fragment-footer">
            <button class="btn btn-green">✓ SÉCURISER CE FRAGMENT</button>
          </div>
        </div>`);
      Codex.audio.sfx.popup();
      const m = modal(popup, { closable: false });
      popup.querySelector(".btn").addEventListener("click", () => {
        Codex.audio.sfx.lock();
        m.close();
        frag.collected = true;
        hotspotEl.classList.add("collected");
        dots.fill(index);
        collected += 1;
        Codex.state.data.stats.fragmentsCollected += 1;
        Codex.state.save();

        if (collected === total) {
          finish();
        } else if (collected === total - 1) {
          echo.say("Dernier fragment, Agent. L'intel est presque complète.");
          Codex.audio.sfx.tension();
        } else {
          echo.say(`Fragment sécurisé. ${total - collected} restant${total - collected > 1 ? "s" : ""}.`);
        }
      });
    }

    function openCultural(cult, hotspotEl) {
      Codex.audio.sfx.cultural();
      const popup = el(`
        <div class="fragment-popup" style="border-color: var(--accent-amber)">
          <div class="fragment-popup-head">
            <span class="label amber">🌍 CULTURAL INTEL</span>
            <span class="data amber">+${cult.xp} XP</span>
          </div>
          <div class="fragment-section">
            <div class="h2 mb-1">${esc(cult.title)}</div>
            <div>${esc(cult.text)}</div>
          </div>
          <div class="fragment-footer">
            <button class="btn">ARCHIVER</button>
          </div>
        </div>`);
      const m = modal(popup, { closable: false });
      popup.querySelector(".btn").addEventListener("click", () => {
        Codex.audio.sfx.lock();
        m.close();
        hotspotEl.classList.add("collected");
        culturalFound += 1;
        echo.say("Intel culturelle archivée. Ces détails font les meilleures couvertures.");
      });
    }

    content.fragments.forEach((frag, i) => {
      frag.collected = false;
      const hs = el(`
        <button class="hotspot" aria-label="${esc(frag.label)}">
          <span>${esc(frag.icon)}</span>
          <span class="hotspot-tip">${esc(frag.label)}</span>
        </button>`);
      hs.style.left = `${frag.x}%`;
      hs.style.top = `${frag.y}%`;
      hs.addEventListener("mouseenter", () => Codex.audio.sfx.hover());
      hs.addEventListener("click", () => openFragment(frag, hs, i));
      scene.appendChild(hs);
    });

    if (content.cultural && content.cultural.x !== undefined) {
      const c = content.cultural;
      const hs = el(`
        <button class="hotspot cultural" aria-label="${esc(c.label)}">
          <span>${esc(c.icon)}</span>
          <span class="hotspot-tip">${esc(c.label)}</span>
        </button>`);
      hs.style.left = `${c.x}%`;
      hs.style.top = `${c.y}%`;
      hs.addEventListener("mouseenter", () => Codex.audio.sfx.hover());
      hs.addEventListener("click", () => openCultural(c, hs));
      scene.appendChild(hs);
    }

    function finish() {
      Codex.audio.sfx.vaultOpen();
      const crack = el(`
        <div class="modal-overlay">
          <div class="center">
            <div style="font-size:54px">🔓</div>
            <div class="h1 mt-1">VAULT CRACK</div>
            <div class="label mt-1">INTEL COMPLÈTE — DÉCLASSIFICATION…</div>
          </div>
        </div>`);
      screenEl.appendChild(crack);
      setTimeout(() => {
        onDone({
          errors: 0,
          hintsUsed: echo.hintsUsed(),
          fragments: collected,
          cultural: culturalFound,
          maxSuspicion: 0,
          timeSec: Math.round((Date.now() - startTime) / 1000),
        });
      }, 1600);
    }
  }

  Codex.engines.percee = { mount };

  Codex.router.register("terrain-percee", (screenEl, params) => {
    mount(screenEl, {
      content: params.mission,
      echoIntro: params.mission.brief.echo,
      onDone: (r) => Codex.flow.completeMission(params.mission, r),
    });
  });
})();
