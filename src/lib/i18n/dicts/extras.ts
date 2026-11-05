import type { Bundle } from ".."

/** Keys added for the November 2026 batch (agenda, forms, readings, shop, music…). */
const fr: Record<string, string> = {
  // Agenda
  "extra.agenda.enCours": "En cours",
  "extra.agenda.du": "Du",
  "extra.agenda.au": "au",
  "extra.agenda.jusquau": "jusqu'au",
  "extra.agenda.voirPlus": "Voir plus d'événements passés",
  "extra.agenda.aucunPasse": "Aucun événement passé pour cette catégorie.",

  // Formulaire de demande (sacrements, bans)
  "extra.form.titre": "Formulaire de demande",
  "extra.form.infosPerso": "Informations personnelles",
  "extra.form.infosPersoDesc": "Renseignez vos informations personnelles.",
  "extra.form.personnes": "Personnes concernées",
  "extra.form.personnesDesc": "Ajoutez les informations sur les personnes concernées",
  "extra.form.nom": "Nom(s)",
  "extra.form.prenom": "Prénom(s)",
  "extra.form.email": "Email",
  "extra.form.telephone": "Téléphone",
  "extra.form.age": "Âge",
  "extra.form.sacrement": "Sacrement demandé",
  "extra.form.choisir": "Choisissez…",
  "extra.form.message": "Message (facultatif)",
  "extra.form.envoyer": "Envoyer",
  "extra.form.envoi": "Envoi…",
  "extra.form.ajouter": "Ajouter une personne",
  "extra.form.retirer": "Retirer la dernière personne",
  "extra.form.succes": "Votre demande a bien été envoyée. Le secrétariat vous recontactera.",
  "extra.form.erreur": "Une erreur est survenue, veuillez réessayer.",
  "extra.form.messe": "Messe",
  "extra.form.messeDesc": "Informations sur la messe demandée",
  "extra.form.intentionTexte": "Décrivez l'intention de la messe",
  "extra.form.date": "Date",
  "extra.form.heure": "Heure",
  "extra.form.selectDate": "Sélectionnez une date",
  "extra.form.aucuneMesse": "Aucune messe ce jour-là",
  "extra.form.fiances": "Les fiancés",
  "extra.form.fiancesDesc": "Informations sur les futurs époux",
  "extra.form.fiance": "Fiancé",
  "extra.form.fiancee": "Fiancée",
  "extra.form.dateMariage": "Date prévue du mariage",
  "extra.form.lieuMariage": "Lieu du mariage",
  "extra.bans.piecesTitre": "Pièces à fournir",

  // Lectures
  "extra.lectures.homelie": "Homélie du jour",
  "extra.lectures.lireHomelie": "Lire l'homélie",
  "extra.lectures.messesDuJour": "Messes du jour",
  "extra.lectures.aucuneMesse": "Aucune messe programmée ce jour.",

  // Boutique
  "extra.boutique.recherche": "Rechercher un livre ou un article…",
  "extra.boutique.toutesCategories": "Toutes les catégories",
  "extra.boutique.aucun": "Aucun article ne correspond à votre recherche.",
  "extra.boutique.ajouterPanier": "Ajouter au panier",
  "extra.boutique.contacterVendeur": "Contacter le vendeur",
  "extra.boutique.ajoute": "Ajouté au panier",
  "extra.boutique.voirPanier": "Voir le panier",

  // Musique de fond
  "extra.musique.jouer": "Lancer la musique de fond",
  "extra.musique.pause": "Mettre la musique en pause",
  "extra.musique.suivant": "Morceau suivant",

  // Messes (semaine)
  "extra.messes.semaine": "Messes de la semaine",
  "extra.messes.speciales": "Messes spéciales et autres célébrations",
  "extra.messes.aucune": "—",

  // Équipes des mouvements
  "extra.mouvements.equipe": "L'équipe",
}

const en: Record<string, string> = {
  "extra.agenda.enCours": "Ongoing",
  "extra.agenda.du": "From",
  "extra.agenda.au": "to",
  "extra.agenda.jusquau": "until",
  "extra.agenda.voirPlus": "Show more past events",
  "extra.agenda.aucunPasse": "No past event in this category.",

  "extra.form.titre": "Request form",
  "extra.form.infosPerso": "Personal information",
  "extra.form.infosPersoDesc": "Fill in your personal information.",
  "extra.form.personnes": "People concerned",
  "extra.form.personnesDesc": "Add the details of the people concerned",
  "extra.form.nom": "Last name(s)",
  "extra.form.prenom": "First name(s)",
  "extra.form.email": "Email",
  "extra.form.telephone": "Phone",
  "extra.form.age": "Age",
  "extra.form.sacrement": "Sacrament requested",
  "extra.form.choisir": "Choose…",
  "extra.form.message": "Message (optional)",
  "extra.form.envoyer": "Send",
  "extra.form.envoi": "Sending…",
  "extra.form.ajouter": "Add a person",
  "extra.form.retirer": "Remove the last person",
  "extra.form.succes": "Your request has been sent. The parish office will contact you.",
  "extra.form.erreur": "An error occurred, please try again.",
  "extra.form.messe": "Mass",
  "extra.form.messeDesc": "Details of the requested Mass",
  "extra.form.intentionTexte": "Describe the Mass intention",
  "extra.form.date": "Date",
  "extra.form.heure": "Time",
  "extra.form.selectDate": "Select a date",
  "extra.form.aucuneMesse": "No Mass on that day",
  "extra.form.fiances": "The engaged couple",
  "extra.form.fiancesDesc": "Details of the future spouses",
  "extra.form.fiance": "Groom",
  "extra.form.fiancee": "Bride",
  "extra.form.dateMariage": "Planned wedding date",
  "extra.form.lieuMariage": "Wedding venue",
  "extra.bans.piecesTitre": "Documents to provide",

  "extra.lectures.homelie": "Homily of the day",
  "extra.lectures.lireHomelie": "Read the homily",
  "extra.lectures.messesDuJour": "Today's Masses",
  "extra.lectures.aucuneMesse": "No Mass scheduled on that day.",

  "extra.boutique.recherche": "Search for a book or an item…",
  "extra.boutique.toutesCategories": "All categories",
  "extra.boutique.aucun": "No item matches your search.",
  "extra.boutique.ajouterPanier": "Add to cart",
  "extra.boutique.contacterVendeur": "Contact the seller",
  "extra.boutique.ajoute": "Added to cart",
  "extra.boutique.voirPanier": "View cart",

  "extra.musique.jouer": "Play background music",
  "extra.musique.pause": "Pause background music",
  "extra.musique.suivant": "Next track",

  "extra.messes.semaine": "Masses of the week",
  "extra.messes.speciales": "Special Masses and other celebrations",
  "extra.messes.aucune": "—",

  "extra.mouvements.equipe": "The team",
}

const bundle: Bundle = { fr, en }

export default bundle
