/**
 * THE CODEX — Moteur LA SURVEILLANCE (GDD §5.4).
 * Document intercepté + questions d'extraction. Bulles contextuelles
 * au survol (phonétique + indice, jamais de traduction directe).
 */
"use strict";
window.Codex = window.Codex || {};
Codex.engines = Codex.engines || {};

(function () {
  const { el, esc, echoBar } = Codex.ui;

  /** Enveloppe les mots du glossaire dans des spans interactifs. */
  function glossify(text, glossary) {
    let html = esc(text);
    for (const key of Object.keys(glossary)) {
      const re = new RegExp(`(^|[^\\p{L}])(${key})(?=$|[^\\p{L}])`, "giu");
      html = html.replace(re, (m, pre, word) => `${pre}<span class="gloss" data-key="${esc(key)}">${word}</span>`);
    }
    return html;
  }

  /** opts : { content: { document, questions }, hints, echoIntro, onDone } */
  function mount(screenEl, opts) {
    const { content, onDone } = opts;
    const hints = opts.hints ?? Codex.state.level().hints;
    const startTime = Date.now();
    let errors = 0;
    let answered = 0;
    const doc = content.document;

    screenEl.innerHTML = "";
    Codex.music.play(Codex.arc().theme, "calm");

    screenEl.appendChild(el(`
      <div class="terrain-topbar">
        <div>
          <div class="label">${esc(Codex.t("terrain.docTitle"))}</div>
          <div class="data">${esc(doc.title)}</div>
        </div>
        <div class="tag-classified">${esc(Codex.t("terrain.classified"))}</div>
      </div>`));

    const wrap = el(`<div class="surv-wrap"></div>`);
    screenEl.appendChild(wrap);

    // --- Document ---
    const docPane = el(`<div class="surv-doc"></div>`);
    const paper = el(`<div class="surv-paper"></div>`);
    paper.appendChild(el(`<div class="doc-meta">${esc(doc.meta).replace(/\n/g, "<br>")}</div>`));
    doc.paragraphs.forEach((p) => {
      const para = el(`<p>${glossify(p, doc.glossary).replace(/\n/g, "<br>")}</p>`);
      paper.appendChild(para);
    });
    docPane.appendChild(paper);
    wrap.appendChild(docPane);

    // Bulles contextuelles
    let tip = null;
    paper.addEventListener("mouseover", (e) => {
      const g = e.target.closest(".gloss");
      if (!g) return;
      const entry = doc.glossary[g.dataset.key.toLowerCase()] || doc.glossary[g.dataset.key];
      if (!entry) return;
      Codex.audio.sfx.hover();
      tip = el(`<div class="gloss-tip"><span class="mono">${esc(entry.ph)}</span><br>${esc(entry.hint)}</div>`);
      document.body.appendChild(tip);
      const r = g.getBoundingClientRect();
      tip.style.left = `${Math.min(r.left, window.innerWidth - 300)}px`;
      tip.style.top = `${r.bottom + 6}px`;
    });
    paper.addEventListener("mouseout", (e) => {
      if (e.target.closest(".gloss") && tip) { tip.remove(); tip = null; }
    });

    // --- Questions ---
    const qPane = el(`<div class="surv-questions"></div>`);
    wrap.appendChild(qPane);
    qPane.appendChild(el(`<div class="label">${esc(Codex.t("terrain.extraction", { n: content.questions.length }))}</div>`));

    let currentQuestion = content.questions[0];
    content.questions.forEach((q) => {
      const card = el(`
        <div class="card">
          <div class="mb-1" style="font-weight:600">${esc(q.q)}</div>
          <div class="choices"></div>
        </div>`);
      const choicesEl = card.querySelector(".choices");
      let resolved = false;
      q.options.forEach((optText, oi) => {
        const btn = el(`<button class="choice-btn"></button>`);
        btn.textContent = optText;
        btn.addEventListener("click", () => {
          if (resolved) return;
          currentQuestion = q;
          if (oi === q.correct) {
            resolved = true;
            btn.classList.add("good");
            Codex.audio.sfx.good();
            choicesEl.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
            answered += 1;
            if (answered === content.questions.length) setTimeout(finish, 900);
            else echo.say(Codex.t("echo.qLeft", { n: content.questions.length - answered }));
          } else {
            btn.classList.add("bad");
            btn.disabled = true;
            errors += 1;
            Codex.audio.sfx.error();
            echo.say(Codex.t("echo.reread"));
          }
        });
        choicesEl.appendChild(btn);
      });
      qPane.appendChild(card);
    });

    const echo = echoBar(opts.echoIntro || Codex.t("echo.survIntro"), {
      hints,
      onHint: () => { if (currentQuestion) echo.say(currentQuestion.echoHint); },
    });
    screenEl.appendChild(echo.node);

    Codex.audio.sfx.paper();

    function finish() {
      if (tip) { tip.remove(); tip = null; }
      onDone({
        errors,
        hintsUsed: echo.hintsUsed(),
        fragments: 0,
        cultural: 0,
        maxSuspicion: 0,
        timeSec: Math.round((Date.now() - startTime) / 1000),
      });
    }
  }

  Codex.engines.surveillance = { mount };

  Codex.router.register("terrain-surveillance", (screenEl, params) => {
    mount(screenEl, {
      content: params.mission,
      echoIntro: params.mission.brief.echo,
      onDone: (r) => Codex.flow.completeMission(params.mission, r),
    });
  });
})();
