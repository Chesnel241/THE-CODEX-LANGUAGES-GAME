/**
 * THE CODEX — Examen Blanc (mission spéciale type certification).
 * Banque de sujets par langue (Codex.EXAMS) : TOEIC blanc (anglais),
 * TCF blanc (français), DELE blanco (espagnol), Goethe blanko (allemand).
 * Conditions d'examen : chrono, pas de feedback immédiat, écoute TTS
 * limitée à 2 par question ; corrections détaillées à la fin.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, icon, pageHeader } = Codex.ui;

  function R(x) {
    if (x && typeof x === "object" && !Array.isArray(x)) return x[Codex.i18n.get()] ?? x.fr ?? x.en;
    return x;
  }

  function flatQuestions(exam) {
    const out = [];
    for (const s of exam.sections) {
      s.questions.forEach((q, i) => out.push({ ...q, section: s, si: i }));
    }
    return out;
  }

  function cefr(pct) {
    if (pct >= 85) return "B2";
    if (pct >= 70) return "B1+";
    if (pct >= 55) return "B1";
    if (pct >= 40) return "A2";
    return "A1";
  }

  Codex.router.register("exam", (screenEl) => {
    const arc = Codex.arc();
    const exam = Codex.EXAMS[arc.id];
    if (!exam) { Codex.router.go("hq"); return; }
    const questions = flatQuestions(exam);
    const answers = new Array(questions.length).fill(null);
    let idx = 0;
    let timeLeft = exam.durationMin * 60;
    let timer = 0;
    let finished = false;

    Codex.music.play(arc.theme, "tension");
    Codex.ui.fxLayers(screenEl);
    screenEl.appendChild(pageHeader(exam.name, "hq", { flagCode: arc.id }));

    const wrap = el(`<div class="screen-scroll"><div class="exam-wrap"></div></div>`);
    const box = wrap.querySelector(".exam-wrap");
    screenEl.appendChild(wrap);

    // ----- Intro -----
    function showIntro() {
      box.innerHTML = "";
      const card = el(`
        <div class="card exam-intro">
          <div class="label amber mb-1">${esc(Codex.t("exam.label"))}</div>
          <div class="h1">${esc(exam.name)}</div>
          <div class="small muted mt-1">${esc(R(exam.style))}</div>
          <div class="row mt-2 small">
            <span class="data">${esc(Codex.t("exam.questions", { n: questions.length }))}</span>
            <span class="muted">·</span>
            <span class="data">${esc(Codex.t("exam.duration", { n: exam.durationMin }))}</span>
          </div>
          <div class="exam-sections mt-2"></div>
          <button class="btn mt-3" style="width:100%">${esc(Codex.t("exam.start"))}</button>
        </div>`);
      const secEl = card.querySelector(".exam-sections");
      for (const s of exam.sections) {
        secEl.appendChild(el(`<div class="small"><span class="cyan">▸</span> ${esc(R(s.name))} — <span class="muted">${esc(R(s.intro))}</span></div>`));
      }
      const best = (Codex.state.data.exams || {})[arc.id];
      if (best && best.best) {
        card.appendChild(el(`<div class="small muted center mt-1">${esc(Codex.t("exam.best"))} : <span class="data cyan">${best.best}%</span></div>`));
      }
      card.querySelector(".btn").addEventListener("click", () => {
        Codex.audio.sfx.stamp();
        startTimer();
        showQuestion();
      });
      box.appendChild(card);
    }

    // ----- Chrono -----
    const clock = el(`<div class="exam-clock data"></div>`);
    function tick() {
      timeLeft -= 1;
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      clock.textContent = `${m}:${String(s).padStart(2, "0")}`;
      clock.classList.toggle("red", timeLeft <= 60);
      if (timeLeft <= 0) {
        Codex.ui.toast(Codex.t("exam.timeUp"), "⏱");
        finish();
      }
    }
    function startTimer() {
      screenEl.querySelector(".page-header").appendChild(clock);
      tick();
      timer = setInterval(() => {
        if (!screenEl.isConnected) { clearInterval(timer); return; }
        if (!finished) tick();
      }, 1000);
    }

    // ----- Questions -----
    let replaysLeft = 2;
    function showQuestion() {
      const q = questions[idx];
      replaysLeft = 2;
      box.innerHTML = "";
      const card = el(`
        <div class="card exam-q">
          <div class="spread">
            <span class="label cyan">${esc(R(q.section.name))}</span>
            <span class="label muted">${esc(Codex.t("exam.q", { i: idx + 1, n: questions.length }))}</span>
          </div>
          <div class="exam-stem"></div>
          <div class="exam-options"></div>
          <div class="spread mt-2">
            <button class="btn btn-ghost exam-abandon small">${esc(Codex.t("exam.abandon"))}</button>
            <button class="btn exam-submit" disabled>${esc(Codex.t("exam.next"))}</button>
          </div>
        </div>`);
      const stem = card.querySelector(".exam-stem");

      if (q.tts) {
        // Question d'écoute : l'énoncé n'est pas affiché
        const lst = el(`
          <div class="exam-listen">
            <span class="exam-listen-ic"></span>
            <span class="small muted">${esc(Codex.t("exam.listenHint"))}</span>
            <button class="btn btn-ghost exam-replay small">${esc(Codex.t("exam.replay", { n: replaysLeft }))}</button>
          </div>`);
        lst.querySelector(".exam-listen-ic").appendChild(icon("headphones", { size: 22 }));
        const replayBtn = lst.querySelector(".exam-replay");
        replayBtn.addEventListener("click", () => {
          if (replaysLeft <= 0) return;
          replaysLeft -= 1;
          Codex.audio.speak(q.tts);
          replayBtn.textContent = Codex.t("exam.replay", { n: replaysLeft });
          if (replaysLeft <= 0) replayBtn.disabled = true;
        });
        stem.appendChild(lst);
        Codex.audio.speak(q.tts);
      } else {
        if (q.section.passage && q.si === 0) {
          // Premier item d'une section lecture : afficher le document
          const pass = el(`<div class="exam-passage small"></div>`);
          pass.textContent = q.section.passage;
          stem.appendChild(pass);
        } else if (q.section.passage) {
          const pass = el(`<details class="exam-passage-details small"><summary class="muted">📄</summary><div class="exam-passage small"></div></details>`);
          pass.querySelector(".exam-passage").textContent = q.section.passage;
          stem.appendChild(pass);
        }
        const qEl = el(`<div class="exam-question"></div>`);
        qEl.textContent = q.q;
        stem.appendChild(qEl);
      }

      const optsEl = card.querySelector(".exam-options");
      const submit = card.querySelector(".exam-submit");
      let chosen = null;
      q.options.forEach((opt, i) => {
        const b = el(`<button class="choice-btn exam-opt"></button>`);
        b.textContent = `${"ABCD"[i]}. ${opt}`;
        b.addEventListener("click", () => {
          Codex.audio.sfx.click();
          optsEl.querySelectorAll(".exam-opt").forEach((x) => x.classList.remove("selected"));
          b.classList.add("selected");
          chosen = i;
          submit.disabled = false;
        });
        optsEl.appendChild(b);
      });

      submit.addEventListener("click", () => {
        Codex.audio.sfx.paper();
        answers[idx] = chosen;
        if (idx === questions.length - 1) finish();
        else { idx += 1; showQuestion(); }
      });
      card.querySelector(".exam-abandon").addEventListener("click", () => {
        Codex.audio.sfx.click();
        finished = true;
        clearInterval(timer);
        Codex.router.go("hq");
      });
      box.appendChild(card);
    }

    // ----- Correction -----
    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      window.speechSynthesis && window.speechSynthesis.cancel();

      const ok = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
      const pct = Math.round((ok / questions.length) * 100);
      const ex = Codex.state.data.exams || (Codex.state.data.exams = {});
      const rec = ex[arc.id] || (ex[arc.id] = { best: 0, attempts: 0 });
      rec.attempts += 1;
      const newBest = pct > rec.best;
      if (newBest) rec.best = pct;
      const xp = 60 + pct;
      Codex.state.addXp(xp);
      const gotMedal = pct >= 80 && Codex.state.awardMedal("certifie");
      Codex.state.save();

      box.innerHTML = "";
      const head = el(`
        <div class="card center exam-result">
          <div class="label amber">${esc(exam.name)}</div>
          <div class="exam-pct data">${pct}<span class="small muted">%</span></div>
          <div class="data">${esc(Codex.t("exam.score", { ok, n: questions.length }))}</div>
          <div class="h2 cyan mt-1">${exam.scale === 990
            ? esc(Codex.t("exam.scaled", { n: Math.round((990 * pct / 100) / 5) * 5 }))
            : esc(Codex.t("exam.cefr", { g: cefr(pct) }))}</div>
          ${newBest ? `<div class="small green mt-1">★ ${esc(Codex.t("exam.newBest"))}</div>` : ""}
          ${gotMedal ? `<div class="small amber mt-1">🎓 ${esc(Codex.t("medal.certifie"))} — ${esc(Codex.t("medal.certifie.d"))}</div>` : ""}
          <div class="small muted mt-1">+${xp} XP</div>
          <div class="row mt-2" style="justify-content:center; gap:10px">
            <button class="btn btn-ghost exam-again">${esc(Codex.t("exam.retake"))}</button>
            <button class="btn exam-home">${esc(Codex.t("exam.backHq"))}</button>
          </div>
        </div>`);
      head.querySelector(".exam-again").addEventListener("click", () => { Codex.audio.sfx.click(); Codex.router.go("exam"); });
      head.querySelector(".exam-home").addEventListener("click", () => { Codex.audio.sfx.click(); Codex.router.go("hq"); });
      box.appendChild(head);
      Codex.audio.sfx[pct >= 60 ? "fanfare" : "error"]();

      // Corrections détaillées
      const rev = el(`<div class="card"><div class="label mb-1">${esc(Codex.t("exam.review"))}</div><div class="exam-review"></div></div>`);
      const revBox = rev.querySelector(".exam-review");
      questions.forEach((q, i) => {
        const good = answers[i] === q.correct;
        const item = el(`
          <div class="exam-rev-item ${good ? "good" : "bad"}">
            <div class="small"><span class="data">${i + 1}.</span> <span class="exam-rev-q"></span></div>
            ${good ? "" : `<div class="small red">${esc(Codex.t("exam.yourAnswer"))} : <span class="exam-rev-yours"></span></div>`}
            <div class="small green">${esc(Codex.t("exam.correctAnswer"))} : <span class="exam-rev-correct"></span></div>
          </div>`);
        item.querySelector(".exam-rev-q").textContent = q.tts ? `🎧 ${q.tts}` : q.q;
        if (!good) item.querySelector(".exam-rev-yours").textContent = answers[i] === null ? "—" : q.options[answers[i]];
        item.querySelector(".exam-rev-correct").textContent = q.options[q.correct];
        revBox.appendChild(item);
      });
      box.appendChild(rev);
    }

    showIntro();
  });
})();
