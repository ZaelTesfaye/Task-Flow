"use client";

import { create } from "zustand";

const THEME_STORAGE_KEY = "theme";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const resolveInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // try {
  //   return window.matchMedia("(prefers-color-scheme: dark)").matches
  //     ? "dark"
  //     : "light";
  // } catch (error) {
  //   return "light";
  // }

  return "light";
};

const applyTheme = (value: Theme) => {
  if (typeof window === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.add("disable-transitions");
  root.classList.remove("dark", "light");

  if (value === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.add("light");
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, value);

  setTimeout(() => {
    root.classList.remove("disable-transitions");
  }, 500);
};

export const useThemeStore = create<ThemeState>()((set, get) => {
  return {
    theme: "light", // Default to light to avoid hydration mismatch, will be updated by initializeTheme

    toggleTheme: () => {
      const state = get();
      const newTheme = state.theme === "light" ? "dark" : "light";
      set({ theme: newTheme });
      applyTheme(newTheme);
    },

    setTheme: (theme: Theme) => {
      const current = get().theme;
      if (current === theme) return;
      set({ theme });
      applyTheme(theme);
    },

    initializeTheme: () => {
      const initialTheme = resolveInitialTheme();
      set({ theme: initialTheme });
      applyTheme(initialTheme);
    },
  };
});
