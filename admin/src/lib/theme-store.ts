import { create } from "zustand";

const THEME_STORAGE_KEY = "admin-theme";

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
  if (stored === "light" || stored === "dark") {
    return stored;
  }

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
  }, 300);
};

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: "light",

  toggleTheme: () => {
    const state = get();
    const next = state.theme === "light" ? "dark" : "light";
    set({ theme: next });
    applyTheme(next);
  },

  setTheme: (theme: Theme) => {
    if (theme === get().theme) {
      return;
    }
    set({ theme });
    applyTheme(theme);
  },

  initializeTheme: () => {
    const initial = resolveInitialTheme();
    set({ theme: initial });
    applyTheme(initial);
  },
}));
