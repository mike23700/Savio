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
  source: "paroisse" | "aelf";
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
