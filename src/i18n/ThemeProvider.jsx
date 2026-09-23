import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "ponte-theme";

function detectTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch (e) {}
  return "system";
}

function systemPrefersDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {
    return false;
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark());
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (isDark) {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.add("light");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => detectTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    let mq;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch (e) {
      return undefined;
    }
  }, [theme]);

  const setTheme = useCallback((t) => {
    if (t !== "light" && t !== "dark" && t !== "system") return;
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (e) {}
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext) || { theme: "system", setTheme: () => {} };
  return ctx;
}