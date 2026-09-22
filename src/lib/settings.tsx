import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet } from "@/lib/api";

type Settings = Record<string, string>;

const SettingsContext = createContext<Settings>({});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    apiGet<Settings>("/settings")
      .then(setSettings)
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
