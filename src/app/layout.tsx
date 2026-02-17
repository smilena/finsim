/**
 * Root layout for the application
 */

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

/** Sets data-theme on <html> before first paint to prevent theme flash (default: light). */
const themeInitScript = `
(function(){
  var saved = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
  var theme = (saved === 'dark' || saved === 'light') ? saved : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
`;

export const metadata: Metadata = {
  title: 'Simuladores Financieros',
  description: 'Herramientas para proyecciones de inversión y simulación de deuda con abonos a capital',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1976d2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
