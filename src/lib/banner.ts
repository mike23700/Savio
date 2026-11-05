import banniereDefaut from "@/imports/banniere-defaut.jpg"

import { mediaUrl } from "@/lib/api"

import { useSettings } from "@/lib/settings"

/** Bannière par défaut du site (façade de la paroisse), utilisée quand une page n'a pas de bannière propre. */
export const DEFAULT_BANNER: string = banniereDefaut

/**
 * Pages whose banner can be changed in /admin/contenus. The admin stores the
 * uploaded path in the `banner.<key>` setting; `banner.default` replaces the
 * built-in default banner everywhere.
 */
export const BANNER_KEYS = [
  { key: "default", label: "Bannière par défaut (toutes les pages sans bannière propre)" },
  { key: "mediatheque", label: "Médiathèque" },
  { key: "vie_paroissiale", label: "Vie paroissiale (accueil + sous-pages)" },
  { key: "agenda", label: "Agenda" },
  { key: "sacrements", label: "Sacrements" },
  { key: "intention", label: "Intention de messe" },
  { key: "bans", label: "Publication des bans" },
  { key: "lectures", label: "Lectures du jour" },
  { key: "boutique", label: "Boutique / librairie" },
  { key: "journal", label: "Journal paroissial" },
] as const

export type BannerKey = (typeof BANNER_KEYS)[number]["key"]

/** Banner URL for a page: its own banner, else the admin default, else the built-in default. */
export function useBanner(key?: BannerKey): string {
  const settings = useSettings()
  return (
    (key ? mediaUrl(settings[`banner.${key}`]) : null) ??
    mediaUrl(settings["banner.default"]) ??
    DEFAULT_BANNER
  )
}

/** Editable text from the `text.<key>` setting, or the fallback when empty. */
export function useSiteText(key: string, fallback = ""): string {
  const settings = useSettings()
  const v = settings[`text.${key}`]
  return v && v.trim() ? v : fallback
}
