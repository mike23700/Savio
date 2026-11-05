import home from "@/lib/i18n/dicts/home"

/** One slide of the big home page carousel, edited in /admin/contenus. */
export interface HomeSlide {
  /** Uploaded path ("banners/x.jpg") or full URL. */
  img: string
  tag: string
  date: string
  title: string
  desc: string
  /** Main button label and link (e.g. "/agenda" or "https://…"). */
  cta: string
  to: string
}

const IMAGES = [
  "https://images.unsplash.com/photo-1637615739656-ca10c4285c88?w=1600&h=700&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=1600&h=700&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1600&h=700&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1785355805907-b95663dfb621?w=1600&h=700&fit=crop&auto=format",
]

const LINKS = ["/agenda", "/agenda", "/actualites", "/don"]

/** Built-in slides, used until the admin saves its own (`home.slides` setting). */
export function defaultSlides(lang: "fr" | "en" = "fr"): HomeSlide[] {
  const d = { ...home.fr, ...(lang === "en" ? home.en : {}) } as Record<string, string>
  return IMAGES.map((img, i) => ({
    img,
    tag: d[`home.slide.${i + 1}.tag`] ?? "",
    date: d[`home.slide.${i + 1}.date`] ?? "",
    title: d[`home.slide.${i + 1}.title`] ?? "",
    desc: d[`home.slide.${i + 1}.desc`] ?? "",
    cta: d[`home.slide.${i + 1}.cta`] ?? "",
    to: LINKS[i],
  }))
}

/** Slides saved by the admin, or null when none are configured. */
export function parseSlides(
  raw: string | undefined,
  { keepEmpty = false }: { keepEmpty?: boolean } = {},
): HomeSlide[] | null {
  try {
    const list = raw ? JSON.parse(raw) : null
    if (!Array.isArray(list)) return null
    // The admin keeps slides still being filled in; the site skips empty ones.
    const slides = list.filter(
      (s) => s && typeof s === "object" && (keepEmpty || s.img || s.title),
    ) as HomeSlide[]
    return slides.length ? slides : null
  } catch {
    return null
  }
}
