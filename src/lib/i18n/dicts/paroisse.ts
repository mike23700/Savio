import type { Bundle } from "..";

const fr: Record<string, string> = {
  "paroisse.accueil": "Accueil",
  "paroisse.titre": "La Paroisse",
  "paroisse.sousTitre": "Une communauté vivante, unie dans la foi, au service de Dieu et de nos frères.",
  "paroisse.explorer": "EXPLORER",
  "paroisse.toutTitre": "Tout sur notre paroisse",
  "paroisse.toutIntro":
    "Découvrez l'histoire, l'équipe, l'organisation et les ressources de la Paroisse Saint Dominique Savio.",
  "paroisse.decouvrir": "Découvrir",
  "paroisse.chargement": "Chargement…",
  "paroisse.contact.nousContacter": "Nous contacter",

  "paroisse.genese.titre": "Genèse",
  "paroisse.genese.alt": "Genèse de la Paroisse",
  "paroisse.genese.desc":
    "Les origines de notre paroisse en 1961, la vision des fondateurs et les premiers pas de notre communauté.",
  "paroisse.genese.sousTitre": "Les origines et fondements de notre communauté de foi à Douala",
  "paroisse.genese.labelOrigines": "LES ORIGINES",
  "paroisse.genese.titre1961": "1961 : La naissance d'une communauté",
  "paroisse.genese.quote":
    "L'Église naît là où l'on annonce l'Évangile, là où on rassemble les hommes et les femmes au nom du Christ.",
  "paroisse.genese.quoteAuteur":
    "— Esprit de la fondation de la Paroisse Saint Dominique Savio, 1961",
  "paroisse.genese.labelSuccession": "SUCCESSION PASTORALE",
  "paroisse.genese.titreCures": "Les curés qui nous ont précédés",
  "paroisse.genese.introCures": "Depuis 1964, quatorze prêtres ont guidé notre communauté.",
  "paroisse.genese.numero": "N° {n}",
  "paroisse.genese.cureActuel": "CURÉ ACTUEL",

  "paroisse.histoire.titre": "Notre Histoire",
  "paroisse.histoire.desc":
    "Dates clés, succession des curés, consécration de l'église et extension vers Youpwè.",
  "paroisse.histoire.sousTitre": "Plus de 60 ans de foi, de service et de communauté à Douala",
  "paroisse.histoire.ctaComplet": "Notre Histoire complète",
  "paroisse.histoire.labelChronologie": "CHRONOLOGIE",
  "paroisse.histoire.titreDates": "Dates clés de la paroisse",
  "paroisse.histoire.labelExtension": "EXTENSION",
  "paroisse.histoire.titreYoupwe": "L'extension vers Youpwè",
  "paroisse.histoire.introYoupwe":
    "Dans les années 1990, la paroisse a étendu sa mission vers le quartier de Youpwè.",

  "paroisse.savio.titre": "Saint Dominique Savio",
  "paroisse.savio.desc":
    "Découvrez notre saint patron, jeune saint salésien canonisé en 1954, modèle pour la jeunesse.",
  "paroisse.savio.sousTitre": "Notre saint patron, modèle de jeunesse et de foi",
  "paroisse.savio.labelBio": "REPÈRES BIOGRAPHIQUES",
  "paroisse.savio.labelPatron": "NOTRE SAINT PATRON",
  "paroisse.savio.titreVie": "La vie de Dominique Savio",
  "paroisse.savio.labelSpiritualite": "SPIRITUALITÉ DE DOMINIQUE SAVIO",
  "paroisse.savio.labelPriere": "PRIÈRE",
  "paroisse.savio.titrePriere": "Prière à Saint Dominique Savio",
  "paroisse.savio.amen": "Amen.",
  "paroisse.savio.ctaEquipe": "Découvrir notre équipe",

  "paroisse.equipe.titre": "Le Curé & l'équipe",
  "paroisse.equipe.desc":
    "Rencontrez nos prêtres : Abbé Mbanda, Abbé Nwind, Abbé Saïdou et Abbé Mohomye.",
  "paroisse.equipe.alt": "Notre équipe pastorale",
  "paroisse.equipe.titreComplet": "Le Curé & l'équipe pastorale",
  "paroisse.equipe.sousTitre": "Les prêtres au service de notre communauté",
  "paroisse.equipe.labelEquipe": "NOTRE ÉQUIPE",
  "paroisse.equipe.titrePretres": "Les prêtres de la paroisse",
  "paroisse.equipe.intro":
    "Une équipe pastorale unie dans le service de Dieu et de notre communauté paroissiale.",
  "paroisse.equipe.enPoste": "En poste depuis {date}",
  "paroisse.equipe.enPosteLabel": "En poste depuis",
  "paroisse.equipe.voirProfil": "Voir le profil complet",
  "paroisse.equipe.contacter": "Contacter",
  "paroisse.equipe.titreContact": "Contacter la paroisse",
  "paroisse.equipe.introContact":
    "Pour toute demande pastorale, vous pouvez contacter le secrétariat ou nous écrire directement.",
  "paroisse.equipe.ctaIntention": "Demander une intention de messe",
  "paroisse.equipe.ctaActuelle": "L'équipe actuelle",
  "paroisse.equipe.breadcrumb": "L'équipe",
  "paroisse.equipe.retourEquipe": "Retour à l'équipe",
  "paroisse.equipe.profilIntrouvable": "Profil introuvable",
  "paroisse.equipe.labelInformations": "INFORMATIONS",
  "paroisse.equipe.neLe": "Né le",
  "paroisse.equipe.ordonneLe": "Ordonné le",
  "paroisse.equipe.ordonnePar": "Ordonné par",
  "paroisse.equipe.origine": "Origine",
  "paroisse.equipe.labelDevise": "DEVISE",
  "paroisse.equipe.labelBiographie": "BIOGRAPHIE",
  "paroisse.equipe.titreParcours": "Formation et parcours",
  "paroisse.equipe.labelMinisteres": "MINISTÈRES EXERCÉS",

  "paroisse.organisation.titre": "Organisation",
  "paroisse.organisation.desc":
    "Structure pastorale, conseil économique, CEV et chiffres clés de notre communauté.",
  "paroisse.organisation.titrePage": "Organisation de la paroisse",
  "paroisse.organisation.sousTitre": "Structure pastorale et gouvernance",
  "paroisse.organisation.structureTitre": "Structure pastorale",
  "paroisse.organisation.chiffresTitre": "Chiffres clés",
  "paroisse.organisation.organigrammeTitre": "Organigramme pastoral",

  "paroisse.archidiocese.titre": "Archidiocèse",
  "paroisse.archidiocese.desc":
    "Notre appartenance à l'Archidiocèse de Douala, Doyenné Wouri I et la CENC.",
  "paroisse.archidiocese.titrePage": "L'Archidiocèse de Douala",
  "paroisse.archidiocese.sousTitre": "Notre ancrage diocésain",
  "paroisse.archidiocese.egliseCameroun": "L'Église au Cameroun",

  "paroisse.mediatheque.titre": "Médiathèque",
  "paroisse.mediatheque.desc":
    "Photos et vidéos de la vie paroissiale, célébrations et moments communautaires.",
};

const en: Record<string, string> = {
  "paroisse.accueil": "Home",
  "paroisse.titre": "The Parish",
  "paroisse.sousTitre": "A living community, united in faith, in the service of God and of our brothers.",
  "paroisse.explorer": "EXPLORE",
  "paroisse.toutTitre": "All about our parish",
  "paroisse.toutIntro":
    "Discover the history, the team, the organisation and the resources of Saint Dominique Savio Parish.",
  "paroisse.decouvrir": "Discover",
  "paroisse.chargement": "Loading…",
  "paroisse.contact.nousContacter": "Contact us",

  "paroisse.genese.titre": "Genesis",
  "paroisse.genese.alt": "The origins of the Parish",
  "paroisse.genese.desc":
    "The origins of our parish in 1961, the vision of the founders and the first steps of our community.",
  "paroisse.genese.sousTitre": "The origins and foundations of our community of faith in Douala",
  "paroisse.genese.labelOrigines": "THE ORIGINS",
  "paroisse.genese.titre1961": "1961: the birth of a community",
  "paroisse.genese.quote":
    "The Church is born wherever the Gospel is proclaimed, wherever men and women are gathered in the name of Christ.",
  "paroisse.genese.quoteAuteur":
    "— Spirit of the founding of Saint Dominique Savio Parish, 1961",
  "paroisse.genese.labelSuccession": "PASTORAL SUCCESSION",
  "paroisse.genese.titreCures": "The parish priests who preceded us",
  "paroisse.genese.introCures": "Since 1964, fourteen priests have guided our community.",
  "paroisse.genese.numero": "No. {n}",
  "paroisse.genese.cureActuel": "CURRENT PRIEST",

  "paroisse.histoire.titre": "Our History",
  "paroisse.histoire.desc":
    "Key dates, succession of parish priests, consecration of the church and expansion towards Youpwè.",
  "paroisse.histoire.sousTitre": "More than 60 years of faith, service and community in Douala",
  "paroisse.histoire.ctaComplet": "Our complete History",
  "paroisse.histoire.labelChronologie": "CHRONOLOGY",
  "paroisse.histoire.titreDates": "Key dates of the parish",
  "paroisse.histoire.labelExtension": "EXPANSION",
  "paroisse.histoire.titreYoupwe": "The expansion towards Youpwè",
  "paroisse.histoire.introYoupwe":
    "In the 1990s, the parish extended its mission towards the Youpwè district.",

  "paroisse.savio.titre": "Saint Dominic Savio",
  "paroisse.savio.desc":
    "Discover our patron saint, a young Salesian saint canonised in 1954, a model for young people.",
  "paroisse.savio.sousTitre": "Our patron saint, a model of youth and faith",
  "paroisse.savio.labelBio": "BIOGRAPHICAL NOTES",
  "paroisse.savio.labelPatron": "OUR PATRON SAINT",
  "paroisse.savio.titreVie": "The life of Dominic Savio",
  "paroisse.savio.labelSpiritualite": "THE SPIRITUALITY OF DOMINIC SAVIO",
  "paroisse.savio.labelPriere": "PRAYER",
  "paroisse.savio.titrePriere": "Prayer to Saint Dominic Savio",
  "paroisse.savio.amen": "Amen.",
  "paroisse.savio.ctaEquipe": "Discover our team",

  "paroisse.equipe.titre": "The Parish Priest & the Team",
  "paroisse.equipe.desc":
    "Meet our priests: Father Mbanda, Father Nwind, Father Saïdou and Father Mohomye.",
  "paroisse.equipe.alt": "Our pastoral team",
  "paroisse.equipe.titreComplet": "The Parish Priest & the pastoral team",
  "paroisse.equipe.sousTitre": "The priests serving our community",
  "paroisse.equipe.labelEquipe": "OUR TEAM",
  "paroisse.equipe.titrePretres": "The priests of the parish",
  "paroisse.equipe.intro":
    "A pastoral team united in the service of God and of our parish community.",
  "paroisse.equipe.enPoste": "In post since {date}",
  "paroisse.equipe.enPosteLabel": "In post since",
  "paroisse.equipe.voirProfil": "View the full profile",
  "paroisse.equipe.contacter": "Contact",
  "paroisse.equipe.titreContact": "Contact the parish",
  "paroisse.equipe.introContact":
    "For any pastoral request, you can contact the parish office or write to us directly.",
  "paroisse.equipe.ctaIntention": "Request a Mass intention",
  "paroisse.equipe.ctaActuelle": "The current team",
  "paroisse.equipe.breadcrumb": "The team",
  "paroisse.equipe.retourEquipe": "Back to the team",
  "paroisse.equipe.profilIntrouvable": "Profile not found",
  "paroisse.equipe.labelInformations": "DETAILS",
  "paroisse.equipe.neLe": "Born on",
  "paroisse.equipe.ordonneLe": "Ordained on",
  "paroisse.equipe.ordonnePar": "Ordained by",
  "paroisse.equipe.origine": "Origin",
  "paroisse.equipe.labelDevise": "MOTTO",
  "paroisse.equipe.labelBiographie": "BIOGRAPHY",
  "paroisse.equipe.titreParcours": "Formation and journey",
  "paroisse.equipe.labelMinisteres": "MINISTRIES HELD",

  "paroisse.organisation.titre": "Organisation",
  "paroisse.organisation.desc":
    "Pastoral structure, finance council, CEV and key figures of our community.",
  "paroisse.organisation.titrePage": "Organisation of the parish",
  "paroisse.organisation.sousTitre": "Pastoral structure and governance",
  "paroisse.organisation.structureTitre": "Pastoral structure",
  "paroisse.organisation.chiffresTitre": "Key figures",
  "paroisse.organisation.organigrammeTitre": "Pastoral organigram",

  "paroisse.archidiocese.titre": "Archdiocese",
  "paroisse.archidiocese.desc":
    "Our belonging to the Archdiocese of Douala, Wouri I Deanery and the CENC.",
  "paroisse.archidiocese.titrePage": "The Archdiocese of Douala",
  "paroisse.archidiocese.sousTitre": "Our diocesan belonging",
  "paroisse.archidiocese.egliseCameroun": "The Church in Cameroon",

  "paroisse.mediatheque.titre": "Media Library",
  "paroisse.mediatheque.desc":
    "Photos and videos of parish life, celebrations and community moments.",
};

export default { fr, en } satisfies Bundle;