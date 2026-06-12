/**
 * THE CODEX — Examen Blanc : ESPAGNOL (style DELE).
 * Sujets originaux dans l'esprit des Diplomas de Español como Lengua
 * Extranjera : comprensión auditiva (TTS), gramática y vocabulario,
 * comprensión de lectura. Restitution en estimation CECRL.
 * DELE est une marque de l'Instituto Cervantes — entraînement non affilié.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.EXAMS = Codex.EXAMS || {};

Codex.EXAMS["es-ES"] = {
  name: "DELE Blanco — Sesión 1",
  style: { fr: "Examen blanc type DELE (non affilié)", en: "DELE-style mock exam (unaffiliated)" },
  scale: 100,
  durationMin: 12,
  sections: [
    {
      kind: "listening",
      name: { fr: "Compréhension orale", en: "Listening" },
      intro: {
        fr: "Vous allez entendre une phrase en espagnol (non affichée). Choisissez la bonne interprétation. Deux écoutes maximum.",
        en: "You will hear a sentence in Spanish (not displayed). Choose the correct interpretation. Two plays maximum.",
      },
      questions: [
        { tts: "El museo cierra los lunes y la entrada es gratuita los domingos por la tarde.",
          options: ["El museo abre los lunes.", "La entrada es gratis el domingo por la tarde.", "El museo siempre es de pago.", "El museo cierra los domingos."], correct: 1 },
        { tts: "Perdone, ¿me puede traer la cuenta cuando pueda?",
          options: ["Pide la carta.", "Pide la cuenta.", "Pide otra mesa.", "Pide un taxi."], correct: 1 },
        { tts: "El próximo tren con destino a Sevilla saldrá del andén tres.",
          options: ["El tren llega de Sevilla.", "El tren sale del andén tres.", "El tren está cancelado.", "El tren sale a las tres."], correct: 1 },
        { tts: "Se me ha estropeado el móvil y tengo que llevarlo a reparar.",
          options: ["Ha comprado un móvil nuevo.", "Su móvil funciona perfectamente.", "Su móvil está averiado.", "Ha perdido el móvil."], correct: 2 },
        { tts: "¿Te apetece quedar el sábado para tomar algo en el centro?",
          options: ["Propone una cita el sábado.", "Cancela una cita.", "Pregunta por una dirección.", "Pide dinero prestado."], correct: 0 },
        { tts: "La farmacia de guardia está abierta toda la noche, justo enfrente de la comisaría.",
          options: ["La farmacia cierra por la noche.", "La farmacia está al lado del museo.", "La farmacia nocturna está frente a la comisaría.", "No hay farmacia en el barrio."], correct: 2 },
      ],
    },
    {
      kind: "grammar",
      name: { fr: "Grammaire et vocabulaire", en: "Grammar & vocabulary" },
      intro: {
        fr: "Choisissez la forme correcte pour compléter chaque phrase.",
        en: "Choose the correct form to complete each sentence.",
      },
      questions: [
        { q: "Cuando era pequeño, ___ al fútbol todos los días.", options: ["jugué", "jugaba", "juego", "jugaré"], correct: 1 },
        { q: "Espero que ___ buen viaje la semana que viene.", options: ["tienes", "tendrás", "tengas", "tenías"], correct: 2 },
        { q: "¿___ gusta más, el cine o el teatro?", options: ["Te", "Tú", "Ti", "Tu"], correct: 0 },
        { q: "Este informe fue escrito ___ la nueva directora.", options: ["por", "para", "de", "con"], correct: 0 },
        { q: "No encuentro las llaves; creo que ___ he dejado en casa.", options: ["los", "las", "les", "lo"], correct: 1 },
        { q: "Si tuviera más tiempo, ___ otro idioma.", options: ["aprendo", "aprenderé", "aprendería", "aprendía"], correct: 2 },
        { q: "Llevamos dos horas ___ el autobús.", options: ["esperando", "esperar", "esperado", "espera"], correct: 0 },
        { q: "El banco está ___ la izquierda, justo después del quiosco.", options: ["en", "a", "por", "hasta"], correct: 1 },
        { q: "___ terminar el informe, envíamelo por correo.", options: ["Antes", "Al", "Después", "Mientras"], correct: 1 },
        { q: "Mañana hay huelga, ___ que los trenes no funcionarán.", options: ["así", "para", "porque", "aunque"], correct: 0 },
      ],
    },
    {
      kind: "reading",
      name: { fr: "Compréhension écrite", en: "Reading comprehension" },
      intro: {
        fr: "Lisez le document puis répondez aux questions.",
        en: "Read the document and answer the questions.",
      },
      passage: "AVISO — Comunidad de vecinos, calle Mayor 12\n\nSe informa a todos los vecinos de que el próximo martes 8 de abril se cortará el agua de 9:00 a 14:00 por obras de mejora en las tuberías del edificio. Se recomienda guardar agua para uso doméstico. El ascensor seguirá funcionando con normalidad. Para cualquier urgencia durante las obras, contacten con el portero o llamen a la empresa instaladora. Disculpen las molestias.",
      questions: [
        { q: "¿Por qué se corta el agua?", options: ["Por una avería del ascensor", "Por obras en las tuberías", "Por falta de pago", "Por una huelga"], correct: 1 },
        { q: "¿Cuánto tiempo durará el corte?", options: ["Todo el día", "Cinco horas", "Dos días", "Una hora"], correct: 1 },
        { q: "¿Qué se recomienda a los vecinos?", options: ["Salir del edificio", "No usar el ascensor", "Guardar agua", "Cerrar las ventanas"], correct: 2 },
      ],
    },
  ],
};
