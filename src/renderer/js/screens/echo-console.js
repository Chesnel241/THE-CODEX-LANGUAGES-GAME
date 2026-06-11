/**
 * THE CODEX — Console ECHO : dialogue libre avec l'IA de terrain.
 * Chat hors-ligne alimenté par echo-ai.js (toute la base de connaissances).
 */
"use strict";
window.Codex = window.Codex || {};

(function () {
  const { el, esc, pageHeader } = Codex.ui;

  Codex.router.register("echo-console", (screenEl) => {
    const st = Codex.state;
    screenEl.appendChild(pageHeader(Codex.t("echoc.title")));
    Codex.music.play(Codex.arc().theme, "calm");

    const wrap = el(`
      <div class="echoc-wrap">
        <div class="echoc-messages" aria-live="polite"></div>
        <div class="echoc-suggest"></div>
        <form class="echoc-inputrow">
          <input class="echoc-input" maxlength="300" placeholder="${esc(Codex.t("echoc.ph"))}" autocomplete="off" />
          <button class="btn echoc-send" type="submit">${esc(Codex.t("echoc.send"))}</button>
        </form>
      </div>`);
    screenEl.appendChild(wrap);

    const messages = wrap.querySelector(".echoc-messages");
    const suggestBox = wrap.querySelector(".echoc-suggest");
    const form = wrap.querySelector("form");
    const input = wrap.querySelector(".echoc-input");

    function scrollDown() { messages.scrollTop = messages.scrollHeight; }

    function addAgentMsg(text) {
      const m = el(`<div class="echoc-msg echoc-agent"><div class="echoc-bubble"></div></div>`);
      m.querySelector(".echoc-bubble").textContent = text;
      messages.appendChild(m);
      scrollDown();
    }

    function addEchoMsg(reply) {
      const m = el(`
        <div class="echoc-msg echoc-echo">
          <div class="echo-hex"></div>
          <div class="echoc-bubble">
            <div class="echoc-text"></div>
            ${reply.data ? `<pre class="echoc-data"></pre>` : ""}
            ${reply.related && reply.related.length ? `<div class="echoc-related small muted"></div>` : ""}
            ${reply.speak ? `<button class="echoc-listen" title="${esc(Codex.t("intel.listen"))}">🔊</button>` : ""}
          </div>
        </div>`);
      Codex.ui.typewrite(m.querySelector(".echoc-text"), reply.text);
      if (reply.data) m.querySelector(".echoc-data").textContent = reply.data;
      if (reply.related && reply.related.length) {
        m.querySelector(".echoc-related").textContent = `${Codex.t("echoc.related")} ${reply.related.join(" · ")}`;
      }
      const listen = m.querySelector(".echoc-listen");
      if (listen) listen.addEventListener("click", () => {
        Codex.audio.sfx.click();
        Codex.audio.speak(reply.speak);
      });
      messages.appendChild(m);
      Codex.audio.sfx.echo();
      Codex.audio.speakEcho(reply.text); // ECHO lit sa réponse (si activé)
      scrollDown();
      renderSuggestions(reply.suggestions || []);
    }

    function renderSuggestions(list) {
      suggestBox.innerHTML = "";
      list.slice(0, 5).forEach((s) => {
        const chip = el(`<button class="echoc-chip"></button>`);
        chip.textContent = s;
        chip.addEventListener("click", () => send(s));
        suggestBox.appendChild(chip);
      });
    }

    function send(text) {
      const q = String(text || "").trim();
      if (!q) return;
      Codex.audio.sfx.click();
      addAgentMsg(q);
      input.value = "";
      st.data.stats.echoQuestions = (st.data.stats.echoQuestions || 0) + 1;
      st.save();
      // Latence simulée : ECHO "décode"
      setTimeout(() => addEchoMsg(Codex.echoAI.ask(q)), 350);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      send(input.value);
    });

    // Message d'accueil + suggestions initiales
    addEchoMsg({
      text: Codex.t("echoc.intro", { name: st.data.agent.codeName }),
      suggestions: Codex.echoAI.ask("").suggestions,
    });
    input.focus();
  });
})();
