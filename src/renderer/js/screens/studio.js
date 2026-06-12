/**
 * THE CODEX — Studio Vocal : lecture / prononciation.
 * Listening + Reading + Speaking : ECHO lit la phrase (TTS natif),
 * l'agent la lit à voix haute, le module vocal analyse le rythme
 * (durée parlée, pics de syllabes) et note la prise.
 * Si le micro est refusé : mode écoute active avec auto-évaluation.
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, icon, pageHeader } = Codex.ui;
  const SESSION_LEN = 5;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function R(x) {
    if (x && typeof x === "object") return x[Codex.i18n.get()] ?? x.fr ?? x.en;
    return x;
  }

  /** Phrases d'entraînement : phrasebook de la KB + exemples des verbes. */
  function buildDrills(arc) {
    const kb = Codex.KB[arc.id] || {};
    const drills = [];
    for (const p of kb.phrasebook || []) drills.push({ text: p.phrase, note: R(p.note) });
    for (const v of kb.verbs || []) if (v.ex) drills.push({ text: v.ex, note: v.inf });
    return shuffle(drills).slice(0, SESSION_LEN);
  }

  Codex.router.register("studio", (screenEl) => {
    const arc = Codex.arc();
    const drills = buildDrills(arc);
    const micOk = Codex.voice.supported();
    const scores = [];
    let idx = 0;

    Codex.music.play(arc.theme, "calm");
    Codex.ui.fxLayers(screenEl);
    screenEl.appendChild(pageHeader(Codex.t("studio.title"), "hq", { flagCode: arc.id }));

    const wrap = el(`
      <div class="screen-scroll"><div class="studio-wrap">
        <div class="small muted center mb-2">${esc(Codex.t("studio.sub"))}</div>
        <div class="card studio-card">
          <div class="spread">
            <span class="label cyan studio-count"></span>
            <span class="label muted">${esc(Codex.t("studio.rhythm"))}</span>
          </div>
          <div class="studio-phrase"></div>
          <div class="small muted studio-note"></div>
          <div class="studio-meter"><i></i></div>
          <div class="studio-feedback"></div>
          <div class="studio-actions">
            <button class="btn btn-ghost studio-listen"></button>
            <button class="btn studio-speak"></button>
            <button class="btn btn-ghost studio-next" style="display:none"></button>
          </div>
        </div>
        <button class="btn btn-ghost studio-library">${esc(Codex.t("library.open"))}</button>
      </div></div>`);
    screenEl.appendChild(wrap);

    const phraseEl = wrap.querySelector(".studio-phrase");
    const noteEl = wrap.querySelector(".studio-note");
    const countEl = wrap.querySelector(".studio-count");
    const meter = wrap.querySelector(".studio-meter");
    const meterFill = wrap.querySelector(".studio-meter i");
    const feedback = wrap.querySelector(".studio-feedback");
    const listenBtn = wrap.querySelector(".studio-listen");
    const speakBtn = wrap.querySelector(".studio-speak");
    const nextBtn = wrap.querySelector(".studio-next");

    listenBtn.appendChild(icon("headphones", { size: 16 }));
    listenBtn.appendChild(document.createTextNode(" " + Codex.t("studio.listen")));
    speakBtn.appendChild(icon("mic", { size: 16 }));
    speakBtn.appendChild(document.createTextNode(" " + (micOk ? Codex.t("studio.speak") : Codex.t("studio.selfOk"))));
    nextBtn.textContent = Codex.t("studio.next");

    if (!micOk) {
      feedback.innerHTML = `<div class="small amber">${esc(Codex.t("studio.micDenied"))}</div>`;
    }

    function show() {
      const d = drills[idx];
      countEl.textContent = Codex.t("studio.phrase", { i: idx + 1, n: drills.length });
      phraseEl.textContent = d.text;
      noteEl.textContent = d.note || "";
      feedback.innerHTML = micOk ? "" : `<div class="small amber">${esc(Codex.t("studio.micDenied"))}</div>`;
      meterFill.style.width = "0%";
      nextBtn.style.display = "none";
      speakBtn.disabled = false;
      Codex.audio.speak(d.text);
    }

    function showResult(score) {
      scores.push(score);
      const verdictKey = score >= 85 ? "excellent" : score >= 65 ? "good" : score >= 45 ? "rework" : score > 0 ? "retry" : "silent";
      feedback.innerHTML = `
        <div class="studio-score ${score >= 65 ? "cyan" : score >= 45 ? "amber" : "red"}">${score}<span class="small muted">/100</span></div>
        <div class="small">${esc(Codex.t(`studio.v.${verdictKey}`))}</div>`;
      Codex.audio.sfx[score >= 65 ? "good" : "error"]();
      nextBtn.textContent = idx === drills.length - 1 ? Codex.t("studio.finish") : Codex.t("studio.next");
      nextBtn.style.display = "";
    }

    listenBtn.addEventListener("click", () => {
      Codex.audio.sfx.click();
      Codex.audio.speak(drills[idx].text);
    });

    speakBtn.addEventListener("click", async () => {
      Codex.audio.sfx.click();
      if (!micOk) {
        // Auto-évaluation (écoute active)
        showResult(75);
        return;
      }
      speakBtn.disabled = true;
      feedback.innerHTML = `<div class="small purple">${esc(Codex.t("studio.recording"))}</div>`;
      meter.classList.add("live");
      const take = await Codex.voice.record({
        onLevel: (v) => { meterFill.style.width = `${Math.round(v * 100)}%`; },
      });
      meter.classList.remove("live");
      meterFill.style.width = "0%";
      speakBtn.disabled = false;
      if (take.error) {
        feedback.innerHTML = `<div class="small amber">${esc(Codex.t("studio.micDenied"))}</div>`;
        showResult(75);
        return;
      }
      const lang = (arc.language.tts || "en").slice(0, 2);
      const g = Codex.voice.grade(take.envelope, drills[idx].text, lang);
      showResult(g.score);
    });

    nextBtn.addEventListener("click", () => {
      Codex.audio.sfx.click();
      if (idx === drills.length - 1) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));
        const xp = (micOk ? 30 : 20) + Math.round(avg / 5);
        Codex.state.addXp(xp);
        const stu = Codex.state.data.studio || (Codex.state.data.studio = { sessions: 0, bestAvg: 0 });
        stu.sessions += 1;
        stu.bestAvg = Math.max(stu.bestAvg, avg);
        Codex.state.save();
        Codex.ui.toast(`${Codex.t("studio.result", { avg })} · ${Codex.t("studio.xp", { xp })}`, "🎙");
        Codex.router.go("hq");
        return;
      }
      idx += 1;
      show();
    });

    wrap.querySelector(".studio-library").addEventListener("click", () => {
      Codex.audio.sfx.paper();
      Codex.router.go("library");
    });

    show();
  });
})();
