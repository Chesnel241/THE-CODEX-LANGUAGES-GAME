/**
 * THE CODEX — Daily Agent Signal & Challenge de Révision (GDD §6.2, §6.4, §7.12).
 * Quick Scan : questions générées depuis le Coffre-Fort du joueur
 * (répétition espacée déguisée), banque de secours de l'arc sinon.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** 3 options dont la première est correcte → tableau mélangé { t, ok }. */
  function shuffle3(correct, wrong1, wrong2) {
    return shuffle([
      { t: correct, ok: true },
      { t: wrong1, ok: false },
      { t: wrong2, ok: false },
    ]);
  }

  /** Génère des questions depuis le Coffre-Fort de la langue active. */
  function questionsFromVault(count) {
    const st = Codex.state;
    const qs = [];

    for (const item of st.vaultItems()) {
      const d = item.data;
      // Quiz pré-écrits sur les cartes (verbes & grammaire)
      if (Array.isArray(d.quiz)) {
        for (const q of d.quiz) {
          qs.push({
            q: q.q,
            options: q.options.map((t, i) => ({ t, ok: i === q.a })),
            vaultId: item.id,
          });
        }
      }
      // Vocab : associer une expression à sa note d'usage
      if (item.kind === "vocab" && d.entries && d.entries.length >= 3) {
        const entry = d.entries[Math.floor(Math.random() * d.entries.length)];
        const others = shuffle(d.entries.filter((e) => e !== entry)).map((e) => e.en);
        qs.push({
          q: `« ${entry.note} »`,
          options: shuffle3(entry.en, others[0], others[1]),
          vaultId: item.id,
        });
      }
    }

    // Mélange et complète avec la banque de secours de l'arc
    const picked = shuffle(qs).slice(0, count);
    if (picked.length < count) {
      for (const fb of shuffle(Codex.arc().dailyFallback)) {
        if (picked.length >= count) break;
        picked.push({ q: fb.q, options: fb.options.map((t, i) => ({ t, ok: i === fb.correct })) });
      }
    }
    return picked;
  }

  Codex.router.register("daily", (screenEl, params = {}) => {
    const st = Codex.state;
    const isChallenge = params.mode === "challenge";
    const total = isChallenge ? 10 : 5;

    // Garde : Daily déjà complété aujourd'hui
    if (!isChallenge && !st.dailyAvailable()) {
      Codex.router.go("hq");
      return;
    }

    const questions = questionsFromVault(total);
    let idx = 0;
    let correct = 0;

    const card = el(`
      <div class="daily-card">
        <div class="daily-img">📻</div>
        <div class="fragment-section">
          <div class="spread">
            <span class="label purple">${esc(isChallenge ? Codex.t("daily.challenge") : Codex.t("daily.signal"))}</span>
            <span class="quiz-progress"></span>
          </div>
          <div class="small muted mt-1">${esc(isChallenge
            ? Codex.t("daily.challengeSub")
            : Codex.t("daily.day", { n: st.data.daily.count + 1, q: total }))}</div>
        </div>
        <div class="quiz-zone fragment-section" style="border:none"></div>
      </div>`);

    const progress = card.querySelector(".quiz-progress");
    for (let i = 0; i < questions.length; i++) progress.appendChild(el(`<span></span>`));
    const dots = progress.querySelectorAll("span");
    const zone = card.querySelector(".quiz-zone");

    function showQuestion() {
      zone.innerHTML = "";
      const q = questions[idx];
      zone.appendChild(el(`<div class="mb-2" style="font-weight:600">${esc(q.q)}</div>`));
      const choices = el(`<div class="choices"></div>`);
      let resolved = false;
      q.options.forEach((opt) => {
        const btn = el(`<button class="choice-btn"></button>`);
        btn.textContent = opt.t;
        btn.addEventListener("click", () => {
          if (resolved) return;
          resolved = true;
          if (opt.ok) {
            btn.classList.add("good");
            Codex.audio.sfx.good();
            correct += 1;
            dots[idx].classList.add("done-ok");
          } else {
            btn.classList.add("bad");
            Codex.audio.sfx.error();
            dots[idx].classList.add("done-ko");
            choices.querySelectorAll(".choice-btn").forEach((b, bi) => {
              if (q.options[bi].ok) b.classList.add("good");
            });
          }
          if (q.vaultId) st.markReviewed(q.vaultId);
          choices.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
          setTimeout(() => {
            idx += 1;
            if (idx < questions.length) showQuestion();
            else finish();
          }, 1100);
        });
        choices.appendChild(btn);
      });
      zone.appendChild(choices);
    }

    function finish() {
      zone.innerHTML = "";
      const pct = Math.round((correct / questions.length) * 100);
      let xp = 0;
      if (!isChallenge) {
        xp = 50; // GDD §10.1 : Daily Signal complété = 50 XP
        st.completeDaily();
        st.addXp(xp);
      }
      Codex.audio.sfx.fanfare();
      zone.appendChild(el(`
        <div class="center">
          <div style="font-size:40px">${pct >= 80 ? "🏅" : pct >= 50 ? "✅" : "📡"}</div>
          <div class="h2 mt-1">${correct}/${questions.length} — ${pct}%</div>
          ${xp ? `<div class="xp-gain mt-1">+${xp} XP</div>` : ""}
          <div class="small muted mt-1">${esc(pct >= 80 ? Codex.t("daily.perfect") : Codex.t("daily.meh"))}</div>
          <button class="btn mt-3">${esc(Codex.t("daily.return"))}</button>
        </div>`));
      zone.querySelector(".btn").addEventListener("click", () => {
        Codex.audio.sfx.click();
        Codex.router.go("hq");
      });
    }

    Codex.audio.sfx.daily();
    showQuestion();
    screenEl.appendChild(card);
  });
})();
