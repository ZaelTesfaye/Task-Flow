import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect } from 'react';
import '@/utils/themeDebug'; // Load debug utilities

export default function App({ Component, pageProps }: AppProps) {
  // Ensure theme is applied on app initialization
  useEffect(() => {
    // Clean up old Zustand persist key if it exists
    const oldKey = "theme-storage";
    if (localStorage.getItem(oldKey)) {
      localStorage.removeItem(oldKey);
    }
    
    const theme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    
    // Force remove all theme classes
    root.classList.remove('dark', 'light');
    
    // Add appropriate class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700',
        }}
      />
    </AuthProvider>
  );
}
