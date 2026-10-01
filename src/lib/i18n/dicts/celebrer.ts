import type { Bundle } from "..";

const fr: Record<string, string> = {
  "celebrer.form.nom": "Nom *",
  "celebrer.form.nomPlaceholder": "Nom",
  "celebrer.form.prenom": "Prénom *",
  "celebrer.form.prenomPlaceholder": "Prénom",
  "celebrer.form.age": "Âge *",
  "celebrer.form.agePlaceholder": "Âge",
  "celebrer.form.email": "Email",
  "celebrer.form.emailPlaceholder": "votre@email.com",
  "celebrer.form.telephone": "Téléphone *",
  "celebrer.form.telephonePlaceholder": "(+237) 6XX XXX XXX",
  "celebrer.form.erreurGenerique": "Une erreur est survenue, veuillez réessayer.",

  "celebrer.hub.titre": "Célébrer",
  "celebrer.hub.sousTitre": "Les sacrements et célébrations de notre communauté",
  "celebrer.hub.surtitre": "LITURGIE",
  "celebrer.hub.titre2": "Tout pour célébrer",
  "celebrer.hub.intro": "Messes, sacrements, intentions et ressources liturgiques pour nourrir votre foi.",
  "celebrer.hub.decouvrir": "Découvrir",
  "celebrer.hub.card.messes.titre": "Horaires des messes",
  "celebrer.hub.card.messes.desc":
    "Messes quotidiennes, dominicales, des malades et célébrations spéciales avec lectures du jour.",
  "celebrer.hub.card.sacrements.titre": "Sacrements",
  "celebrer.hub.card.sacrements.desc":
    "Baptême, mariage, confirmation, eucharistie, réconciliation et onction des malades.",
  "celebrer.hub.card.intention.titre": "Intention de messe",
  "celebrer.hub.card.intention.desc":
    "Faites célébrer une messe pour vos intentions : défunts, malades, action de grâce. (3 000 FCFA)",
  "celebrer.hub.card.bans.titre": "Publication des bans",
  "celebrer.hub.card.bans.desc":
    "Préparez votre mariage à l’Église. Documents requis et formulaire de demande.",
  "celebrer.hub.card.homelies.titre": "Homélies",
  "celebrer.hub.card.homelies.desc":
    "Écoutez ou relisez les homélies du Père Curé et de l’équipe pastorale.",
  "celebrer.hub.card.agenda.titre": "Agenda liturgique",
  "celebrer.hub.card.agenda.desc":
    "Calendrier des célébrations, fêtes, événements et temps forts de l’année liturgique.",

  "celebrer.messes.titre": "Horaires des messes",
  "celebrer.messes.sousTitre": "Rejoignez-nous pour célébrer l’Eucharistie",
  "celebrer.messes.aujourdhui": "AUJOURD’HUI · {date}",
  "celebrer.messes.aucuneCelebration":
    "Aucune célébration programmée aujourd’hui. Retrouvez les horaires hebdomadaires ci-dessous.",
  "celebrer.messes.programmeJour": "Programme du jour",
  "celebrer.messes.lecturesTitre": "LECTURES DU JOUR",
  "celebrer.messes.lecturesVides": "Les lectures du jour seront publiées prochainement.",
  "celebrer.messes.lireTextes": "Lire les textes",
  "celebrer.messes.ecouterHomelie": "Écouter l’homélie",
  "celebrer.messes.surtitre": "CÉLÉBRATIONS",
  "celebrer.messes.lieuTitre": "Lieu des célébrations",
  "celebrer.messes.lieuTexte":
    "Rue de la Messe Bonadoumbé, Douala · Toutes nos messes se déroulent dans l’église principale.",
  "celebrer.messes.voirCarte": "Voir sur la carte",
  "celebrer.messes.bulletinCarte": "Téléchargement du bulletin PDF…",
  "celebrer.messes.bulletinPdf": "Bulletin PDF",

  "celebrer.sacrements.titre": "Sacrements",
  "celebrer.sacrements.titrePage": "Les Sacrements",
  "celebrer.sacrements.sousTitre": "Les signes efficaces de la grâce de Dieu",
  "celebrer.sacrements.surtitre": "SACREMENTS DE L’ÉGLISE",
  "celebrer.sacrements.titre2": "Les sept sacrements",
  "celebrer.sacrements.intro":
    "Les sacrements sont des signes efficaces de la grâce de Dieu. Cliquez sur un sacrement pour en savoir plus.",
  "celebrer.sacrements.enSavoirPlus": "En savoir plus",
  "celebrer.sacrements.introuvable": "Sacrement introuvable",
  "celebrer.sacrements.retour": "Retour aux sacrements",
  "celebrer.sacrements.informations": "INFORMATIONS PRATIQUES",
  "celebrer.sacrements.contacterSecretariat": "Contacter le secrétariat",

  "celebrer.intention.titre": "Intention de messe",
  "celebrer.intention.sousTitre": "Faites célébrer une messe pour vos intentions",
  "celebrer.intention.offrandeTitre": "Offrande de messe",
  "celebrer.intention.offrandeAvant": "L’offrande pour une intention de messe est de",
  "celebrer.intention.offrandeApres":
    "Elle peut être déposée au secrétariat paroissial ou remise au prêtre.",
  "celebrer.intention.recueTitre": "Intention reçue !",
  "celebrer.intention.recueTexte":
    "Votre intention de messe a bien été transmise au secrétariat. Nous vous contacterons pour confirmer la date.",
  "celebrer.intention.nouvelle": "Nouvelle intention",
  "celebrer.intention.nomPlaceholder": "Votre nom",
  "celebrer.intention.prenomLabel": "Prénom(s) *",
  "celebrer.intention.prenomPlaceholder": "Votre prénom",
  "celebrer.intention.description": "Description de l’intention *",
  "celebrer.intention.descriptionPlaceholder":
    "Ex: Pour le repos de l’âme de…, Pour la guérison de…, En action de grâce pour…",
  "celebrer.intention.dateSouhaitee": "Date souhaitée",
  "celebrer.intention.messeSouhaitee": "Messe souhaitée *",
  "celebrer.intention.chargement": "Chargement des messes de ce jour…",
  "celebrer.intention.aucuneMesse":
    "Aucune messe n’est programmée ce jour-là. Choisissez une autre date, ou laissez-la telle quelle : le secrétariat vous proposera une messe.",
  "celebrer.intention.erreurMesse":
    "Veuillez choisir la messe à laquelle votre intention sera portée.",
  "celebrer.intention.envoyer": "Envoyer mon intention",

  "celebrer.bans.titre": "Publication des bans",
  "celebrer.bans.sousTitre": "Démarches pour le sacrement du mariage",
  "celebrer.bans.surtitre": "MARIAGE CATHOLIQUE",
  "celebrer.bans.definition": "Qu’est-ce que la publication des bans ?",
  "celebrer.bans.definitionTexte":
    "La publication des bans est une annonce officielle d’un mariage prochain, faite à la communauté paroissiale. Elle est obligatoire dans l’Église catholique et permet à tout fidèle qui connaîtrait un empêchement au mariage de le signaler. Les bans sont publiés trois dimanches consécutifs avant la date du mariage.",
  "celebrer.bans.documentsTitre": "DOCUMENTS REQUIS",
  "celebrer.bans.doc1": "Acte de baptême récent (moins de 6 mois) pour les deux fiancés",
  "celebrer.bans.doc2": "Acte de naissance des deux fiancés",
  "celebrer.bans.doc3": "Carte nationale d’identité des deux fiancés",
  "celebrer.bans.doc4": "Certificat de confirmation des deux fiancés",
  "celebrer.bans.doc5": "Attestation de célibat ou de liberté matrimoniale",
  "celebrer.bans.doc6": "2 photos d’identité de chaque fiancé",
  "celebrer.bans.doc7": "Attestation de suivi de la préparation au mariage",
  "celebrer.bans.doc8": "Lettre de demande adressée au curé",
  "celebrer.bans.envoyeeTitre": "Demande enregistrée !",
  "celebrer.bans.envoyeeTexte":
    "Votre demande de publication des bans a été reçue. Le secrétariat vous contactera dans les plus brefs délais.",
  "celebrer.bans.nouvelleDemande": "Nouvelle demande",
  "celebrer.bans.formulaireTitre": "Formulaire de demande",
  "celebrer.bans.contactPrincipal": "CONTACT PRINCIPAL",
  "celebrer.bans.fiance": "FIANCÉ",
  "celebrer.bans.fiancee": "FIANCÉE",
  "celebrer.bans.soumettre": "Soumettre la demande",
};

const en: Record<string, string> = {
  "celebrer.form.nom": "Last name *",
  "celebrer.form.nomPlaceholder": "Last name",
  "celebrer.form.prenom": "First name *",
  "celebrer.form.prenomPlaceholder": "First name",
  "celebrer.form.age": "Age *",
  "celebrer.form.agePlaceholder": "Age",
  "celebrer.form.email": "Email",
  "celebrer.form.emailPlaceholder": "your@email.com",
  "celebrer.form.telephone": "Phone *",
  "celebrer.form.telephonePlaceholder": "(+237) 6XX XXX XXX",
  "celebrer.form.erreurGenerique": "An error occurred, please try again.",

  "celebrer.hub.titre": "Celebrations",
  "celebrer.hub.sousTitre": "The sacraments and celebrations of our community",
  "celebrer.hub.surtitre": "LITURGY",
  "celebrer.hub.titre2": "Everything for celebrating",
  "celebrer.hub.intro": "Masses, sacraments, intentions and liturgical resources to nourish your faith.",
  "celebrer.hub.decouvrir": "Discover",
  "celebrer.hub.card.messes.titre": "Mass Schedule",
  "celebrer.hub.card.messes.desc":
    "Weekday, Sunday and sick masses, plus special celebrations with the daily readings.",
  "celebrer.hub.card.sacrements.titre": "Sacraments",
  "celebrer.hub.card.sacrements.desc":
    "Baptism, marriage, confirmation, Eucharist, reconciliation and anointing of the sick.",
  "celebrer.hub.card.intention.titre": "Mass Intention",
  "celebrer.hub.card.intention.desc":
    "Have a Mass offered for your intentions: the deceased, the sick, thanksgiving. (3,000 FCFA)",
  "celebrer.hub.card.bans.titre": "Publishing of Bans",
  "celebrer.hub.card.bans.desc":
    "Prepare for your wedding at the Church. Required documents and application form.",
  "celebrer.hub.card.homelies.titre": "Homilies",
  "celebrer.hub.card.homelies.desc":
    "Listen to or read the homilies of the parish priest and the pastoral team.",
  "celebrer.hub.card.agenda.titre": "Liturgical Agenda",
  "celebrer.hub.card.agenda.desc":
    "Calendar of celebrations, feasts, events and key moments of the liturgical year.",

  "celebrer.messes.titre": "Mass Schedule",
  "celebrer.messes.sousTitre": "Join us to celebrate the Eucharist",
  "celebrer.messes.aujourdhui": "TODAY · {date}",
  "celebrer.messes.aucuneCelebration":
    "No celebration is scheduled today. The weekly times are listed below.",
  "celebrer.messes.programmeJour": "Today’s schedule",
  "celebrer.messes.lecturesTitre": "READINGS OF THE DAY",
  "celebrer.messes.lecturesVides": "The readings of the day will be published soon.",
  "celebrer.messes.lireTextes": "Read the texts",
  "celebrer.messes.ecouterHomelie": "Listen to the homily",
  "celebrer.messes.surtitre": "CELEBRATIONS",
  "celebrer.messes.lieuTitre": "Venue of the celebrations",
  "celebrer.messes.lieuTexte":
    "Rue de la Messe Bonadoumbé, Douala · All our Masses take place in the main church.",
  "celebrer.messes.voirCarte": "View on the map",
  "celebrer.messes.bulletinCarte": "Downloading the PDF bulletin…",
  "celebrer.messes.bulletinPdf": "PDF bulletin",

  "celebrer.sacrements.titre": "Sacraments",
  "celebrer.sacrements.titrePage": "The Sacraments",
  "celebrer.sacrements.sousTitre": "The effective signs of God’s grace",
  "celebrer.sacrements.surtitre": "THE SACRAMENTS OF THE CHURCH",
  "celebrer.sacrements.titre2": "The seven sacraments",
  "celebrer.sacrements.intro":
    "The sacraments are the effective signs of God’s grace. Click on a sacrament to learn more.",
  "celebrer.sacrements.enSavoirPlus": "Learn more",
  "celebrer.sacrements.introuvable": "Sacrament not found",
  "celebrer.sacrements.retour": "Back to the sacraments",
  "celebrer.sacrements.informations": "PRACTICAL INFORMATION",
  "celebrer.sacrements.contacterSecretariat": "Contact the parish office",

  "celebrer.intention.titre": "Mass Intention",
  "celebrer.intention.sousTitre": "Have a Mass offered for your intentions",
  "celebrer.intention.offrandeTitre": "Mass offering",
  "celebrer.intention.offrandeAvant": "The offering for a Mass intention is",
  "celebrer.intention.offrandeApres":
    "It can be handed in at the parish office or given to the priest.",
  "celebrer.intention.recueTitre": "Intention received!",
  "celebrer.intention.recueTexte":
    "Your Mass intention has been sent to the parish office. We will contact you to confirm the date.",
  "celebrer.intention.nouvelle": "New intention",
  "celebrer.intention.nomPlaceholder": "Your last name",
  "celebrer.intention.prenomLabel": "First name(s) *",
  "celebrer.intention.prenomPlaceholder": "Your first name",
  "celebrer.intention.description": "Intention description *",
  "celebrer.intention.descriptionPlaceholder":
    "E.g.: For the repose of the soul of…, For the healing of…, In thanksgiving for…",
  "celebrer.intention.dateSouhaitee": "Preferred date",
  "celebrer.intention.messeSouhaitee": "Preferred Mass *",
  "celebrer.intention.chargement": "Loading the Masses of that day…",
  "celebrer.intention.aucuneMesse":
    "No Mass is scheduled on that day. Choose another date, or leave it as is: the parish office will suggest a Mass.",
  "celebrer.intention.erreurMesse":
    "Please choose the Mass at which your intention will be offered.",
  "celebrer.intention.envoyer": "Send my intention",

  "celebrer.bans.titre": "Publishing of Bans",
  "celebrer.bans.sousTitre": "Steps for the sacrament of marriage",
  "celebrer.bans.surtitre": "CATHOLIC MARRIAGE",
  "celebrer.bans.definition": "What is the publishing of bans?",
  "celebrer.bans.definitionTexte":
    "The publishing of bans is the official announcement of an upcoming marriage, made to the parish community. It is obligatory in the Catholic Church and allows any faithful person who knows of an impediment to the marriage to report it. The bans are published on three consecutive Sundays before the wedding date.",
  "celebrer.bans.documentsTitre": "REQUIRED DOCUMENTS",
  "celebrer.bans.doc1": "Recent baptismal certificate (less than 6 months old) for both partners",
  "celebrer.bans.doc2": "Birth certificate of both partners",
  "celebrer.bans.doc3": "National identity card of both partners",
  "celebrer.bans.doc4": "Confirmation certificate of both partners",
  "celebrer.bans.doc5": "Certificate of celibacy or of matrimonial freedom",
  "celebrer.bans.doc6": "2 passport photos of each partner",
  "celebrer.bans.doc7": "Certificate of attendance at marriage preparation",
  "celebrer.bans.doc8": "Application letter addressed to the parish priest",
  "celebrer.bans.envoyeeTitre": "Request recorded!",
  "celebrer.bans.envoyeeTexte":
    "Your request for the publishing of bans has been received. The parish office will contact you as soon as possible.",
  "celebrer.bans.nouvelleDemande": "New request",
  "celebrer.bans.formulaireTitre": "Request form",
  "celebrer.bans.contactPrincipal": "MAIN CONTACT",
  "celebrer.bans.fiance": "GROOM",
  "celebrer.bans.fiancee": "BRIDE",
  "celebrer.bans.soumettre": "Submit the request",
};

export default { fr, en } satisfies Bundle;