'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores';

export default function ThemeDebug() {
  const { theme, setTheme } = useThemeStore();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      setDebugInfo({
        localStorage: localStorage.getItem('theme'),
        storeTheme: theme,
        htmlClasses: root.className,
        hasDark: root.classList.contains('dark'),
        hasLight: root.classList.contains('light'),
        dataTheme: root.getAttribute('data-theme'),
        colorScheme: root.style.colorScheme,
        cssBackground: styles.getPropertyValue('--background'),
        cssForeground: styles.getPropertyValue('--foreground'),
        bodyBg: getComputedStyle(document.body).backgroundColor,
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [theme]);

  const forceLight = () => {
    localStorage.clear();
    localStorage.setItem('theme', 'light');
    setTheme('light');
  };

  const forceDark = () => {
    localStorage.clear();
    localStorage.setItem('theme', 'dark');
    setTheme('dark');
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Theme Debug Page
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={forceLight}
            className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Force Light Mode
          </button>
          <button
            onClick={forceDark}
            className="px-6 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg hover:bg-gray-800 font-semibold"
          >
            Force Dark Mode
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Current Theme State
          </h2>
          <div className="space-y-2 font-mono text-sm">
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{key}:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Light Mode Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This card should have white background in light mode and dark background in dark mode.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Secondary Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This card should have light gray background in light mode and darker gray in dark mode.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Instructions
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Click &quot;Force Light Mode&quot; to switch to light theme</li>
            <li>Click &quot;Force Dark Mode&quot; to switch to dark theme</li>
            <li>Page will reload automatically after switching</li>
            <li>Check the debug info above to see current state</li>
          </ul>
        </div>
      </div>
    </div>
  );
}