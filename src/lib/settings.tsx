import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { apiGet } from "@/lib/api"

import { PARISH } from "@/data/content"

type Settings = Record<string, string>

const SettingsContext = createContext<Settings>({})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    apiGet<Settings>("/settings")

      .then(setSettings)

      .catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

/** Setting key → field of the built-in `PARISH` defaults (src/data/content.ts). */
export const PARISH_SETTING_KEYS = {
  "parish.name": "name",
  "parish.short_name": "shortName",
  "parish.location": "location",
  "parish.address": "address",
  "parish.phone": "phone",
  "parish.email": "email",
  "parish.hours": "hours",
  "parish.founded": "founded",
  "parish.diocese": "diocese",
  "parish.deanery": "deanery",
  "parish.tagline": "tagline",
  "parish.maps_url": "mapsUrl",
} as const satisfies Record<string, keyof typeof PARISH>

/** Parish contact info: admin settings (/admin/parametres) over the built-in defaults. */
export function useParish(): typeof PARISH {
  const settings = useSettings()
  const out = { ...PARISH }
  for (const [key, field] of Object.entries(PARISH_SETTING_KEYS)) {
    const v = settings[key]
    if (v && v.trim()) out[field] = v
  }
  return out
}
