/**
 * THE CODEX — Coffre-Fort / Vault (GDD §7.9, §6.4).
 * Collection d'intel + halo ambre sur les fiches à réviser (répétition
 * espacée cachée) + Challenge de Révision.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  const KIND_LABELS = {
    verb: { title: "Verbes craqués", icon: "🔓" },
    vocab: { title: "Vocabulaire actif", icon: "💬" },
    grammar: { title: "Grammaire opérationnelle", icon: "📐" },
    cultural: { title: "Cultural Intel", icon: "🌍" },
  };

  Codex.router.register("vault", (screenEl) => {
    const st = Codex.state;
    screenEl.appendChild(pageHeader("🗄️ Coffre-Fort — Intel personnelle"));
    Codex.audio.sfx.pageTurn();

    const scroll = el(`<div class="screen-scroll"></div>`);

    if (st.data.vault.length === 0) {
      scroll.appendChild(el(`
        <div class="vault-empty">
          <div style="font-size:44px">🗄️</div>
          <div class="h2 mt-2">Coffre-Fort vide</div>
          <div class="mt-1">Chaque mission complétée y dépose son intel.<br>Commencez par l'Opération FLAVOUR, Agent.</div>
        </div>`));
      screenEl.appendChild(scroll);
      return;
    }

    // Bandeau Challenge de Révision
    const toReview = st.data.vault.filter((v) => st.needsReview(v)).length;
    const banner = el(`
      <div class="vault-cat-title">
        <div class="card spread">
          <div>
            <div style="font-weight:700">Challenge de Révision</div>
            <div class="small muted">${toReview > 0
              ? `${toReview} fiche(s) mériteraient d'être remises à l'épreuve.`
              : "Toute votre intel est fraîche. Revenez demain."}</div>
          </div>
          <button class="btn btn-ghost">LANCER (10 QUESTIONS)</button>
        </div>
      </div>`);
    banner.querySelector(".btn").addEventListener("click", () => {
      Codex.audio.sfx.daily();
      Codex.router.go("daily", { mode: "challenge" });
    });
    scroll.appendChild(banner);

    for (const kind of Object.keys(KIND_LABELS)) {
      const items = st.vaultByKind(kind);
      if (items.length === 0) continue;
      const meta = KIND_LABELS[kind];
      scroll.appendChild(el(`<div class="vault-cat-title"><div class="label">${esc(meta.icon)} ${esc(meta.title)} — ${items.length}</div></div>`));

      const grid = el(`<div class="vault-grid"></div>`);
      items.forEach((item) => {
        const needs = st.needsReview(item);
        const card = el(`
          <div class="card card-hover ${needs ? "review-halo" : ""}">
            <div class="vault-item-lemma">${esc(item.title)}</div>
            <div class="small muted">${esc(item.subtitle || "")}</div>
            <div class="small muted mt-1">Vu ${item.timesReviewed} fois${needs ? ' · <span class="amber">à réviser</span>' : ""}</div>
          </div>`);
        if (kind === "cultural") {
          card.addEventListener("click", () => {
            Codex.audio.sfx.cultural();
            st.markReviewed(item.id);
            const popup = el(`
              <div class="fragment-popup" style="border-color: var(--accent-amber)">
                <div class="fragment-popup-head"><span class="label amber">🌍 CULTURAL INTEL</span></div>
                <div class="fragment-section">
                  <div class="h2 mb-1">${esc(item.title)}</div>
                  <div>${esc(item.data.text)}</div>
                </div>
                <div class="fragment-footer"><button class="btn">FERMER</button></div>
              </div>`);
            const m = Codex.ui.modal(popup);
            popup.querySelector(".btn").addEventListener("click", m.close);
          });
        } else {
          card.addEventListener("click", () => {
            Codex.audio.sfx.click();
            Codex.router.go("intel-view", { item });
          });
        }
        grid.appendChild(card);
      });
      scroll.appendChild(grid);
    }

    screenEl.appendChild(scroll);
  });
})();
