/**
 * THE CODEX — Examen Blanc : FRANÇAIS (style TCF).
 * Sujets originaux dans l'esprit du Test de Connaissance du Français :
 * compréhension orale (TTS), structures de la langue, compréhension
 * écrite. Restitution en estimation de niveau CECRL.
 * TCF est une marque de France Éducation international — entraînement non affilié.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.EXAMS = Codex.EXAMS || {};

Codex.EXAMS["fr-FR"] = {
  name: "TCF Blanc — Session 1",
  style: { fr: "Examen blanc type TCF (non affilié)", en: "TCF-style mock exam (unaffiliated)" },
  scale: 100,
  durationMin: 14,
  sections: [
    {
      kind: "listening",
      name: { fr: "Compréhension orale", en: "Listening" },
      intro: {
        fr: "Vous allez entendre une phrase (non affichée). Choisissez la bonne interprétation. Deux écoutes maximum.",
        en: "You will hear a sentence (not displayed). Choose the correct interpretation. Two plays maximum.",
      },
      questions: [
        { tts: "Le train en provenance de Lyon entrera en gare voie deux.",
          options: ["Le train part pour Lyon.", "Le train arrive de Lyon sur la voie deux.", "Le train est annulé.", "Le train part de la voie douze."], correct: 1 },
        { tts: "La pharmacie est ouverte tous les jours sauf le dimanche.",
          options: ["Elle ouvre uniquement le dimanche.", "Elle est fermée le dimanche.", "Elle est toujours fermée.", "Elle ouvre seulement le matin."], correct: 1 },
        { tts: "Pourriez-vous rappeler un peu plus tard ? Monsieur Diallo est en réunion.",
          options: ["M. Diallo peut répondre tout de suite.", "Il faut rappeler plus tard.", "M. Diallo est en vacances.", "Le numéro n'existe pas."], correct: 1 },
        { tts: "À cause des travaux, la station Châtelet est fermée jusqu'à la fin du mois.",
          options: ["La station rouvrira le mois prochain.", "La station vient d'ouvrir.", "Les travaux sont terminés.", "La station ferme tous les soirs."], correct: 0 },
        { tts: "Il vaut mieux réserver : ce restaurant est complet presque tous les soirs.",
          options: ["Le restaurant est souvent vide.", "Il est conseillé de réserver.", "Le restaurant est fermé le soir.", "On ne peut pas réserver."], correct: 1 },
        { tts: "Vous avez composté votre billet avant de monter dans le train ?",
          options: ["On demande si le billet a été validé.", "On demande où va le train.", "On demande le prix du billet.", "On propose un billet gratuit."], correct: 0 },
        { tts: "Le colis sera livré demain entre neuf heures et midi.",
          options: ["Le colis est déjà arrivé.", "La livraison aura lieu demain matin.", "La livraison aura lieu demain soir.", "Le colis est perdu."], correct: 1 },
        { tts: "Désolé, nous n'acceptons que les paiements par carte.",
          options: ["On peut payer en espèces.", "Seule la carte est acceptée.", "Le paiement est gratuit.", "On ne peut pas payer par carte."], correct: 1 },
      ],
    },
    {
      kind: "grammar",
      name: { fr: "Structures de la langue", en: "Language structures" },
      intro: {
        fr: "Choisissez la forme correcte pour compléter chaque phrase.",
        en: "Choose the correct form to complete each sentence.",
      },
      questions: [
        { q: "Si j'avais le temps, je ___ plus souvent au théâtre.", options: ["vais", "irai", "irais", "allais"], correct: 2 },
        { q: "C'est la collègue ___ je t'ai parlé hier.", options: ["que", "dont", "qui", "laquelle"], correct: 1 },
        { q: "Nous habitons ici ___ dix ans.", options: ["depuis", "pendant", "il y a", "dès"], correct: 0 },
        { q: "Il faut que tu ___ à l'heure demain matin.", options: ["es", "sois", "seras", "étais"], correct: 1 },
        { q: "Elle est ___ intelligente que sa sœur.", options: ["autant", "aussi", "tant", "si"], correct: 1 },
        { q: "Les documents ? Je ___ ai envoyés ce matin.", options: ["leur", "les leur", "leur les", "les y"], correct: 1 },
        { q: "___ avoir terminé son stage, il a été embauché.", options: ["Avant", "Après", "Pendant", "Depuis"], correct: 1 },
        { q: "Cette décision a été prise ___ le directeur lui-même.", options: ["de", "avec", "par", "chez"], correct: 2 },
      ],
    },
    {
      kind: "reading",
      name: { fr: "Compréhension écrite", en: "Reading comprehension" },
      intro: {
        fr: "Lisez le document puis répondez aux questions.",
        en: "Read the document and answer the questions.",
      },
      passage: "AVIS AUX HABITANTS — Mairie du 11e arrondissement\n\nDans le cadre de la semaine du développement durable, la mairie organise samedi 14 juin, de 9 h à 13 h, une grande collecte d'appareils électroniques usagés sur le parvis de l'hôtel de ville. Les appareils en état de marche seront reconditionnés et offerts à des associations locales ; les autres seront recyclés. Attention : les piles et batteries ne seront pas acceptées — elles doivent être déposées en pharmacie ou en déchetterie. Une buvette associative sera tenue par les bénévoles du quartier.",
      questions: [
        { q: "Quel est l'objet principal de cet avis ?", options: ["L'ouverture d'une nouvelle pharmacie", "Une collecte d'appareils électroniques", "Des travaux sur le parvis", "Un concert de quartier"], correct: 1 },
        { q: "Que deviendront les appareils qui fonctionnent encore ?", options: ["Ils seront vendus aux enchères.", "Ils seront détruits.", "Ils seront reconditionnés et donnés.", "Ils seront rendus aux habitants."], correct: 2 },
        { q: "Où faut-il déposer les piles ?", options: ["Sur le parvis de la mairie", "À la buvette", "En pharmacie ou en déchetterie", "Dans la rue"], correct: 2 },
        { q: "Quand la collecte a-t-elle lieu ?", options: ["Le samedi 14 juin au matin", "Le dimanche 14 juin", "Tout le mois de juin", "Le samedi soir"], correct: 0 },
      ],
    },
  ],
};
