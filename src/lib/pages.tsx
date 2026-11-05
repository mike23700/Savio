import { apiGet } from "@/lib/api"
import type { ReactNode } from "react"

/**
 * Editable presentation pages (Genèse, Histoire, Savio, Organisation,
 * Archidiocèse, Caritas). Each page = PageContent (hero + intro + extra)
 * + a list of PageBlock (curés, timeline steps, cards, bullets, stats).
 */

export type PageKey = "genese" | "histoire" | "savio" | "organisation" | "archidiocese" | "caritas"

export interface PageBlock {
  id: number
  kind: "cure" | "timeline" | "milestone" | "card" | "bullet" | "stat"
  title: string | null
  subtitle: string | null
  description: string | null
  image: string | null
  meta: string | null // years of a curé, date label, stat number...
  icon: string | null
  is_highlight: boolean // e.g. "curé actuel"
  sort_order: number
  is_active: boolean
}

export interface PageContent {
  id: number
  key: PageKey
  title: string
  subtitle: string | null
  hero_image: string | null
  intro: string | null
  extra: Record<string, unknown> | null
  blocks: PageBlock[]
}

/** Blocks of a given kind, in display order, active only. */
export function blocksOf(
  page: PageContent | null,
  kind: PageBlock["kind"],
): PageBlock[] {
  return (page?.blocks ?? []).filter((b) => b.kind === kind && b.is_active)
}

export function extraOf(page: PageContent | null): Record<string, any> {
  return page?.extra as Record<string, any> ?? {}
}

/**
 * Split the intro into paragraphs (blank-line separated) and render
 * minimal inline markdown: **bold** and *italic* → <strong>/<em>.
 */
export function introParagraphs(intro: string | null): string[] {
  if (!intro) return []
  return intro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Render **bold** / *italic* inline markdown as React nodes. */
export function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "#0B3D91" }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export function loadPage(key: PageKey): Promise<PageContent | null> {
  return apiGet<PageContent | null>(`/pages/${key}`)
}

/**
 * Images shown on the presentation pages when the admin has not uploaded one
 * (also displayed in /admin/pages so the admin sees what is on the site).
 * `null` = the page uses the site's default banner.
 */
export const PAGE_HERO_FALLBACK: Record<string, string | null> = {
  genese: "https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1400&h=600&fit=crop&auto=format",
  histoire: "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=600&fit=crop&auto=format",
  savio: "https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=600&fit=crop&auto=format",
  organisation: "https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format",
  archidiocese: "https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1400&h=500&fit=crop&auto=format",
  caritas: null,
}

export const CURE_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=380&fit=crop&auto=format"

export const SAVIO_BIO_FALLBACK_IMG =
  "https://backoffice.paroissesaintdominiquesavio.com/assets/09633277-f72b-4102-9fe8-3752e3acd3ee"
