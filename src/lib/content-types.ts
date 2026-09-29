export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  sort_order: number;
}

export interface NewsArticle {
  id: number;
  news_category_id: number | null;
  title: string;
  excerpt: string | null;
  content: string | null;
  img: string | null;
  published_at: string;
  is_published: boolean;
  category: NewsCategory | null;
}

/** Readings of the day: entered by the parish, or fetched from AELF. */
export interface DailyReadings {
  date: string;
  liturgical_day: string | null;
  color: string | null;
  reading_1: string | null;
  psalm: string | null;
  reading_2: string | null;
  gospel: string | null;
  gospel_title: string | null;
  texts?: ReadingText[];
  source: "paroisse" | "aelf";
}

/** Full text of one reading. `html` comes sanitized from the API (AELF), `text` is typed by the parish. */
export interface ReadingText {
  type: string;
  label: string;
  ref: string | null;
  title: string | null;
  intro: string | null;
  refrain: string | null;
  acclamation: string | null;
  content: string;
  format: "html" | "text";
}

export function readingsList(r: DailyReadings | null): { label: string; value: string }[] {
  if (!r) return [];
  return [
    { label: "1ère lecture", value: r.reading_1 },
    { label: "Psaume", value: r.psalm },
    { label: "2ème lecture", value: r.reading_2 },
    { label: "Évangile", value: r.gospel },
  ].filter((x): x is { label: string; value: string } => !!x.value);
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo: string | null;
  since: string | null;
  origin: string | null;
  bio: string | null;
  motto: string | null;
  email: string | null;
  born: string | null;
  ordained: string | null;
  ordained_by: string | null;
  ministries: string[] | null;
  sort_order: number;
  is_active: boolean;
}

export interface MediaCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface MediaItem {
  id: number;
  type: "photo" | "video";
  media_category_id: number | null;
  title: string | null;
  image: string | null;
  youtube_url: string | null;
  youtube_id: string | null;
  taken_at: string | null;
  sort_order: number;
  is_published: boolean;
  category: MediaCategory | null;
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  sort_order: number;
}

export interface ParishEvent {
  id: number;
  event_category_id: number | null;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
  is_published: boolean;
  category: EventCategory | null;
}

/** "09:00:00" → "09h00". */
export const formatEventTime = (t: string | null) => (t ? t.slice(0, 5).replace(":", "h") : "");

/** Guest room of the welcome centre (`chambre`, per night) or hall for rent (`salle`, per day). */
export interface Espace {
  id: number;
  kind: "chambre" | "salle";
  nom: string;
  slug: string;
  resume: string | null;
  description: string | null;
  capacite: number | null;
  quantite: number;
  /** null = price on request */
  prix: number | null;
  equipements: string[] | null;
  photos: string[] | null;
  is_active: boolean;
  sort_order: number;
  /** only on GET /espaces/{slug}: days with every unit booked (next 6 months) */
  jours_complets?: string[];
}

export interface Reservation {
  id: number;
  reference: string;
  espace_id: number;
  espace?: Pick<Espace, "id" | "nom" | "kind"> & { slug?: string };
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string;
  date_debut: string;
  date_fin: string;
  nb_unites: number;
  nb_personnes: number | null;
  evenement: string | null;
  message: string | null;
  montant: number | null;
  payment_method: "orange_money" | "mtn_momo" | "especes" | null;
  payment_status: "en_attente" | "paye" | "echoue" | "annule";
  payment_reference: string | null;
  payment_provider: string | null;
  payment_provider_status: string | null;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  admin_notes: string | null;
  created_at: string;
}

export const ESPACE_KIND = {
  chambre: { title: "Centre d'accueil", item: "chambre", unit: "nuit", units: "nuits", path: "/centre-accueil" },
  salle: { title: "Location de salles", item: "salle", unit: "jour", units: "jours", path: "/location-salles" },
} as const;

export const RESERVATION_STATUT: Record<Reservation["statut"], string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  terminee: "Terminée",
  annulee: "Annulée",
};

export function formatFcfa(n: number): string {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

/** "2026-10-04" → "dim. 4 oct. 2026" */
export function formatShortDate(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
