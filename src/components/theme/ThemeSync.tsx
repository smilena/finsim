/**
 * Syncs theme mode from context to document for CSS variables (data-theme on html)
 */

'use client';

import { useEffect } from 'react';
import { useThemeModeContext } from '@/theme/ThemeModeContext';

/**
 * Applies current theme mode to document.documentElement as data-theme
 * so that CSS selectors [data-theme="light"] / [data-theme="dark"] apply.
 * Runs only on client to avoid hydration mismatch.
 */
export function ThemeSync() {
  const { mode } = useThemeModeContext();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  return null;
}
