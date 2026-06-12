/**
 * THE CODEX — Moteur LA NÉGOCIATION (GDD §5.3).
 * Construction de phrases : banque de mots colorée par catégorie,
 * Niveau de Coopération du PNJ, feedback non-punitif.
 * Musique : la tension monte avec les échanges.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.engines = Codex.engines || {};

(function () {
  const { el, esc, echoBar } = Codex.ui;

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** opts : { content: { scene, rounds }, hints, echoIntro, onDone } */
  function mount(screenEl, opts) {
    const { content, onDone } = opts;
    const hints = opts.hints ?? Codex.state.level().hints;
    const startTime = Date.now();
    let cooperation = 50;
    let errors = 0;
    let roundIdx = 0;

    screenEl.innerHTML = "";
    Codex.music.play(Codex.arc().theme, "exploration");

    const topbar = el(`
      <div class="terrain-topbar">
        <div>
          <div class="label">${esc(Codex.t("terrain.negoTitle"))}</div>
          <div class="data">${esc(content.scene.name)}</div>
        </div>
        <div class="suspicion-wrap coop-wrap">
          <span class="label">${esc(Codex.t("terrain.cooperation"))}</span>
          <div class="suspicion-bar"><div class="suspicion-fill" style="background: var(--accent-cyan); width: 50%"></div></div>
          <span class="data coop-val">50%</span>
        </div>
      </div>`);
    screenEl.appendChild(topbar);
    const coopFill = topbar.querySelector(".suspicion-fill");
    const coopVal = topbar.querySelector(".coop-val");

    const wrap = el(`<div class="nego-wrap"></div>`);
    screenEl.appendChild(wrap);

    let currentRound = null;
    const echo = echoBar(opts.echoIntro || Codex.t("echo.negoIntro"), {
      hints,
      protocol: "negociation",
      onHint: () => { if (currentRound) echo.say(currentRound.echoHint); },
    });
    screenEl.appendChild(echo.node);
    Codex.ui.maybeProtocol("negociation");

    function setCoop(v) {
      cooperation = Math.max(0, Math.min(100, v));
      coopFill.style.width = `${cooperation}%`;
      coopVal.textContent = `${cooperation}%`;
    }

    function showRound(i) {
      const round = content.rounds[i];
      currentRound = round;
      wrap.innerHTML = "";

      // Tension musicale croissante avec les échanges
      if (i >= content.rounds.length - 1) Codex.music.setState("climax");
      else if (i >= Math.floor(content.rounds.length / 2)) Codex.music.setState("tension");

      const npcBubble = el(`
        <div class="npc-bubble">
          <div class="npc-name">${esc(Codex.t("terrain.npcTarget"))}</div>
          <div class="npc-line"></div>
          <div class="npc-reaction"></div>
        </div>`);
      npcBubble.querySelector(".npc-line").textContent = round.npcLine;
      wrap.appendChild(npcBubble);
      Codex.audio.speak(round.npcLine);
      const reaction = npcBubble.querySelector(".npc-reaction");

      wrap.appendChild(el(`
        <div class="nego-target">
          <div class="label mb-1">${esc(Codex.t("terrain.target", { i: i + 1, n: content.rounds.length }))}</div>
          <div style="font-size:17px; font-weight:600">${esc(round.targetL1)}</div>
        </div>`));

      const buildZone = el(`<div class="build-zone"><span class="muted small">${esc(Codex.t("terrain.buildPh"))}</span></div>`);
      wrap.appendChild(buildZone);

      const bankEl = el(`<div class="word-bank"></div>`);
      wrap.appendChild(bankEl);

      const actions = el(`
        <div class="row mt-1">
          <button class="btn validate-btn">${esc(Codex.t("terrain.transmit"))}</button>
          <button class="btn btn-muted clear-btn">${esc(Codex.t("terrain.clear"))}</button>
        </div>`);
      wrap.appendChild(actions);

      const built = []; // { w, cat, bankBtn }

      function refreshBuild() {
        buildZone.innerHTML = "";
        if (built.length === 0) {
          buildZone.appendChild(el(`<span class="muted small">${esc(Codex.t("terrain.buildPh"))}</span>`));
          return;
        }
        built.forEach((item, bi) => {
          const chip = el(`<button class="word-chip cat-${esc(item.cat)}"></button>`);
          chip.textContent = item.w;
          chip.title = Codex.t("terrain.removeWord");
          chip.addEventListener("click", () => {
            Codex.audio.sfx.click();
            item.bankBtn.disabled = false;
            built.splice(bi, 1);
            refreshBuild();
          });
          buildZone.appendChild(chip);
        });
      }

      shuffled(round.bank).forEach((entry) => {
        const chip = el(`<button class="word-chip cat-${esc(entry.cat)}"></button>`);
        chip.textContent = entry.w;
        chip.addEventListener("click", () => {
          if (chip.disabled) return;
          Codex.audio.sfx.click();
          chip.disabled = true;
          built.push({ w: entry.w, cat: entry.cat, bankBtn: chip });
          refreshBuild();
        });
        bankEl.appendChild(chip);
      });

      actions.querySelector(".clear-btn").addEventListener("click", () => {
        Codex.audio.sfx.click();
        built.forEach((b) => (b.bankBtn.disabled = false));
        built.length = 0;
        refreshBuild();
      });

      actions.querySelector(".validate-btn").addEventListener("click", () => {
        const attempt = built.map((b) => b.w).join(" ");
        const expected = round.solution.join(" ");
        if (attempt === expected) {
          Codex.audio.sfx.good();
          setCoop(cooperation + 20);
          reaction.textContent = round.okReaction;
          Codex.audio.speak(expected);
          actions.querySelector(".validate-btn").disabled = true;
          setTimeout(() => {
            roundIdx += 1;
            if (roundIdx < content.rounds.length) showRound(roundIdx);
            else finish();
          }, 1900);
        } else {
          errors += 1;
          Codex.audio.sfx.error();
          setCoop(cooperation - 10);
          buildZone.classList.add("review-halo");
          setTimeout(() => buildZone.classList.remove("review-halo"), 700);
          if (built.length === round.solution.length) {
            reaction.textContent = Codex.t("echo.npcFrown");
            echo.say(Codex.t("echo.structureWrong"));
          } else {
            reaction.textContent = Codex.t("echo.npcWaits");
            echo.say(Codex.t("echo.incomplete", { n: round.solution.length }));
          }
        }
      });
    }

    function finish() {
      Codex.music.setState("exploration");
      onDone({
        errors,
        hintsUsed: echo.hintsUsed(),
        fragments: 0,
        cultural: 0,
        maxSuspicion: 0,
        cooperation,
        timeSec: Math.round((Date.now() - startTime) / 1000),
      });
    }

    showRound(0);
  }

  Codex.engines.negociation = { mount };

  Codex.router.register("terrain-negociation", (screenEl, params) => {
    mount(screenEl, {
      content: params.mission,
      echoIntro: params.mission.brief.echo,
      onDone: (r) => Codex.flow.completeMission(params.mission, r),
    });
  });
})();
