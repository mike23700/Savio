import type { Bundle } from "..";

const fr: Record<string, string> = {
  "nourrir.form.erreurGenerique": "Une erreur est survenue, veuillez réessayer.",
  "nourrir.form.selectionner": "Sélectionner...",

  "nourrir.hub.titre": "Se Nourrir",
  "nourrir.hub.sousTitre": "Formation, prière et ressources pour votre croissance spirituelle",
  "nourrir.hub.surtitre": "FORMATION",
  "nourrir.hub.titre2": "Grandir dans la foi",
  "nourrir.hub.intro":
    "Ressources spirituelles, formations et publications pour nourrir votre vie intérieure.",
  "nourrir.hub.decouvrir": "Découvrir",
  "nourrir.hub.quote":
    "\"Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés.\"",
  "nourrir.hub.quoteRef": "— Matthieu 5,6",
  "nourrir.hub.card.lectures.titre": "Lectures du jour",
  "nourrir.hub.card.lectures.desc":
    "Les textes de la messe de chaque jour : première lecture, psaume, deuxième lecture et Évangile.",
  "nourrir.hub.card.catechese.titre": "Catéchèse",
  "nourrir.hub.card.catechese.desc":
    "Formation dans la foi pour tous les âges : éveil à la foi, 1ère, 2e, 3e année, préparation au mariage.",
  "nourrir.hub.card.priere.titre": "Prière & Méditation",
  "nourrir.hub.card.priere.desc":
    "Adoration eucharistique, chapelet, adoration nocturne, groupes de prière et Lectio Divina.",
  "nourrir.hub.card.journal.titre": "Journal paroissial",
  "nourrir.hub.card.journal.desc":
    "La Voix de Dominique Savio : lectures du jour, annonces, résumé des quêtes. Abonnement dès 500 FCFA/mois.",

  "nourrir.catechese.titre": "Catéchèse",
  "nourrir.catechese.sousTitre": "Formation dans la foi pour tous les âges",
  "nourrir.catechese.surtitre": "FORMATION",
  "nourrir.catechese.niveauxTitre": "Niveaux de catéchèse",
  "nourrir.catechese.niveauxIntro":
    "Notre programme de catéchèse accompagne les enfants, les jeunes et les adultes dans leur cheminement de foi.",
  "nourrir.catechese.duree": "Durée : {duree}",
  "nourrir.catechese.inscriptionSurtitre": "INSCRIPTION 2026-2027",
  "nourrir.catechese.inscriptionsOuvertes": "Inscriptions ouvertes",
  "nourrir.catechese.succesTitre": "Inscription enregistrée !",
  "nourrir.catechese.succesTexte":
    "Nous vous contacterons pour confirmer l'inscription et vous communiquer le calendrier.",
  "nourrir.catechese.nouvelleInscription": "Nouvelle inscription",
  "nourrir.catechese.nom": "Nom *",
  "nourrir.catechese.nomPlaceholder": "Nom",
  "nourrir.catechese.prenom": "Prénom(s) *",
  "nourrir.catechese.prenomPlaceholder": "Prénom",
  "nourrir.catechese.email": "Email",
  "nourrir.catechese.emailPlaceholder": "votre@email.com",
  "nourrir.catechese.telephone": "Téléphone *",
  "nourrir.catechese.telephonePlaceholder": "(+237) 6XX XXX XXX",
  "nourrir.catechese.age": "Âge de l'enfant (ou \"adulte\") *",
  "nourrir.catechese.agePlaceholder": "Ex: 8 ans, Adulte",
  "nourrir.catechese.niveau": "Niveau souhaité *",
  "nourrir.catechese.selectionnerNiveau": "Sélectionner un niveau...",
  "nourrir.catechese.envoyer": "S'inscrire à la catéchèse",

  "nourrir.priere.titre": "Prière & Méditation",
  "nourrir.priere.sousTitre": "Nourrir sa foi par la prière quotidienne",
  "nourrir.priere.surtitre": "VIE SPIRITUELLE",
  "nourrir.priere.tempsTitre": "Temps de prière à la paroisse",
  "nourrir.priere.quote":
    "\"Veillez et priez, afin de ne pas entrer en tentation. L'esprit est ardent, mais la chair est faible.\"",
  "nourrir.priere.quoteRef": "— Matthieu 26,41",

  "nourrir.journal.titre": "La Voix de Dominique Savio",
  "nourrir.journal.nom": "Journal paroissial",
  "nourrir.journal.sousTitre": "Notre journal paroissial hebdomadaire",
  "nourrir.journal.surtitre": "NOTRE JOURNAL",
  "nourrir.journal.intro":
    "Notre journal paroissial hebdomadaire vous tient informé de la vie de notre communauté. Au programme : lectures du jour, annonces paroissiales, résumé des quêtes et actualités de la paroisse.",
  "nourrir.journal.tarifsSurtitre": "TARIFS D'ABONNEMENT",
  "nourrir.journal.tarifDetails": "{issues} numéros · {period}",
  "nourrir.journal.formatAvant": "Disponible en format",
  "nourrir.journal.formatElectronique": "Électronique",
  "nourrir.journal.formatMilieu": "(PDF par email) ou",
  "nourrir.journal.formatPapier": "Papier",
  "nourrir.journal.formatApres": "(récupérer à la paroisse)",
  "nourrir.journal.abonnerTitre": "S'abonner au journal",
  "nourrir.journal.connexionTitre": "Connexion requise",
  "nourrir.journal.connexionTexte":
    "Connectez-vous ou créez un compte pour vous abonner au journal paroissial.",
  "nourrir.journal.seConnecter": "Se connecter",
  "nourrir.journal.succesTitre": "Abonnement enregistré !",
  "nourrir.journal.succesTexte":
    "Retrouvez votre abonnement dans votre espace membre, onglet « Journal paroissial ».",
  "nourrir.journal.voirEspace": "Voir mon espace membre",
  "nourrir.journal.formule": "Formule *",
  "nourrir.journal.format": "Format *",
  "nourrir.journal.optionElectronique": "Électronique (PDF par email)",
  "nourrir.journal.optionPapier": "Papier (récupérer à la paroisse)",
  "nourrir.journal.envoyer": "S'abonner au journal",
  "nourrir.journal.programme.1": "Lectures du jour commentées",
  "nourrir.journal.programme.2": "Annonces et activités paroissiales",
  "nourrir.journal.programme.3": "Résumé des quêtes et collectes",
  "nourrir.journal.programme.4": "Agenda liturgique de la semaine",

  "nourrir.lectures.titre": "Lectures du jour",
  "nourrir.lectures.sousTitre": "La Parole de Dieu proclamée à la messe",
  "nourrir.lectures.veille": "Veille",
  "nourrir.lectures.lendemain": "Lendemain",
  "nourrir.lectures.choisirDate": "Choisir une date",
  "nourrir.lectures.aujourdhui": "Aujourd'hui",
  "nourrir.lectures.couleurLiturgique": "Couleur liturgique : {color}",
  "nourrir.lectures.chargement": "Chargement des lectures…",
  "nourrir.lectures.texteIndisponible":
    "Le texte intégral de ces lectures n'est pas encore disponible.",
  "nourrir.lectures.indisponibles": "Lectures indisponibles pour ce jour pour le moment.",
  "nourrir.lectures.ecouterHomelie": "Écouter l'homélie",
  "nourrir.lectures.messes": "Horaires des messes",
  "nourrir.lectures.sourceAelf":
    "Textes liturgiques © AELF — calendrier liturgique d'Afrique.",

  "nourrir.homelies.titre": "Homélies",
  "nourrir.homelies.sousTitre": "Retrouvez les homélies dominicales de notre paroisse",
  "nourrir.homelies.rechercherPlaceholder": "Rechercher une homélie...",
  "nourrir.homelies.derniere": "DERNIÈRE HOMÉLIE",
  "nourrir.homelies.ecouter": "Écouter l'homélie",
  "nourrir.homelies.ecouterCourt": "Écouter",
  "nourrir.homelies.favori": "Ajouter aux favoris",
  "nourrir.homelies.audioNonSupporte": "Votre navigateur ne supporte pas la lecture audio.",
  "nourrir.homelies.telechargerPdf": "Télécharger le PDF",
  "nourrir.homelies.pdfIndisponible": "PDF indisponible",
};

const en: Record<string, string> = {
  "nourrir.form.erreurGenerique": "An error occurred, please try again.",
  "nourrir.form.selectionner": "Select...",

  "nourrir.hub.titre": "Feed on the Word",
  "nourrir.hub.sousTitre": "Formation, prayer and resources for your spiritual growth",
  "nourrir.hub.surtitre": "FORMATION",
  "nourrir.hub.titre2": "Growing in the faith",
  "nourrir.hub.intro":
    "Spiritual resources, courses and publications to nourish your inner life.",
  "nourrir.hub.decouvrir": "Discover",
  "nourrir.hub.quote":
    "\"Blessed are those who hunger and thirst for righteousness, for they shall be satisfied.\"",
  "nourrir.hub.quoteRef": "— Matthew 5,6",
  "nourrir.hub.card.lectures.titre": "Daily Readings",
  "nourrir.hub.card.lectures.desc":
    "The texts of every day’s Mass: first reading, psalm, second reading and Gospel.",
  "nourrir.hub.card.catechese.titre": "Catechism",
  "nourrir.hub.card.catechese.desc":
    "Faith formation for all ages: awakening to faith, 1st, 2nd and 3rd year, and preparation for marriage.",
  "nourrir.hub.card.priere.titre": "Prayer & Meditation",
  "nourrir.hub.card.priere.desc":
    "Eucharistic adoration, the Rosary, night vigils, prayer groups and Lectio Divina.",
  "nourrir.hub.card.journal.titre": "Parish Journal",
  "nourrir.hub.card.journal.desc":
    "The Voice of Dominic Savio: daily readings, announcements, collection summary. Subscription from 500 FCFA/month.",

  "nourrir.catechese.titre": "Catechism",
  "nourrir.catechese.sousTitre": "Faith formation for all ages",
  "nourrir.catechese.surtitre": "FORMATION",
  "nourrir.catechese.niveauxTitre": "Catechism levels",
  "nourrir.catechese.niveauxIntro":
    "Our catechism programme accompanies children, teenagers and adults on their faith journey.",
  "nourrir.catechese.duree": "Duration: {duree}",
  "nourrir.catechese.inscriptionSurtitre": "REGISTRATION 2026-2027",
  "nourrir.catechese.inscriptionsOuvertes": "Registration is open",
  "nourrir.catechese.succesTitre": "Registration recorded!",
  "nourrir.catechese.succesTexte":
    "We will contact you to confirm the registration and to send you the schedule.",
  "nourrir.catechese.nouvelleInscription": "New registration",
  "nourrir.catechese.nom": "Last name *",
  "nourrir.catechese.nomPlaceholder": "Last name",
  "nourrir.catechese.prenom": "First name(s) *",
  "nourrir.catechese.prenomPlaceholder": "First name",
  "nourrir.catechese.email": "Email",
  "nourrir.catechese.emailPlaceholder": "your@email.com",
  "nourrir.catechese.telephone": "Phone *",
  "nourrir.catechese.telephonePlaceholder": "(+237) 6XX XXX XXX",
  "nourrir.catechese.age": "Child’s age (or \"adult\") *",
  "nourrir.catechese.agePlaceholder": "E.g.: 8 years old, Adult",
  "nourrir.catechese.niveau": "Preferred level *",
  "nourrir.catechese.selectionnerNiveau": "Select a level...",
  "nourrir.catechese.envoyer": "Sign up for catechism",

  "nourrir.priere.titre": "Prayer & Meditation",
  "nourrir.priere.sousTitre": "Nourish your faith through daily prayer",
  "nourrir.priere.surtitre": "SPIRITUAL LIFE",
  "nourrir.priere.tempsTitre": "Prayer times at the parish",
  "nourrir.priere.quote":
    "\"Watch and pray, so that you do not fall into temptation. The spirit is willing, but the flesh is weak.\"",
  "nourrir.priere.quoteRef": "— Matthew 26,41",

  "nourrir.journal.titre": "The Voice of Dominic Savio",
  "nourrir.journal.nom": "Parish Journal",
  "nourrir.journal.sousTitre": "Our weekly parish journal",
  "nourrir.journal.surtitre": "OUR JOURNAL",
  "nourrir.journal.intro":
    "Our weekly parish journal keeps you informed about the life of our community. On the programme: daily readings, parish announcements, collection summary and parish news.",
  "nourrir.journal.tarifsSurtitre": "SUBSCRIPTION RATES",
  "nourrir.journal.tarifDetails": "{issues} issues · {period}",
  "nourrir.journal.formatAvant": "Available as",
  "nourrir.journal.formatElectronique": "Electronic",
  "nourrir.journal.formatMilieu": "(PDF by email) or",
  "nourrir.journal.formatPapier": "Print",
  "nourrir.journal.formatApres": "(collected at the parish office)",
  "nourrir.journal.abonnerTitre": "Subscribe to the journal",
  "nourrir.journal.connexionTitre": "Sign in required",
  "nourrir.journal.connexionTexte":
    "Sign in or create an account to subscribe to the parish journal.",
  "nourrir.journal.seConnecter": "Sign in",
  "nourrir.journal.succesTitre": "Subscription recorded!",
  "nourrir.journal.succesTexte":
    "You will find your subscription in your member area, under the “Parish Journal” tab.",
  "nourrir.journal.voirEspace": "View my member area",
  "nourrir.journal.formule": "Plan *",
  "nourrir.journal.format": "Format *",
  "nourrir.journal.optionElectronique": "Electronic (PDF by email)",
  "nourrir.journal.optionPapier": "Print (collected at the parish office)",
  "nourrir.journal.envoyer": "Subscribe to the journal",
  "nourrir.journal.programme.1": "Commented daily readings",
  "nourrir.journal.programme.2": "Parish announcements and activities",
  "nourrir.journal.programme.3": "Summary of collections and offerings",
  "nourrir.journal.programme.4": "Weekly liturgical agenda",

  "nourrir.lectures.titre": "Daily Readings",
  "nourrir.lectures.sousTitre": "The Word of God proclaimed at Mass",
  "nourrir.lectures.veille": "Eve of",
  "nourrir.lectures.lendemain": "Day after",
  "nourrir.lectures.choisirDate": "Choose a date",
  "nourrir.lectures.aujourdhui": "Today",
  "nourrir.lectures.couleurLiturgique": "Liturgical colour: {color}",
  "nourrir.lectures.chargement": "Loading the readings…",
  "nourrir.lectures.texteIndisponible":
    "The full text of these readings is not available yet.",
  "nourrir.lectures.indisponibles": "Readings are currently unavailable for this day.",
  "nourrir.lectures.ecouterHomelie": "Listen to the homily",
  "nourrir.lectures.messes": "Mass Schedule",
  "nourrir.lectures.sourceAelf":
    "Liturgical texts © AELF — African liturgical calendar.",

  "nourrir.homelies.titre": "Homilies",
  "nourrir.homelies.sousTitre": "Find the Sunday homilies of our parish",
  "nourrir.homelies.rechercherPlaceholder": "Search a homily...",
  "nourrir.homelies.derniere": "LATEST HOMILY",
  "nourrir.homelies.ecouter": "Listen to the homily",
  "nourrir.homelies.ecouterCourt": "Listen",
  "nourrir.homelies.favori": "Add to favourites",
  "nourrir.homelies.audioNonSupporte": "Your browser does not support audio playback.",
  "nourrir.homelies.telechargerPdf": "Download the PDF",
  "nourrir.homelies.pdfIndisponible": "PDF unavailable",
};

export default { fr, en } satisfies Bundle;
