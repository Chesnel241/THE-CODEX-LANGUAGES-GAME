/**
 * THE CODEX — Carte Intel, la révélation (GDD §7.7) + Flashback (GDD §9.2).
 * Affichée après mission (puis flow → debrief) ou depuis le Coffre-Fort.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  /** Construit le nœud DOM d'une carte intel (verbe, vocab ou grammaire). */
  function buildCard(card, { headline, sub = "" } = {}) {
    const node = el(`
      <div class="intel-card">
        <div class="intel-card-head">
          <div class="label purple">${esc(headline || Codex.t("intel.declassified"))}</div>
          ${sub ? `<div class="small muted mt-1">${esc(sub)}</div>` : ""}
        </div>
        <div class="intel-lemma">${esc(card.lemma)}</div>
        <div class="intel-phon">${esc(card.phonetics)}</div>
        <div class="intel-tag"><span class="tag-classified">${esc(card.tag)}</span></div>
      </div>`);

    if (card.table) {
      const grid = el(`<div class="intel-grid"></div>`);
      card.table.forEach((cell) => {
        const c = el(`<div class="intel-cell"><div class="label">${esc(cell.label)}</div><div class="cell-val"></div></div>`);
        c.querySelector(".cell-val").textContent = cell.value;
        grid.appendChild(c);
      });
      node.appendChild(grid);
    }

    if (card.entries) {
      card.entries.forEach((entry) => {
        node.appendChild(el(`
          <div class="vocab-entry">
            <div class="vocab-en">${esc(entry.en)}</div>
            <div class="vocab-note">${esc(entry.note)}</div>
          </div>`));
      });
    }

    if (card.examples && card.examples.length) {
      const ex = el(`<div class="intel-examples"><div class="label mb-1">${esc(Codex.t("intel.examples"))}</div></div>`);
      card.examples.forEach((e) => ex.appendChild(el(`<div class="mono cyan">· ${esc(e)}</div>`)));
      node.appendChild(ex);
    }

    const actions = el(`<div class="intel-actions"></div>`);
    const listenBtn = el(`<button class="btn btn-ghost">${esc(Codex.t("intel.listen"))}</button>`);
    listenBtn.addEventListener("click", () => {
      Codex.audio.sfx.click();
      Codex.audio.speak(card.speakText || card.lemma);
    });
    actions.appendChild(listenBtn);

    // Flashback — ancrage émotionnel (GDD §9.2)
    if (card.flashback) {
      const fbBtn = el(`<button class="btn btn-muted">${esc(Codex.t("intel.flashback"))}</button>`);
      fbBtn.addEventListener("click", () => {
        Codex.audio.sfx.pageTurn();
        const popup = el(`
          <div class="fragment-popup" style="border-color: var(--accent-purple)">
            <div class="fragment-popup-head"><span class="label purple">${esc(Codex.t("intel.flashTitle"))}</span></div>
            <div class="fragment-section fragment-scene">${esc(card.flashback)}</div>
            <div class="fragment-footer">
              <button class="btn btn-ghost listen">${esc(Codex.t("intel.listen"))}</button>
              <button class="btn close">${esc(Codex.t("vault.close"))}</button>
            </div>
          </div>`);
        const m = Codex.ui.modal(popup);
        popup.querySelector(".listen").addEventListener("click", () => Codex.audio.speak(card.speakText || card.lemma));
        popup.querySelector(".close").addEventListener("click", m.close);
      });
      actions.appendChild(fbBtn);
    }

    node.appendChild(actions);
    return { node, actions };
  }

  Codex.intelCard = { buildCard };

  /** Écran post-mission : carte + bouton vers le debriefing. */
  Codex.router.register("intel", (screenEl, { mission, result }) => {
    screenEl.classList.add("intel-screen");
    Codex.music.stop(0.5);
    Codex.audio.sfx.vaultOpen();
    setTimeout(() => Codex.music.sting(Codex.arc().theme), 700);

    const card = mission.intelCard;
    const fragCount = mission.fragments ? mission.fragments.length : null;
    const { node, actions } = buildCard(card, {
      sub: fragCount ? Codex.t("intel.cracked", { n: fragCount }) : Codex.t("intel.secured"),
    });

    const doneBtn = el(`<button class="btn">${esc(Codex.t("intel.done"))}</button>`);
    doneBtn.addEventListener("click", () => {
      Codex.audio.sfx.fanfare();
      Codex.router.go("debrief", { mission, result });
    });
    actions.appendChild(doneBtn);

    // Contrôle radio : lire l'intel à voix haute (bonus XP, facultatif)
    if (Codex.voice && Codex.voice.supported()) {
      const phrase = (card.examples && card.examples[0]) || card.speakText || card.lemma;
      const radio = el(`
        <div class="radio-check">
          <div class="spread">
            <span class="label purple">${esc(Codex.t("intel.radio"))}</span>
            <span class="small muted">+15 XP</span>
          </div>
          <div class="small muted mt-1">${esc(Codex.t("intel.radioSub"))}</div>
          <div class="mono cyan mt-1 radio-phrase"></div>
          <div class="studio-meter mt-1"><i></i></div>
          <div class="row mt-1" style="gap:8px">
            <button class="btn btn-ghost radio-speak"></button>
            <span class="small radio-verdict"></span>
          </div>
        </div>`);
      radio.querySelector(".radio-phrase").textContent = phrase;
      const speakBtn = radio.querySelector(".radio-speak");
      const verdict = radio.querySelector(".radio-verdict");
      const meterFill = radio.querySelector(".studio-meter i");
      speakBtn.appendChild(Codex.ui.icon("mic", { size: 15 }));
      speakBtn.appendChild(document.createTextNode(" " + Codex.t("studio.speak")));
      let bonusGiven = false;
      speakBtn.addEventListener("click", async () => {
        Codex.audio.sfx.click();
        speakBtn.disabled = true;
        verdict.textContent = Codex.t("studio.recording");
        verdict.className = "small radio-verdict purple";
        const take = await Codex.voice.record({
          onLevel: (v) => { meterFill.style.width = `${Math.round(v * 100)}%`; },
        });
        meterFill.style.width = "0%";
        speakBtn.disabled = false;
        if (take.error) {
          verdict.textContent = Codex.t("studio.micDenied");
          verdict.className = "small radio-verdict amber";
          return;
        }
        const lang = (Codex.arc().language.tts || "en").slice(0, 2);
        const g = Codex.voice.grade(take.envelope, phrase, lang);
        if (g.score >= 65) {
          verdict.textContent = `${g.score}/100 — ${Codex.t("intel.radioOk")}`;
          verdict.className = "small radio-verdict green";
          Codex.audio.sfx.good();
          if (!bonusGiven) {
            bonusGiven = true;
            Codex.state.addXp(15);
            Codex.ui.toast(Codex.t("intel.radioOk"), "📡");
          }
          speakBtn.disabled = true;
        } else {
          verdict.textContent = `${g.score}/100 — ${Codex.t("intel.radioRetry")}`;
          verdict.className = "small radio-verdict amber";
          Codex.audio.sfx.error();
        }
      });
      node.insertBefore(radio, actions);
    }

    const scroll = el(`<div class="screen-scroll" style="display:flex; justify-content:center"></div>`);
    scroll.appendChild(node);
    screenEl.appendChild(scroll);
  });

  /** Écran consultation depuis le Coffre-Fort. */
  Codex.router.register("intel-view", (screenEl, { item }) => {
    screenEl.appendChild(Codex.ui.pageHeader(Codex.t("intel.title"), "vault"));
    Codex.state.markReviewed(item.id);
    Codex.audio.sfx.pageTurn();

    const locale = Codex.i18n.get() === "fr" ? "fr-FR" : "en-GB";
    const { node } = buildCard(item.data, {
      headline: Codex.t("intel.archive"),
      sub: Codex.t("intel.acquired", {
        date: new Date(item.acquiredAt).toLocaleDateString(locale),
        n: item.timesReviewed + 1,
      }),
    });
    const scroll = el(`<div class="screen-scroll" style="display:flex; justify-content:center"></div>`);
    scroll.appendChild(node);
    screenEl.appendChild(scroll);
  });
})();
