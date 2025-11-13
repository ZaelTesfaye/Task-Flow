"use client";

import "@/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "@/stores";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useThemeStore();

  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
