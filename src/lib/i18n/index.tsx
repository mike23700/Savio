import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import layout from "./dicts/layout";
import home from "./dicts/home";
import paroisse from "./dicts/paroisse";
import vieParoissiale from "./dicts/vieParoissiale";
import celebrer from "./dicts/celebrer";
import seNourrir from "./dicts/seNourrir";
import topLevel from "./dicts/topLevel";

export type Lang = "fr" | "en";
export type Dict = Record<string, string>;

export type Bundle = { fr: Dict; en: Dict };

const BUNDLES: Bundle[] = [layout, home, paroisse, vieParoissiale, celebrer, seNourrir, topLevel];

const FR: Dict = {};
const EN: Dict = {};
for (const b of BUNDLES) {
  Object.assign(FR, b.fr);
  Object.assign(EN, b.en);
}

const STORAGE_KEY = "savio.lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  // Une cle absente en anglais retombe sur le francais, puis sur la cle elle-meme.
  const t = useCallback(
    (key: string) => (lang === "en" ? EN[key] ?? FR[key] ?? key : FR[key] ?? key),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang() doit etre utilise a l'interieur de <LangProvider>");
  return ctx;
}
