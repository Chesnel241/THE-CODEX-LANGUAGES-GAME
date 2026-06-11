/**
 * THE CODEX — Recrutement de l'agent (onboarding).
 * Étape 1 : langue opérationnelle (L1, langue de l'interface et des briefings)
 * Étape 2 : théâtre d'opérations (L2, la langue à maîtriser)
 * Étape 3 : nom de code → activation du dossier.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  const L1_CHOICES = [
    { id: "fr", flagCode: "fr", name: "Français", sub: "Je parle français" },
    { id: "en", flagCode: "gb", name: "English", sub: "I speak English" },
  ];

  // Théâtres verrouillés affichés en teaser (GDD §3.2)
  const TEASERS = [
    { flagCode: "jp", name: "日本語" }, { flagCode: "cn", name: "中文" }, { flagCode: "sa", name: "العربية" },
  ];

  Codex.router.register("onboarding", (screenEl) => {
    let l1 = null;
    let l2 = null;

    const wrap = el(`<div class="onb-wrap"></div>`);
    screenEl.appendChild(wrap);

    function step1() {
      wrap.innerHTML = "";
      const step = el(`
        <div class="onb-step">
          <div class="tag-classified">TRANSMISSION ENTRANTE · INCOMING TRANSMISSION</div>
          <div class="h1 mt-3" style="font-size:30px">Agent, identifiez votre langue.<br>Agent, identify your language.</div>
          <div class="muted mt-1">La langue dans laquelle l'Institut communiquera avec vous.<br>The language the Institute will use to communicate with you.</div>
          <div class="lang-cards"></div>
        </div>`);
      const cards = step.querySelector(".lang-cards");
      L1_CHOICES.forEach((c) => {
        const card = el(`
          <div class="lang-card" role="button" tabindex="0">
            <span class="lang-card-flag"></span>
            <div class="name">${esc(c.name)}</div>
            <div class="sub">${esc(c.sub)}</div>
          </div>`);
        card.querySelector(".lang-card-flag").appendChild(Codex.ui.flag(c.flagCode, { w: 52 }));
        const pick = () => {
          Codex.audio.sfx.stamp();
          l1 = c.id;
          Codex.i18n.set(l1);
          step2();
        };
        card.addEventListener("click", pick);
        card.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
        cards.appendChild(card);
      });
      wrap.appendChild(step);
    }

    function step2() {
      wrap.innerHTML = "";
      const step = el(`
        <div class="onb-step">
          <div class="tag-classified">${esc(Codex.t("onb.step", { n: 2 }))}</div>
          <div class="h1 mt-3" style="font-size:30px">${esc(Codex.t("onb.q2"))}</div>
          <div class="muted mt-1">${esc(Codex.t("onb.q2sub"))}</div>
          <div class="lang-cards"></div>
        </div>`);
      const cards = step.querySelector(".lang-cards");

      // Théâtres jouables : arcs dont la narration existe dans la L1 du joueur
      Codex.arcsFor(l1)
        .forEach((arc) => {
          const card = el(`
            <div class="lang-card" role="button" tabindex="0">
              <span class="lang-card-flag"></span>
              <div class="name">${esc(arc.language.name)}</div>
              <div class="sub">${esc(arc.zone.name)} — ${esc(arc.missions.length)} missions</div>
            </div>`);
          card.querySelector(".lang-card-flag").appendChild(Codex.ui.flag(arc.id, { w: 52 }));
          const pick = () => {
            Codex.audio.sfx.stamp();
            l2 = arc.id;
            step3();
          };
          card.addEventListener("click", pick);
          card.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
          cards.appendChild(card);
        });

      TEASERS.forEach((tz) => {
        const card = el(`
          <div class="lang-card locked">
            <span class="lang-card-flag"></span>
            <div class="name">${esc(tz.name)}</div>
            <div class="sub">🔒 ${esc(Codex.t("onb.phase3"))}</div>
          </div>`);
        card.querySelector(".lang-card-flag").appendChild(Codex.ui.flag(tz.flagCode, { w: 52 }));
        cards.appendChild(card);
      });

      wrap.appendChild(step);
    }

    function step3() {
      wrap.innerHTML = "";
      const step = el(`
        <div class="onb-step">
          <div class="tag-classified">${esc(Codex.t("onb.step", { n: 3 }))}</div>
          <div class="h1 mt-3" style="font-size:30px">${esc(Codex.t("onb.q3"))}</div>
          <div class="muted mt-1">${esc(Codex.t("onb.q3sub"))}</div>
          <div><input class="onb-input" maxlength="24" placeholder="${esc(Codex.t("onb.codenamePh"))}" /></div>
          <button class="btn mt-3">${esc(Codex.t("onb.activate"))}</button>
        </div>`);
      const input = step.querySelector("input");
      const activate = () => {
        const name = (input.value.trim() || Codex.t("onb.codenamePh")).toUpperCase().slice(0, 24);
        Codex.state.data.agent.codeName = name;
        Codex.state.setLanguages(l1, l2);
        Codex.audio.sfx.vaultOpen();
        setTimeout(() => Codex.router.go("hq"), 600);
      };
      step.querySelector(".btn").addEventListener("click", activate);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") activate(); });
      wrap.appendChild(step);
      input.focus();
    }

    step1();
  });
})();
