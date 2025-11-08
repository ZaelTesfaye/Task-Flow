import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </AuthProvider>
  );
}
