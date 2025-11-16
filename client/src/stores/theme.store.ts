"use client";

import { create } from "zustand";

const THEME_STORAGE_KEY = "theme";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const resolveInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (error) {
    return "light";
  }
};

const applyTheme = (value: Theme) => {
  if (typeof window === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.add("disable-transitions");
  console.log("Applying theme:", value);
  root.classList.remove("dark", "light");
  console.log("Removed existing theme classes");

  if (value === "dark") {
    root.classList.add("dark");
    console.log("Added 'dark' class");
  } else {
    root.classList.add("light");
  }
  root.setAttribute("data-theme", value);
  root.style.colorScheme = value;

  window.localStorage.setItem(THEME_STORAGE_KEY, value);

  setTimeout(() => {
    root.classList.remove("disable-transitions");
  }, 500);

  void root.offsetHeight;
};

export const useThemeStore = create<ThemeState>()((set, get) => {
  console.log("Initializing theme store");
  const initialTheme = resolveInitialTheme();
  console.log("Initial theme:", initialTheme);
  applyTheme(initialTheme);
  console.log("Applied theme:", initialTheme);

  return {
    theme: initialTheme,

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
  };
});
