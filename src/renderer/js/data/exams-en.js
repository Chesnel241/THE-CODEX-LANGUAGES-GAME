/**
 * THE CODEX — Examen Blanc : ANGLAIS (style TOEIC®).
 * Sujets originaux écrits pour le jeu, dans l'esprit des sections
 * officielles : Listening (audio TTS, énoncé non affiché), Incomplete
 * Sentences, Reading Comprehension. Score restitué sur 990.
 * TOEIC est une marque d'ETS — ceci est un entraînement non affilié.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.EXAMS = Codex.EXAMS || {};

Codex.EXAMS["en-UK"] = {
  name: "TOEIC Blanc — Session 1",
  style: { fr: "Examen blanc type TOEIC® (non affilié)", en: "TOEIC®-style mock exam (unaffiliated)" },
  scale: 990,
  durationMin: 15,
  sections: [
    {
      kind: "listening",
      name: { fr: "Compréhension orale", en: "Listening" },
      intro: {
        fr: "Vous allez entendre une phrase (non affichée). Choisissez la réponse ou la paraphrase la plus appropriée. Deux écoutes maximum.",
        en: "You will hear a sentence (not displayed). Choose the most appropriate response or paraphrase. Two plays maximum.",
      },
      questions: [
        { tts: "The meeting has been postponed until Thursday afternoon.",
          options: ["The meeting will happen earlier than planned.", "The meeting was cancelled.", "The meeting will take place later than planned.", "The meeting is every Thursday."], correct: 2 },
        { tts: "Could you tell me where the nearest underground station is?",
          options: ["It closes at midnight.", "Turn left at the corner — it's right there.", "Yes, I took the bus.", "The tickets are very expensive."], correct: 1 },
        { tts: "I'm afraid the flight to Manchester has been delayed by two hours.",
          options: ["The flight leaves on time.", "The flight has been moved to another airport.", "Passengers will wait two more hours.", "The flight lasts two hours."], correct: 2 },
        { tts: "Would you mind sending me the invoice by the end of the week?",
          options: ["Not at all, I'll send it by Friday.", "Yes, the window is open.", "No, I haven't met him yet.", "It was sent two years ago."], correct: 0 },
        { tts: "The restaurant is fully booked tonight, but we have a table for tomorrow.",
          options: ["You can eat there tonight.", "The restaurant is closed tomorrow.", "No table is free tonight.", "The restaurant never takes bookings."], correct: 2 },
        { tts: "How long have you been working for this company?",
          options: ["About ten kilometres.", "Nearly five years now.", "Twice a week.", "With my colleagues."], correct: 1 },
        { tts: "All visitors must sign in at reception before entering the building.",
          options: ["Visitors may enter without checking in.", "Visitors should register at the front desk first.", "The building is closed to visitors.", "Reception is on the top floor."], correct: 1 },
        { tts: "Why don't we share a taxi to the conference centre?",
          options: ["Because the taxi is yellow.", "Good idea — that will save us money.", "The conference was excellent.", "I have never driven a taxi."], correct: 1 },
      ],
    },
    {
      kind: "grammar",
      name: { fr: "Phrases à compléter", en: "Incomplete sentences" },
      intro: {
        fr: "Choisissez le mot ou la forme qui complète correctement chaque phrase.",
        en: "Choose the word or form that best completes each sentence.",
      },
      questions: [
        { q: "The quarterly report ___ by Friday at the latest.", options: ["must finish", "must be finished", "must finishing", "must to finish"], correct: 1 },
        { q: "Ms. Patel has worked in our Lyon branch ___ 2019.", options: ["for", "during", "since", "from"], correct: 2 },
        { q: "If the client ___ earlier, we would have prepared the documents.", options: ["had called", "calls", "would call", "has called"], correct: 0 },
        { q: "Neither the manager ___ her assistants were aware of the change.", options: ["or", "and", "nor", "but"], correct: 2 },
        { q: "The new security badges will be distributed ___ all employees next week.", options: ["at", "to", "for", "between"], correct: 1 },
        { q: "Despite ___ heavily, the outdoor event was not cancelled.", options: ["rain", "to rain", "raining", "rained"], correct: 2 },
        { q: "Applicants ___ CVs arrive after the deadline will not be considered.", options: ["who", "whose", "which", "whom"], correct: 1 },
        { q: "The hotel is conveniently ___ within walking distance of the station.", options: ["located", "locating", "location", "locate"], correct: 0 },
        { q: "We look forward to ___ from you at your earliest convenience.", options: ["hear", "be heard", "hearing", "heard"], correct: 2 },
        { q: "Sales figures were considerably ___ than expected this quarter.", options: ["high", "highest", "more high", "higher"], correct: 3 },
        { q: "Please ___ the attached form and return it to Human Resources.", options: ["fill out", "fill off", "fall out", "fill on"], correct: 0 },
        { q: "The warranty is valid ___ two years from the date of purchase.", options: ["since", "for", "by", "until"], correct: 1 },
      ],
    },
    {
      kind: "reading",
      name: { fr: "Compréhension écrite", en: "Reading comprehension" },
      intro: {
        fr: "Lisez le document puis répondez aux questions.",
        en: "Read the document and answer the questions.",
      },
      passage: "MEMO — To: All staff | From: Building Management | Date: 3 March\n\nPlease note that the lifts in the East Wing will be out of service from Monday 10 March to Wednesday 12 March for scheduled maintenance. During this period, staff and visitors are asked to use the stairs or the lifts in the West Wing. Deliveries should be redirected to the goods entrance on Brewer Street. We apologise for any inconvenience and thank you for your cooperation. For urgent access needs, please contact facilities@building.example before Friday 7 March.",
      questions: [
        { q: "What is the main purpose of this memo?", options: ["To announce a fire drill", "To inform staff about lift maintenance", "To advertise a new building", "To recruit maintenance workers"], correct: 1 },
        { q: "How long will the East Wing lifts be unavailable?", options: ["One day", "Two days", "Three days", "One week"], correct: 2 },
        { q: "Where should deliveries go during the works?", options: ["The West Wing reception", "The main lobby", "The goods entrance on Brewer Street", "The East Wing stairs"], correct: 2 },
        { q: "What should staff with urgent access needs do?", options: ["Use the East Wing lifts anyway", "Contact facilities before 7 March", "Wait until 12 March", "Call Building Management after Monday"], correct: 1 },
        { q: "The word “inconvenience” is closest in meaning to:", options: ["trouble", "expense", "delay", "accident"], correct: 0 },
      ],
    },
  ],
};
