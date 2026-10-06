"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { dictionaries, type Dictionary, type Lang, type Localized } from "@/lib/i18n";
import { getLangSnapshot, getServerLangSnapshot, setLang, subscribeLang } from "@/lib/i18n/store";

type LanguageContextValue = {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  /** Pick the current-language value of a localized field. */
  l: <T>(value: Localized<T>) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLangSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dictionaries[lang].meta.title;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: dictionaries[lang],
      setLang,
      l: (v) => v[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
