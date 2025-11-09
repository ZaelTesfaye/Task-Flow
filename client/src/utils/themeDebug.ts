/**
 * Theme Debugging Utility
 * Use this to diagnose theme switching issues
 */

export const debugTheme = () => {
  if (typeof window === "undefined") {
    console.log("Running on server - no theme info available");
    return;
  }

  const root = document.documentElement;
  const theme = localStorage.getItem("theme");
  const oldKey = localStorage.getItem("theme-storage");
  
  console.group("🎨 Theme Debug Info");
  console.log("localStorage 'theme':", theme);
  console.log("localStorage 'theme-storage' (old):", oldKey);
  console.log("HTML classes:", root.className);
  console.log("Has 'dark' class:", root.classList.contains("dark"));
  console.log("Has 'light' class:", root.classList.contains("light"));
  console.log("data-theme attribute:", root.getAttribute("data-theme"));
  console.log("colorScheme style:", root.style.colorScheme);
  
  // Check CSS variables
  const styles = getComputedStyle(root);
  console.log("--background:", styles.getPropertyValue("--background"));
  console.log("--foreground:", styles.getPropertyValue("--foreground"));
  
  // Check body background
  const bodyBg = getComputedStyle(document.body).background;
  console.log("Body background:", bodyBg.substring(0, 100) + "...");
  
  console.groupEnd();
};

export const forceTheme = (theme: "light" | "dark") => {
  console.log(`🔧 Forcing theme to: ${theme}`);
  
  // Clean up
  localStorage.removeItem("theme-storage");
  localStorage.setItem("theme", theme);
  
  // Apply to DOM
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.add("light");
  }
  
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  
  console.log("✅ Theme forced. Reloading page...");
  setTimeout(() => location.reload(), 500);
};

// Make available in browser console
if (typeof window !== "undefined") {
  (window as any).debugTheme = debugTheme;
  (window as any).forceTheme = forceTheme;
  
  console.log("💡 Theme debug utilities loaded!");
  console.log("   Run debugTheme() to see current theme state");
  console.log("   Run forceTheme('light') or forceTheme('dark') to force a theme");
}
