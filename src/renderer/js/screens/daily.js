/**
 * THE CODEX — Daily Agent Signal & Challenge de Révision (GDD §6.2, §6.4, §7.12).
 * Quick Scan : questions générées depuis le Coffre-Fort du joueur
 * (répétition espacée déguisée), banque de secours de l'arc sinon.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc } = Codex.ui;

  Codex.router.register("daily", (screenEl, params = {}) => {
    const st = Codex.state;
    const isChallenge = params.mode === "challenge";
    const total = isChallenge ? 10 : 5;

    // Garde : Daily déjà complété aujourd'hui
    if (!isChallenge && !st.dailyAvailable()) {
      Codex.router.go("hq");
      return;
    }

    const questions = Codex.quiz.generate(total);
    let idx = 0;
    let correct = 0;

    const card = el(`
      <div class="daily-card">
        <div class="daily-img"></div>
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

    // Radar animé (Lottie) — repli emoji si indisponible
    const img = card.querySelector(".daily-img");
    if (!Codex.fx.lottie(img, "radar", { loop: true })) img.textContent = "📻";

    Codex.audio.sfx.daily();
    showQuestion();
    screenEl.appendChild(card);
  });
})();
