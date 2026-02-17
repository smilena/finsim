/**
 * Hook to manage theme mode (light/dark) - state lives in ThemeProvider, no persistence
 */

'use client';

import { useState, useCallback } from 'react';
import type { ThemeMode } from '@/types/common.types';
import { isThemeMode } from '@/types/common.types';

export interface UseThemeModeReturn {
  /**
   * Current theme mode
   */
  mode: ThemeMode;

  /**
   * Toggle between light and dark mode
   */
  toggleTheme: () => void;

  /**
   * Set theme mode explicitly
   */
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Hook to manage theme mode - state is held by the provider (ThemeProvider).
 * Does not persist; theme resets on page reload.
 */
export function useThemeMode(): UseThemeModeReturn {
  const [mode, setModeState] = useState<ThemeMode>('light');

  const setTheme = useCallback((newMode: ThemeMode) => {
    if (isThemeMode(newMode)) {
      setModeState(newMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { mode, toggleTheme, setTheme };
}
