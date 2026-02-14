/**
 * Theme toggle button - switches between light and dark modes
 */

'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '@/types/common.types';

export interface ThemeToggleProps {
  /**
   * Current theme mode
   */
  mode: ThemeMode;

  /**
   * Callback when toggle clicked
   */
  onToggle: () => void;
}

/**
 * Theme toggle button
 * - Icon button with sun/moon icon
 * - Descriptive aria-label for accessibility
 */
export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const isDark = mode === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
