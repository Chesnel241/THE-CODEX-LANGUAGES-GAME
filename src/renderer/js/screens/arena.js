/**
 * THE CODEX — Arène : Blitz d'Infiltration chronométré (GDD §6.3).
 * Les questions s'enchaînent en continu : bonne réponse = points × combo
 * + bonus de temps ; erreur = pénalité de temps et combo brisé.
 * Meilleur score par langue archivé ; nouveau record = +80 XP (GDD §10.1).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  const START_TIME = 60;   // secondes
  const BONUS = 3;         // +3 s par bonne réponse
  const PENALTY = 5;       // −5 s par erreur
  const BASE_POINTS = 50;

  Codex.router.register("arena", (screenEl) => {
    const st = Codex.state;
    const arc = Codex.arc();
    const best = st.data.arena.best[arc.id] || 0;

    screenEl.appendChild(pageHeader(`${Codex.t("arena.title")} — ${arc.language.flag} ${arc.language.name}`));

    let time = START_TIME;
    let score = 0;
    let combo = 0;
    let answered = 0;
    let correct = 0;
    let running = false;
    let timer = null;
    const next = Codex.quiz.stream();

    const wrap = el(`
      <div class="arena-wrap">
        <div class="arena-hud">
          <div class="arena-stat"><div class="label">${esc(Codex.t("arena.score"))}</div><div class="data arena-score">0</div></div>
          <div class="arena-timer-wrap">
            <div class="arena-timer-bar"><div class="arena-timer-fill"></div></div>
            <div class="data arena-time">${START_TIME}s</div>
          </div>
          <div class="arena-stat"><div class="label">${esc(Codex.t("arena.combo"))}</div><div class="data arena-combo">×1</div></div>
          <div class="arena-stat"><div class="label">${esc(Codex.t("arena.best"))}</div><div class="data amber">${best}</div></div>
        </div>
        <div class="arena-zone"></div>
      </div>`);
    screenEl.appendChild(wrap);

    const zone = wrap.querySelector(".arena-zone");
    const scoreEl = wrap.querySelector(".arena-score");
    const comboEl = wrap.querySelector(".arena-combo");
    const timeEl = wrap.querySelector(".arena-time");
    const fillEl = wrap.querySelector(".arena-timer-fill");

    function renderHud() {
      scoreEl.textContent = String(score);
      comboEl.textContent = `×${1 + Math.floor(combo / 3)}`;
      timeEl.textContent = `${Math.max(0, Math.ceil(time))}s`;
      fillEl.style.width = `${Math.max(0, Math.min(100, (time / START_TIME) * 100))}%`;
      fillEl.style.background = time > 20 ? "var(--accent-green)" : time > 10 ? "var(--accent-amber)" : "var(--accent-red)";
    }

    function intro() {
      zone.innerHTML = "";
      zone.appendChild(el(`
        <div class="center" style="margin:auto; max-width:480px">
          <div style="font-size:46px">⚡</div>
          <div class="h1 mt-1" style="font-size:28px">${esc(Codex.t("arena.title"))}</div>
          <div class="muted mt-2">${esc(Codex.t("arena.rules", { t: START_TIME, b: BONUS, p: PENALTY }))}</div>
          <button class="btn mt-3">${esc(Codex.t("arena.start"))}</button>
        </div>`));
      zone.querySelector(".btn").addEventListener("click", start);
    }

    function start() {
      Codex.audio.sfx.scanner();
      Codex.music.play(arc.theme, "tension");
      running = true;
      time = START_TIME;
      score = 0; combo = 0; answered = 0; correct = 0;
      renderHud();
      timer = setInterval(() => {
        if (!running) return;
        time -= 0.25;
        if (time <= 10 && time > 0 && Math.abs(time - Math.round(time)) < 0.13) Codex.audio.sfx.heartbeat();
        if (time <= 15) Codex.music.setState("climax");
        else if (time <= 30) Codex.music.setState("tension");
        renderHud();
        if (time <= 0) finish();
      }, 250);
      question();
    }

    function question() {
      if (!running) return;
      const q = next();
      if (!q) return finish();
      zone.innerHTML = "";
      const card = el(`
        <div class="arena-q">
          <div class="mb-2" style="font-weight:600; font-size:17px"></div>
          <div class="choices"></div>
        </div>`);
      card.querySelector("div").textContent = q.q;
      const choices = card.querySelector(".choices");
      let resolved = false;
      q.options.forEach((opt) => {
        const btn = el(`<button class="choice-btn"></button>`);
        btn.textContent = opt.t;
        btn.addEventListener("click", () => {
          if (resolved || !running) return;
          resolved = true;
          answered += 1;
          if (q.vaultId) st.markReviewed(q.vaultId);
          if (opt.ok) {
            correct += 1;
            combo += 1;
            const mult = 1 + Math.floor(combo / 3);
            score += BASE_POINTS * mult;
            time = Math.min(99, time + BONUS);
            btn.classList.add("good");
            Codex.audio.sfx.good();
          } else {
            combo = 0;
            time -= PENALTY;
            btn.classList.add("bad");
            choices.querySelectorAll(".choice-btn").forEach((b, bi) => { if (q.options[bi].ok) b.classList.add("good"); });
            Codex.audio.sfx.error();
          }
          renderHud();
          if (time <= 0) return finish();
          setTimeout(question, opt.ok ? 280 : 650);
        });
        choices.appendChild(btn);
      });
      zone.appendChild(card);
    }

    function finish() {
      if (!running) return;
      running = false;
      clearInterval(timer);
      Codex.music.stop(0.5);
      Codex.music.sting(arc.theme);

      const prevBest = st.data.arena.best[arc.id] || 0;
      const newBest = score > prevBest;
      st.data.arena.best[arc.id] = Math.max(prevBest, score);
      st.data.arena.plays += 1;
      let xp = 0;
      if (newBest && score > 0) {
        xp = 80; // GDD §10.1 — victoire d'Arène
        st.addXp(xp);
      }
      st.save();

      const acc = answered ? Math.round((correct / answered) * 100) : 0;
      zone.innerHTML = "";
      zone.appendChild(el(`
        <div class="center" style="margin:auto; max-width:480px">
          <div style="font-size:46px">${newBest ? "🏆" : "⚡"}</div>
          <div class="h1 mt-1" style="font-size:30px">${score}</div>
          ${newBest ? `<div class="amber mt-1" style="font-weight:700">${esc(Codex.t("arena.newBest"))}</div>` : ""}
          ${xp ? `<div class="xp-gain mt-1">+${xp} XP</div>` : ""}
          <div class="muted mt-2">${esc(Codex.t("arena.stats", { n: answered, acc }))}</div>
          <div class="row mt-3" style="justify-content:center">
            <button class="btn replay">${esc(Codex.t("arena.replay"))}</button>
            <button class="btn btn-muted back">${esc(Codex.t("debrief.returnHq"))}</button>
          </div>
        </div>`));
      zone.querySelector(".replay").addEventListener("click", () => { Codex.audio.sfx.click(); Codex.router.go("arena"); });
      zone.querySelector(".back").addEventListener("click", () => { Codex.audio.sfx.click(); Codex.router.go("hq"); });
      if (newBest) Codex.audio.sfx.fanfare();
    }

    intro();
  });
})();
