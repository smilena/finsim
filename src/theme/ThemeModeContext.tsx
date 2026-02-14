/**
 * Context for theme mode - allows components to access theme state
 * without prop drilling
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ThemeMode } from '@/types/common.types';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export interface ThemeModeProviderProps {
  value: ThemeModeContextValue;
  children: ReactNode;
}

export function ThemeModeProvider({ value, children }: ThemeModeProviderProps) {
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeModeContext(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeModeContext must be used within ThemeProvider');
  }
  return context;
}
