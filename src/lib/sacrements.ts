/**
 * Sacramental register configuration shared by the public page
 * (src/pages/vie-paroissiale/Registre.tsx) and the admin panel
 * (src/pages/admin/Registre.tsx).
 *
 * Field `key`s map 1:1 to columns of the `registre_sacrements` table.
 */

export type SacrementType = "bapteme" | "communion" | "confirmation" | "mariage";

export type SacrementFieldKind = "text" | "date" | "textarea" | "radio";

export interface SacrementField {
  key: string;
  kind: SacrementFieldKind;
  /** i18n key used by the public page. */
  labelKey: string;
  /** French label used by the admin panel. */
  label: string;
  required?: boolean;
  /** For `radio` fields: list of options. */
  options?: { value: string; labelKey: string; label: string }[];
}

export interface SacrementDef {
  type: SacrementType;
  /** i18n key used by the public page tabs. */
  labelKey: string;
  /** French label used by the admin panel tabs. */
  label: string;
  fields: SacrementField[];
}

const SEXE_OPTIONS = [
  { value: "fils", labelKey: "vie.sacr.fils", label: "Fils" },
  { value: "fille", labelKey: "vie.sacr.fille", label: "Fille" },
];

export const SACREMENTS: SacrementDef[] = [
  {
    type: "bapteme",
    labelKey: "vie.registre.tab.bapteme",
    label: "Baptême",
    fields: [
      { key: "nom", kind: "text", labelKey: "vie.sacr.nom", label: "Noms et prénoms", required: true },
      { key: "sexe", kind: "radio", labelKey: "vie.sacr.sexe", label: "Fils / Fille", options: SEXE_OPTIONS },
      { key: "pere", kind: "text", labelKey: "vie.sacr.filsDe", label: "Fils / Fille de" },
      { key: "mere", kind: "text", labelKey: "vie.sacr.etDe", label: "Et de" },
      { key: "date_naissance", kind: "date", labelKey: "vie.sacr.neLe", label: "Né(e) le" },
      { key: "date_evenement", kind: "date", labelKey: "vie.sacr.baptiseLe", label: "Baptisé(e) le" },
      { key: "numero_registre", kind: "text", labelKey: "vie.sacr.numeroRegistre", label: "N° du Registre" },
      { key: "parrain_marraine", kind: "text", labelKey: "vie.sacr.parrain", label: "Parrain / Marraine" },
      { key: "lieu", kind: "text", labelKey: "vie.sacr.village", label: "Village" },
      { key: "remarques", kind: "textarea", labelKey: "vie.sacr.remarques", label: "Remarques" },
      { key: "date_certificat", kind: "date", labelKey: "vie.sacr.certifieLe", label: "Certifié exact le" },
      { key: "signataire", kind: "text", labelKey: "vie.sacr.signataire", label: "Signé par" },
    ],
  },
  {
    type: "communion",
    labelKey: "vie.registre.tab.communion",
    label: "1ère Communion",
    fields: [
      { key: "nom", kind: "text", labelKey: "vie.sacr.nom", label: "Noms et prénoms", required: true },
      { key: "lieu", kind: "text", labelKey: "vie.sacr.lieu", label: "À / At" },
      { key: "date_evenement", kind: "date", labelKey: "vie.sacr.le", label: "Le / On" },
      { key: "signataire", kind: "text", labelKey: "vie.sacr.signature", label: "Signature" },
    ],
  },
  {
    type: "confirmation",
    labelKey: "vie.registre.tab.confirmation",
    label: "Confirmation",
    fields: [
      { key: "nom", kind: "text", labelKey: "vie.sacr.nom", label: "Noms et prénoms", required: true },
      { key: "lieu", kind: "text", labelKey: "vie.sacr.lieu", label: "À / At" },
      { key: "date_evenement", kind: "date", labelKey: "vie.sacr.le", label: "Le / On" },
      { key: "ministre", kind: "text", labelKey: "vie.sacr.ministre", label: "Ministre" },
      { key: "signataire", kind: "text", labelKey: "vie.sacr.signature", label: "Signature" },
    ],
  },
  {
    type: "mariage",
    labelKey: "vie.registre.tab.mariage",
    label: "Mariage",
    fields: [
      { key: "nom", kind: "text", labelKey: "vie.sacr.nom", label: "Noms et prénoms", required: true },
      { key: "lieu", kind: "text", labelKey: "vie.sacr.lieu", label: "À / At" },
      { key: "date_evenement", kind: "date", labelKey: "vie.sacr.le", label: "Le / On" },
      { key: "numero", kind: "text", labelKey: "vie.sacr.numero", label: "N° (N° L.M.)" },
      { key: "conjoint", kind: "text", labelKey: "vie.sacr.conjoint", label: "Avec / With" },
      { key: "baptise_a", kind: "text", labelKey: "vie.sacr.baptiseA", label: "Baptisé(e) à" },
      { key: "numero_registre", kind: "text", labelKey: "vie.sacr.numeroRegistre", label: "N° du Registre" },
      { key: "temoins", kind: "text", labelKey: "vie.sacr.temoins", label: "Témoins" },
      { key: "ministre", kind: "text", labelKey: "vie.sacr.ministre", label: "Ministre" },
      { key: "signataire", kind: "text", labelKey: "vie.sacr.signature", label: "Signature" },
    ],
  },
];

export const SACREMENT_LABELS: Record<SacrementType, string> = {
  bapteme: "Baptême",
  communion: "1ère Communion",
  confirmation: "Confirmation",
  mariage: "Mariage",
};

export interface RegistreSacrement {
  id: number;
  registre_inscription_id: number | null;
  type: SacrementType;
  nom: string;
  sexe: "fils" | "fille" | null;
  pere: string | null;
  mere: string | null;
  date_naissance: string | null;
  date_evenement: string | null;
  lieu: string | null;
  numero: string | null;
  numero_registre: string | null;
  parrain_marraine: string | null;
  conjoint: string | null;
  baptise_a: string | null;
  temoins: string | null;
  ministre: string | null;
  signataire: string | null;
  date_certificat: string | null;
  remarques: string | null;
  source: "public" | "admin";
  created_at: string;
}

/** A parish fiche together with the sacraments recorded for that person. */
export interface RegistreInscription {
  id: number;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string;
  tranche_age: string | null;
  rue: string | null;
  quartier: string | null;
  lieu_dit: string | null;
  membre_cev: boolean;
  quelle_cev: string | null;
  membre_groupe: boolean;
  quel_groupe: string | null;
  anciennete: string | null;
  source: "public" | "admin";
  created_at: string;
  sacrements: RegistreSacrement[];
}

/** A member's request to have their fiche printed as an A4 PDF. */
export type RegistrePrintStatut = "en_attente" | "en_traitement" | "prete" | "livree" | "refusee";

export interface RegistrePrintRequest {
  id: number;
  reference: string;
  registre_inscription_id: number;
  user_id: number | null;
  statut: RegistrePrintStatut;
  message: string | null;
  admin_notes: string | null;
  processed_at: string | null;
  created_at: string;
  inscription?: RegistreInscription;
  user?: { id: number; nom: string; prenom: string; email: string | null } | null;
}

/** French label for each print request status. */
export const PRINT_STATUT_LABELS: Record<RegistrePrintStatut, string> = {
  en_attente: "En attente",
  en_traitement: "En traitement",
  prete: "Prête",
  livree: "Livrée",
  refusee: "Refusée",
};

/** i18n key of the "are you …?" question for each sacrament. */
export const SACREMENT_QUESTIONS: Record<SacrementType, string> = {
  bapteme: "vie.registre.wizard.baptise",
  communion: "vie.registre.wizard.communion",
  confirmation: "vie.registre.wizard.confirmation",
  mariage: "vie.registre.wizard.mariage",
};

/** "2026-10-14T00:00:00.000000Z" → "14/10/2026" */
export function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR");
}
