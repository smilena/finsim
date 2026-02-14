/**
 * Root layout for the application
 */

import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

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
    <html lang="es">
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
