import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations, LANGUAGES, DEFAULT_LANG } from "./translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "ponte-lang";

function detectLang() {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q && LANGUAGES.includes(q)) return q;
  } catch (e) {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.includes(saved)) return saved;
  } catch (e) {}
  return DEFAULT_LANG;
}

function syncUrl(lang) {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("lang") !== lang) {
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url.toString());
    }
  } catch (e) {}
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => detectLang());

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    if (!LANGUAGES.includes(l)) return;
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (e) {}
    syncUrl(l);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext) || { lang: DEFAULT_LANG, setLang: () => {} };
  const t = useCallback(
    (key) => {
      const dict = translations[ctx.lang] || translations[DEFAULT_LANG];
      const parts = key.split(".");
      let cur = dict;
      for (const p of parts) {
        if (cur == null) return key;
        cur = cur[p];
      }
      return cur ?? key;
    },
    [ctx.lang]
  );
  return { lang: ctx.lang, setLang: ctx.setLang, t };
}