import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const THEME_STORAGE_KEY = "theme";

const resolveInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  // Clean up old Zustand persist key if it exists
  const oldKey = "theme-storage";
  if (window.localStorage.getItem(oldKey)) {
    window.localStorage.removeItem(oldKey);
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (error) {
    return "light";
  }
};

const applyTheme = (value: Theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  // Force remove all theme-related classes
  root.classList.remove("dark", "light");

  // Add the appropriate class
  if (value === "dark") {
    root.classList.add("dark");
  } else {
    // Explicitly add light class for clarity (optional but helps debugging)
    root.classList.add("light");
  }

  // Set additional attributes for consistency
  root.setAttribute("data-theme", value);
  root.style.colorScheme = value;

  // Store in localStorage directly (same as _document.tsx)
  window.localStorage.setItem(THEME_STORAGE_KEY, value);

  // Force a repaint to ensure styles are applied
  void root.offsetHeight;
};

export const useThemeStore = create<ThemeState>()((set, get) => {
  // Get initial theme and apply it immediately
  const initialTheme = resolveInitialTheme();

  // Apply theme immediately when store is created
  if (typeof window !== "undefined") {
    applyTheme(initialTheme);
  }

  return {
    theme: initialTheme,

    toggleTheme: () => {
      const newTheme = get().theme === "light" ? "dark" : "light";
      set({ theme: newTheme });
      applyTheme(newTheme);
    },

    setTheme: (theme: Theme) => {
      const current = get().theme;
      if (current === theme) return; // avoid redundant work
      set({ theme });
      applyTheme(theme);
      // Removed forced reload to prevent flicker; Tailwind + CSS variables update instantly.
    },
  };
});
