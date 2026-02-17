/**
 * Theme selector - Light / Dark mode
 */

'use client';

import { useThemeModeContext } from '@/theme/ThemeModeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThemeSelectorProps {
  fullWidth?: boolean;
}

/**
 * Theme selector: radio group for Light / Dark
 */
export function ThemeSelector({ fullWidth }: ThemeSelectorProps) {
  const { t } = useLanguage();
  const { mode, setTheme } = useThemeModeContext();

  return (
    <RadioGroup.Root
      value={mode}
      onValueChange={(value) => (value === 'light' || value === 'dark') && setTheme(value)}
      className={cn('flex gap-3', fullWidth && 'w-full flex-col sm:flex-row')}
      aria-label={t('settings.themeLabel')}
    >
      <label htmlFor="theme-light" className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-border bg-input px-4 py-3 transition-colors hover:bg-muted has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
        <RadioGroup.Item value="light" id="theme-light" className="sr-only" />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 text-warning">
          <Sun className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {t('settings.themeLight')}
        </span>
      </label>
      <label htmlFor="theme-dark" className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-border bg-input px-4 py-3 transition-colors hover:bg-muted has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
        <RadioGroup.Item value="dark" id="theme-dark" className="sr-only" />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary">
          <Moon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {t('settings.themeDark')}
        </span>
      </label>
    </RadioGroup.Root>
  );
}
