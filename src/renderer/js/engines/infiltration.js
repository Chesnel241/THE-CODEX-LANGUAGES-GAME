/**
 * THE CODEX — Moteur L'INFILTRATION (GDD §5.2).
 * Interactions sociales + Compteur de Suspicion. Pas de game over :
 * à 100 %, ECHO déclenche la « Phase Complication ». La musique suit
 * la suspicion : exploration → tension (>40 %) → climax (>75 %).
 */
"use strict";
window.Codex = window.Codex || {};
Codex.engines = Codex.engines || {};

(function () {
  const { el, esc, echoBar, scanEffect, buildScene } = Codex.ui;

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function suspicionColor(v) {
    if (v <= 30) return "var(--accent-green)";
    if (v <= 60) return "var(--accent-amber)";
    if (v <= 80) return "#ff8c42";
    return "var(--accent-red)";
  }

  /** opts : { content: { scene, interactions }, hints, echoIntro, onDone } */
  function mount(screenEl, opts) {
    const { content, onDone } = opts;
    const hints = opts.hints ?? Math.min(1, Codex.state.level().hints); // 1 max en infiltration (GDD)
    const arc = Codex.arc();
    const startTime = Date.now();
    let suspicion = 0;
    let maxSuspicion = 0;
    let errors = 0;
    let idx = 0;
    let complicationTriggered = false;

    screenEl.innerHTML = "";
    Codex.music.play(arc.theme, "exploration");

    const topbar = el(`
      <div class="terrain-topbar">
        <div>
          <div class="label">${esc(Codex.t("terrain.infilTitle"))}</div>
          <div class="data">${esc(content.scene.name)}</div>
        </div>
        <div class="suspicion-wrap">
          <span class="label">${esc(Codex.t("terrain.suspicion"))}</span>
          <div class="suspicion-bar"><div class="suspicion-fill"></div></div>
          <span class="data suspicion-val">0%</span>
        </div>
      </div>`);
    screenEl.appendChild(topbar);
    const fill = topbar.querySelector(".suspicion-fill");
    const valEl = topbar.querySelector(".suspicion-val");

    // Dialogue face à face : la scène 3D place un interlocuteur côté gauche
    const scene = buildScene({ ...content.scene, focusNpc: true });
    screenEl.appendChild(scene);

    const dialogueZone = el(`<div class="dialogue-zone"></div>`);
    scene.appendChild(dialogueZone);

    let currentInteraction = null;
    const echo = echoBar(opts.echoIntro || Codex.t("echo.infilIntro"), {
      hints,
      onHint: () => {
        if (currentInteraction) echo.say(currentInteraction.echoHint);
      },
    });
    screenEl.appendChild(echo.node);

    scanEffect(scene);

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function setSuspicion(v) {
      suspicion = Math.max(0, Math.min(100, v));
      maxSuspicion = Math.max(maxSuspicion, suspicion);
      fill.style.width = `${suspicion}%`;
      fill.style.background = suspicionColor(suspicion);
      valEl.textContent = `${suspicion}%`;

      // Musique adaptative selon la pression
      if (suspicion > 75) Codex.music.setState("climax");
      else if (suspicion > 40) Codex.music.setState("tension");
      else Codex.music.setState("exploration");

      if (suspicion >= 100 && !complicationTriggered) {
        complicationTriggered = true;
        Codex.audio.sfx.heartbeat();
        echo.say(Codex.t("echo.complication"));
        setSuspicion(70); // l'agent « change d'approche », la pression redescend
      } else if (suspicion > 80) {
        Codex.audio.sfx.heartbeat();
        echo.say(pick(arc.echo.urgent));
      } else if (suspicion > 60) {
        Codex.audio.sfx.tension();
        echo.say(pick(arc.echo.warning));
      }
    }

    function showInteraction(i) {
      const inter = content.interactions[i];
      currentInteraction = inter;
      dialogueZone.innerHTML = "";

      const bubble = el(`
        <div class="npc-bubble">
          <div class="npc-name">${esc(inter.npcIcon)} ${esc(inter.npc)}</div>
          <div class="npc-line"></div>
          <div class="npc-context">${esc(inter.context)}</div>
          <div class="npc-reaction"></div>
        </div>`);
      bubble.querySelector(".npc-line").textContent = inter.line;
      dialogueZone.appendChild(bubble);
      Codex.audio.speak(inter.line);

      const reaction = bubble.querySelector(".npc-reaction");
      const choicesEl = el(`<div class="choices"></div>`);
      dialogueZone.appendChild(choicesEl);

      let resolved = false;
      shuffled(inter.choices).forEach((choice) => {
        const btn = el(`<button class="choice-btn"></button>`);
        btn.textContent = choice.text;
        btn.addEventListener("click", () => {
          if (resolved) return;
          if (choice.correct) {
            resolved = true;
            btn.classList.add("good");
            Codex.audio.sfx.good();
            reaction.textContent = choice.reaction;
            setSuspicion(suspicion - 10);
            choicesEl.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
            setTimeout(() => {
              idx += 1;
              if (idx < content.interactions.length) showInteraction(idx);
              else finish();
            }, 1700);
          } else {
            btn.classList.add("bad");
            btn.disabled = true;
            errors += 1;
            Codex.audio.sfx.error();
            Codex.audio.sfx.suspicionUp();
            reaction.textContent = choice.reaction;
            setSuspicion(suspicion + (choice.suspicion || 15));
          }
        });
        choicesEl.appendChild(btn);
      });
    }

    function finish() {
      Codex.audio.sfx.good();
      onDone({
        errors,
        hintsUsed: echo.hintsUsed(),
        fragments: 0,
        cultural: 0,
        maxSuspicion,
        timeSec: Math.round((Date.now() - startTime) / 1000),
      });
    }

    showInteraction(0);
  }

  Codex.engines.infiltration = { mount };

  Codex.router.register("terrain-infiltration", (screenEl, params) => {
    mount(screenEl, {
      content: params.mission,
      echoIntro: params.mission.brief.echo,
      onDone: (r) => Codex.flow.completeMission(params.mission, r),
    });
  });
})();
