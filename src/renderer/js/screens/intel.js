/**
 * THE CODEX — Carte Intel, la révélation (GDD §7.7).
 * Affichée après mission (puis flow → debrief) ou depuis le Coffre-Fort.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  /** Construit le nœud DOM d'une carte intel (verbe, vocab ou grammaire). */
  function buildCard(card, { headline = "💡 INTEL DÉCLASSIFIÉE", sub = "" } = {}) {
    const node = el(`
      <div class="intel-card">
        <div class="intel-card-head">
          <div class="label purple">${esc(headline)}</div>
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
      const ex = el(`<div class="intel-examples"><div class="label mb-1">💡 EXEMPLES CONTEXTUELS</div></div>`);
      card.examples.forEach((e) => ex.appendChild(el(`<div class="mono cyan">· ${esc(e)}</div>`)));
      node.appendChild(ex);
    }

    const actions = el(`<div class="intel-actions"></div>`);
    const listenBtn = el(`<button class="btn btn-ghost">🔊 ÉCOUTER LA PRONONCIATION</button>`);
    listenBtn.addEventListener("click", () => {
      Codex.audio.sfx.click();
      Codex.audio.speak(card.speakText || card.lemma);
    });
    actions.appendChild(listenBtn);
    node.appendChild(actions);
    return { node, actions };
  }

  Codex.intelCard = { buildCard };

  /** Écran post-mission : carte + bouton vers le debriefing. */
  Codex.router.register("intel", (screenEl, { mission, result }) => {
    screenEl.classList.add("intel-screen");
    Codex.audio.sfx.vaultOpen();

    const card = mission.intelCard;
    const fragCount = mission.fragments ? mission.fragments.length : null;
    const { node, actions } = buildCard(card, {
      headline: "💡 INTEL DÉCLASSIFIÉE",
      sub: fragCount ? `${fragCount}/${fragCount} FRAGMENTS · INTEL CRAQUÉE` : "OBJECTIF LINGUISTIQUE SÉCURISÉ",
    });

    const doneBtn = el(`<button class="btn">MISSION ACCOMPLIE →</button>`);
    doneBtn.addEventListener("click", () => {
      Codex.audio.sfx.fanfare();
      Codex.router.go("debrief", { mission, result });
    });
    actions.appendChild(doneBtn);

    const scroll = el(`<div class="screen-scroll" style="display:flex; justify-content:center"></div>`);
    scroll.appendChild(node);
    screenEl.appendChild(scroll);
  });

  /** Écran consultation depuis le Coffre-Fort. */
  Codex.router.register("intel-view", (screenEl, { item }) => {
    screenEl.appendChild(Codex.ui.pageHeader("Fiche Intel", "vault"));
    Codex.state.markReviewed(item.id);
    Codex.audio.sfx.pageTurn();

    const { node } = buildCard(item.data, {
      headline: "🗄️ ARCHIVE DU COFFRE-FORT",
      sub: `Acquis le ${new Date(item.acquiredAt).toLocaleDateString("fr-FR")} · consulté ${item.timesReviewed + 1} fois`,
    });
    const scroll = el(`<div class="screen-scroll" style="display:flex; justify-content:center"></div>`);
    scroll.appendChild(node);
    screenEl.appendChild(scroll);
  });
})();
