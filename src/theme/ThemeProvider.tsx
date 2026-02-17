/**
 * Theme provider with light/dark mode support (state in memory, no persistence)
 */

'use client';

import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { useThemeMode } from '@/hooks/useThemeMode';
import { ThemeModeProvider } from './ThemeModeContext';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { ThemeSync } from '@/components/theme/ThemeSync';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Application theme provider
 * - Supports light and dark modes; state lives in this provider (no localStorage)
 * - Wraps MUI theme with Next.js App Router cache
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useThemeMode();
  const theme = themeMode.mode === 'dark' ? darkTheme : lightTheme;

  return (
    <AppRouterCacheProvider>
      <ThemeModeProvider value={themeMode}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <ThemeSync />
          {children}
        </MuiThemeProvider>
      </ThemeModeProvider>
    </AppRouterCacheProvider>
  );
}
