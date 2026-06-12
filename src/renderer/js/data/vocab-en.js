/**
 * THE CODEX — Bibliothèque de mots : ANGLAIS (UK).
 * Vocabulaire thématique de fréquence (inspiré des listes Oxford 3000 /
 * vie quotidienne britannique), glosses bilingues FR/EN.
 * Alimente : Bibliothèque, quiz (Arène/Daily), index du chatbot ECHO.
 */
"use strict";
window.Codex = window.Codex || {};
Codex.VOCAB = Codex.VOCAB || {};

(function () {
  // [mot, gloss FR, gloss EN (synonyme/définition courte)]
  const T = (id, name, rows) => ({
    id, name,
    words: rows.map(([w, fr, en]) => ({ w, g: { fr, en } })),
  });

  Codex.VOCAB["en-UK"] = { themes: [
    T("travel", { fr: "Voyage", en: "Travel" }, [
      ["luggage", "bagages", "bags and suitcases"],
      ["return ticket", "billet aller-retour", "ticket to go and come back"],
      ["platform", "quai (de gare)", "where you board the train"],
      ["fare", "prix du trajet", "price of a journey"],
      ["delay", "retard", "when something is late"],
      ["customs", "douane", "border control for goods"],
      ["boarding pass", "carte d'embarquement", "document to board a plane"],
      ["timetable", "horaires", "schedule of departures"],
      ["roundabout", "rond-point", "circular road junction"],
      ["the Underground", "le métro (Londres)", "the Tube, London's metro"],
      ["left luggage", "consigne à bagages", "place to store bags"],
      ["fortnight", "quinzaine (deux semaines)", "two weeks"],
    ]),
    T("food", { fr: "À table", en: "Food & dining" }, [
      ["starter", "entrée", "first course"],
      ["main course", "plat principal", "principal dish"],
      ["the bill", "l'addition", "what you pay at the end"],
      ["tap water", "eau du robinet", "free water, not bottled"],
      ["still water", "eau plate", "non-sparkling water"],
      ["takeaway", "à emporter", "food you take home"],
      ["crisps", "chips (en sachet)", "thin fried potato slices"],
      ["chips", "frites", "fried potato sticks (UK)"],
      ["biscuit", "petit gâteau sec", "sweet baked snack (US: cookie)"],
      ["cutlery", "couverts", "knives, forks and spoons"],
      ["medium-rare", "à point (rosé)", "steak cooked slightly pink"],
      ["free-range", "élevé en plein air", "from animals kept outdoors"],
    ]),
    T("business", { fr: "Affaires", en: "Business" }, [
      ["meeting", "réunion", "people gathering to discuss"],
      ["deadline", "échéance / date butoir", "latest time to finish"],
      ["quote", "devis", "estimated price in writing"],
      ["invoice", "facture", "bill for payment"],
      ["staff", "personnel", "the employees"],
      ["skill", "compétence", "ability to do something well"],
      ["target", "objectif", "goal to reach"],
      ["branch", "succursale / agence", "local office of a company"],
      ["deal", "accord / marché", "business agreement"],
      ["schedule", "planning", "plan of times and dates"],
      ["stakeholder", "partie prenante", "person with an interest in a project"],
      ["asset", "atout / actif", "something valuable"],
    ]),
    T("city", { fr: "En ville", en: "Around town" }, [
      ["pavement", "trottoir", "footpath beside the road (US: sidewalk)"],
      ["high street", "rue commerçante", "main shopping street"],
      ["queue", "file d'attente", "line of waiting people"],
      ["zebra crossing", "passage piéton", "striped pedestrian crossing"],
      ["flat", "appartement", "apartment"],
      ["landlord", "propriétaire (bailleur)", "owner who rents out a home"],
      ["council", "municipalité", "local government"],
      ["bin", "poubelle", "rubbish container"],
      ["charity shop", "boutique solidaire", "shop selling donated goods"],
      ["off-licence", "caviste / vente à emporter", "shop selling alcohol to take away"],
      ["leaflet", "prospectus", "small printed sheet of information"],
      ["borough", "arrondissement", "district of a large city"],
    ]),
    T("emergency", { fr: "Urgences", en: "Emergency" }, [
      ["injury", "blessure", "physical harm"],
      ["A&E", "les urgences (hôpital)", "Accident & Emergency department"],
      ["chemist's", "pharmacie", "pharmacy (UK)"],
      ["prescription", "ordonnance", "doctor's written order for medicine"],
      ["plaster", "pansement", "small dressing for a cut (US: band-aid)"],
      ["painkiller", "antidouleur", "medicine against pain"],
      ["theft", "vol (délit)", "crime of stealing"],
      ["witness", "témoin", "person who saw what happened"],
      ["statement", "déposition", "formal account given to police"],
      ["breakdown", "panne", "when a vehicle stops working"],
      ["insurance", "assurance", "protection contract against loss"],
      ["helpline", "numéro d'assistance", "phone service for help"],
    ]),
    T("feelings", { fr: "Sentiments", en: "Feelings" }, [
      ["upset", "bouleversé / contrarié", "unhappy and worried"],
      ["knackered", "épuisé (fam.)", "extremely tired (informal)"],
      ["relieved", "soulagé", "happy that worry has gone"],
      ["awkward", "gêné / embarrassant", "uncomfortable, embarrassing"],
      ["confident", "sûr de soi", "believing in oneself"],
      ["grateful", "reconnaissant", "feeling thankful"],
      ["annoyed", "agacé", "slightly angry"],
      ["bewildered", "déconcerté", "very confused"],
      ["eager", "impatient (enthousiaste)", "wanting very much to do"],
      ["ashamed", "honteux", "feeling shame"],
      ["fond of", "attaché à", "liking very much"],
      ["gutted", "dégoûté / effondré (fam.)", "very disappointed (informal)"],
    ]),
    T("tech", { fr: "Technologie & médias", en: "Tech & media" }, [
      ["device", "appareil", "piece of equipment"],
      ["screen", "écran", "display surface"],
      ["password", "mot de passe", "secret word for access"],
      ["update", "mise à jour", "newer version"],
      ["charger", "chargeur", "device that charges a battery"],
      ["plug", "prise (fiche)", "connector for electricity"],
      ["socket", "prise murale", "wall outlet"],
      ["wireless", "sans fil", "without cables"],
      ["headline", "gros titre", "title of a news story"],
      ["broadcast", "émission / diffuser", "programme sent on radio or TV"],
      ["browser", "navigateur", "program for visiting websites"],
      ["network", "réseau", "connected system"],
    ]),
    T("time", { fr: "Le temps", en: "Time" }, [
      ["dawn", "aube", "first light of day"],
      ["dusk", "crépuscule", "time just after sunset"],
      ["weekday", "jour de semaine", "Monday to Friday"],
      ["bank holiday", "jour férié", "public holiday (UK)"],
      ["quarter past", "et quart", "fifteen minutes after the hour"],
      ["half past", "et demie", "thirty minutes after the hour"],
      ["due", "attendu / prévu", "expected at a time"],
      ["seldom", "rarement", "not often"],
      ["twice", "deux fois", "two times"],
      ["decade", "décennie", "ten years"],
      ["century", "siècle", "one hundred years"],
      ["the day after tomorrow", "après-demain", "two days from now"],
    ]),
  ] };
})();
