import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Ensure the correct theme class is applied before hydration */}
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            try {
              // Clean up old Zustand persist key
              var oldKey = 'theme-storage';
              if (localStorage.getItem(oldKey)) {
                localStorage.removeItem(oldKey);
              }
              
              var theme = localStorage.getItem('theme') || 'light';
              var root = document.documentElement;
              
              // Always normalize first - remove all theme classes
              root.classList.remove('dark', 'light');
              
              // Add appropriate class
              if (theme === 'dark') {
                root.classList.add('dark');
              } else {
                root.classList.add('light');
              }
              
              root.style.colorScheme = theme;
              root.setAttribute('data-theme', theme);
            } catch (e) {
              // no-op
            }
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
