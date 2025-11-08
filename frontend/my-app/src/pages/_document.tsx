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
              var theme = localStorage.getItem('theme') || 'light';
              var root = document.documentElement;
              // Always normalize first
              root.classList.remove('dark');
              if (theme === 'dark') {
                root.classList.add('dark');
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
