"use client";

import "@/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context";
import { QueryProvider } from "@/components";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "@/stores";
import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // intialize to theme last/default
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700",
              }}
            />
          </AuthProvider>
        </QueryProvider>
        <GoogleAnalytics gaId="G-20DN8R5L1E" />
      </body>
    </html>
  );
}
