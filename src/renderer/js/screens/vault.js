/**
 * THE CODEX — Coffre-Fort / Vault (GDD §7.9, §6.4).
 * Collection d'intel de la langue active + halo ambre sur les fiches à
 * réviser (répétition espacée cachée) + Challenge de Révision.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  const KINDS = [
    { kind: "verb", icon: "🔓", key: "vault.verbs" },
    { kind: "vocab", icon: "💬", key: "vault.vocab" },
    { kind: "grammar", icon: "📐", key: "vault.grammar" },
    { kind: "cultural", icon: "🌍", key: "vault.cultural" },
  ];

  Codex.router.register("vault", (screenEl) => {
    const st = Codex.state;
    const arc = Codex.arc();
    screenEl.appendChild(pageHeader(`${Codex.t("vault.title")} — ${arc.language.flag} ${arc.language.name}`));
    Codex.audio.sfx.pageTurn();

    const scroll = el(`<div class="screen-scroll"></div>`);
    const items = st.vaultItems();

    if (items.length === 0) {
      scroll.appendChild(el(`
        <div class="vault-empty">
          <div style="font-size:44px">🗄️</div>
          <div class="h2 mt-2">${esc(Codex.t("vault.empty"))}</div>
          <div class="mt-1">${esc(Codex.t("vault.emptySub"))}</div>
        </div>`));
      screenEl.appendChild(scroll);
      return;
    }

    // Bandeau Challenge de Révision
    const toReview = items.filter((v) => st.needsReview(v)).length;
    const banner = el(`
      <div class="vault-cat-title">
        <div class="card spread">
          <div>
            <div style="font-weight:700">${esc(Codex.t("vault.challenge"))}</div>
            <div class="small muted">${esc(toReview > 0 ? Codex.t("vault.challengeSub", { n: toReview }) : Codex.t("vault.challengeFresh"))}</div>
          </div>
          <button class="btn btn-ghost">${esc(Codex.t("vault.launch"))}</button>
        </div>
      </div>`);
    banner.querySelector(".btn").addEventListener("click", () => {
      Codex.audio.sfx.daily();
      Codex.router.go("daily", { mode: "challenge" });
    });
    scroll.appendChild(banner);

    for (const meta of KINDS) {
      const kindItems = items.filter((v) => v.kind === meta.kind);
      if (kindItems.length === 0) continue;
      scroll.appendChild(el(`<div class="vault-cat-title"><div class="label">${esc(meta.icon)} ${esc(Codex.t(meta.key))} — ${kindItems.length}</div></div>`));

      const grid = el(`<div class="vault-grid"></div>`);
      kindItems.forEach((item) => {
        const needs = st.needsReview(item);
        const card = el(`
          <div class="card card-hover ${needs ? "review-halo" : ""}">
            <div class="vault-item-lemma">${esc(item.title)}</div>
            <div class="small muted">${esc(item.subtitle || "")}</div>
            <div class="small muted mt-1">${esc(Codex.t("vault.seen", { n: item.timesReviewed }))}${needs ? ` · <span class="amber">${esc(Codex.t("vault.toReview"))}</span>` : ""}</div>
          </div>`);
        if (needs) {
          // ré-injecte le HTML car esc a neutralisé le span
          card.querySelector(".small.muted.mt-1").innerHTML =
            `${esc(Codex.t("vault.seen", { n: item.timesReviewed }))} · <span class="amber">${esc(Codex.t("vault.toReview"))}</span>`;
        }
        if (meta.kind === "cultural") {
          card.addEventListener("click", () => {
            Codex.audio.sfx.cultural();
            st.markReviewed(item.id);
            const popup = el(`
              <div class="fragment-popup" style="border-color: var(--accent-amber)">
                <div class="fragment-popup-head"><span class="label amber">${esc(Codex.t("terrain.cultural"))}</span></div>
                <div class="fragment-section">
                  <div class="h2 mb-1">${esc(item.title)}</div>
                  <div>${esc(item.data.text)}</div>
                </div>
                <div class="fragment-footer"><button class="btn">${esc(Codex.t("vault.close"))}</button></div>
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
