/**
 * Hook to manage theme mode (light/dark) with localStorage persistence
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { THEME_STORAGE_KEY } from '@/types/common.types';
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
 * Hook to manage theme mode with localStorage persistence
 *
 * - Read theme preference from localStorage on mount
 * - Persist theme preference to localStorage on change
 * - localStorage key: 'finanzas-theme-mode'
 */
export function useThemeMode(): UseThemeModeReturn {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isThemeMode(stored)) {
      setModeState(stored);
    }
  }, [mounted]);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  return { mode, toggleTheme, setTheme };
}
