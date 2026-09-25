import { apiGet } from "@/lib/api";
import type { ReactNode } from "react";

/**
 * Editable presentation pages (Genèse, Histoire, Savio, Organisation,
 * Archidiocèse, Caritas). Each page = PageContent (hero + intro + extra)
 * + a list of PageBlock (curés, timeline steps, cards, bullets, stats).
 */

export type PageKey = "genese" | "histoire" | "savio" | "organisation" | "archidiocese" | "caritas";

export interface PageBlock {
  id: number;
  kind: "cure" | "timeline" | "milestone" | "card" | "bullet" | "stat";
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  meta: string | null; // years of a curé, date label, stat number...
  icon: string | null;
  is_highlight: boolean; // e.g. "curé actuel"
  sort_order: number;
  is_active: boolean;
}

export interface PageContent {
  id: number;
  key: PageKey;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  intro: string | null;
  extra: Record<string, unknown> | null;
  blocks: PageBlock[];
}

/** Blocks of a given kind, in display order, active only. */
export function blocksOf(page: PageContent | null, kind: PageBlock["kind"]): PageBlock[] {
  return (page?.blocks ?? []).filter((b) => b.kind === kind && b.is_active);
}

export function extraOf(page: PageContent | null): Record<string, any> {
  return (page?.extra as Record<string, any>) ?? {};
}

/**
 * Split the intro into paragraphs (blank-line separated) and render
 * minimal inline markdown: **bold** and *italic* → <strong>/<em>.
 */
export function introParagraphs(intro: string | null): string[] {
  if (!intro) return [];
  return intro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Render **bold** / *italic* inline markdown as React nodes. */
export function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#0B3D91" }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function loadPage(key: PageKey): Promise<PageContent | null> {
  return apiGet<PageContent | null>(`/pages/${key}`);
}
