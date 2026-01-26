// HOOK PARA EL MODO OSCURO
import { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("goalz_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("goalz_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("goalz_theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, toggleDarkMode };
};
