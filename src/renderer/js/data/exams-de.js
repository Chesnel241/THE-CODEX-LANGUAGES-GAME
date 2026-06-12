/**
 * THE CODEX — Examen Blanc : ALLEMAND (style Goethe-Zertifikat).
 * Sujets originaux dans l'esprit des examens du Goethe-Institut :
 * Hörverstehen (TTS), Grammatik und Wortschatz, Leseverstehen.
 * Restitution en estimation CECRL.
 * Goethe-Zertifikat est une marque du Goethe-Institut — entraînement non affilié.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.EXAMS = Codex.EXAMS || {};

Codex.EXAMS["de-DE"] = {
  name: "Goethe Blanko — Runde 1",
  style: { fr: "Examen blanc type Goethe-Zertifikat (non affilié)", en: "Goethe-Zertifikat-style mock exam (unaffiliated)" },
  scale: 100,
  durationMin: 12,
  sections: [
    {
      kind: "listening",
      name: { fr: "Compréhension orale", en: "Listening" },
      intro: {
        fr: "Vous allez entendre une phrase en allemand (non affichée). Choisissez la bonne interprétation. Deux écoutes maximum.",
        en: "You will hear a sentence in German (not displayed). Choose the correct interpretation. Two plays maximum.",
      },
      questions: [
        { tts: "Der Zug nach Hamburg fährt heute von Gleis sieben ab.",
          options: ["Der Zug kommt aus Hamburg.", "Der Zug fährt von Gleis sieben.", "Der Zug fällt aus.", "Der Zug fährt um sieben Uhr."], correct: 1 },
        { tts: "Die Apotheke ist mittags von eins bis drei geschlossen.",
          options: ["Die Apotheke ist immer offen.", "Die Apotheke macht mittags Pause.", "Die Apotheke öffnet um drei Uhr morgens.", "Die Apotheke ist sonntags offen."], correct: 1 },
        { tts: "Könnten Sie mir bitte die Rechnung bringen?",
          options: ["Er bestellt ein Hauptgericht.", "Er möchte bezahlen.", "Er reserviert einen Tisch.", "Er ruft ein Taxi."], correct: 1 },
        { tts: "Wegen einer Störung fällt die U-Bahn-Linie drei heute leider aus.",
          options: ["Die Linie drei fährt heute nicht.", "Die Linie drei fährt öfter.", "Die Linie drei ist neu.", "Die Linie drei fährt nur heute."], correct: 0 },
        { tts: "Hast du Lust, am Samstag mit uns ins Kino zu gehen?",
          options: ["Eine Einladung ins Kino.", "Eine Absage.", "Eine Frage nach dem Weg.", "Eine Beschwerde."], correct: 0 },
        { tts: "Bitte denken Sie daran, Ihren Müll zu trennen.",
          options: ["Man soll den Müll trennen.", "Man soll den Müll auf die Straße stellen.", "Es gibt keinen Müll.", "Der Müll wird nicht abgeholt."], correct: 0 },
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
        { q: "Ich warte schon seit einer Stunde ___ den Bus.", options: ["auf", "für", "an", "über"], correct: 0 },
        { q: "Gestern ___ wir ins Restaurant gegangen.", options: ["haben", "sind", "waren", "werden"], correct: 1 },
        { q: "Er kommt heute später, ___ er noch arbeiten muss.", options: ["denn", "weil", "deshalb", "aber"], correct: 1 },
        { q: "Das ist der Kollege, ___ mir geholfen hat.", options: ["der", "den", "dem", "dessen"], correct: 0 },
        { q: "Kannst du mir bitte ___ Schlüssel geben?", options: ["der", "den", "dem", "des"], correct: 1 },
        { q: "Wenn ich Zeit hätte, ___ ich mehr Sport machen.", options: ["werde", "würde", "will", "wurde"], correct: 1 },
        { q: "Sie interessiert sich sehr ___ Geschichte.", options: ["über", "an", "für", "mit"], correct: 2 },
        { q: "Der Brief wurde gestern ___ der Sekretärin geschrieben.", options: ["von", "durch", "bei", "mit"], correct: 0 },
        { q: "Ich habe vor, im Sommer nach Österreich ___ .", options: ["fahren", "zu fahren", "gefahren", "fahre"], correct: 1 },
        { q: "___ des schlechten Wetters fand das Konzert statt.", options: ["Wegen", "Trotz", "Während", "Statt"], correct: 1 },
      ],
    },
    {
      kind: "reading",
      name: { fr: "Compréhension écrite", en: "Reading comprehension" },
      intro: {
        fr: "Lisez le document puis répondez aux questions.",
        en: "Read the document and answer the questions.",
      },
      passage: "AUSHANG — Hausverwaltung, Lindenstraße 24\n\nLiebe Mieterinnen und Mieter, am Donnerstag, dem 15. Mai, wird zwischen 8 und 12 Uhr der Aufzug gewartet. In dieser Zeit benutzen Sie bitte die Treppe. Die Kellerräume bleiben zugänglich. Bitte stellen Sie an diesem Tag keine Fahrräder in den Hausflur, damit die Techniker freien Zugang haben. Bei Fragen wenden Sie sich an den Hausmeister (Erdgeschoss, Wohnung 2). Vielen Dank für Ihr Verständnis.",
      questions: [
        { q: "Was wird am 15. Mai gemacht?", options: ["Die Treppe wird geputzt.", "Der Aufzug wird gewartet.", "Der Keller wird renoviert.", "Die Fahrräder werden repariert."], correct: 1 },
        { q: "Was sollen die Mieter an diesem Tag nicht tun?", options: ["Die Treppe benutzen", "Den Keller betreten", "Fahrräder in den Hausflur stellen", "Den Hausmeister fragen"], correct: 2 },
        { q: "An wen können sich die Mieter bei Fragen wenden?", options: ["An die Polizei", "An die Techniker", "An den Hausmeister", "An die Nachbarn"], correct: 2 },
      ],
    },
  ],
};
