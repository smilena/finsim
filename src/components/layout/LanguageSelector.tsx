/**
 * Language selector - EN/ES toggle
 */

'use client';

import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useThemeModeContext } from '@/theme/ThemeModeContext';
import { cn } from '@/lib/utils';

export interface LanguageSelectorProps {
  /** Full-width style for sidebar */
  fullWidth?: boolean;
  /** Compact trigger: only flag (for collapsed sidebar) */
  compact?: boolean;
}

/**
 * Language selector toggle (EN/ES)
 */
export function LanguageSelector({ fullWidth = false, compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const { mode } = useThemeModeContext();
  const isCollapsedCompact = compact && !fullWidth;
  const isLight = mode === 'light';

  const activeVariant = isLight ? 'default' : 'secondary';

  return (
    <div
      role="group"
      aria-label={t('nav.selectLanguage')}
      className={cn(
        'inline-flex shrink-0 rounded-full border-2 border-border shadow-sm',
        isLight ? 'bg-muted' : 'bg-input',
        isCollapsedCompact ? 'flex-col items-stretch p-0.5 w-12' : 'items-center',
        !isCollapsedCompact && (compact ? 'p-0.5' : 'p-1'),
        fullWidth ? 'w-full' : 'w-fit'
      )}
    >
      <Button
        type="button"
        variant={language === 'en' ? activeVariant : 'ghost'}
        size="sm"
        className={cn(
          'rounded-full shadow-none',
          isCollapsedCompact
            ? 'h-7 w-full px-0 text-[11px] leading-none'
            : compact
              ? 'h-7 px-0 w-10'
              : 'h-8 px-3',
          fullWidth && 'flex-1',
          fullWidth && compact && 'w-auto px-3'
        )}
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en' as Language)}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={language === 'es' ? activeVariant : 'ghost'}
        size="sm"
        className={cn(
          'rounded-full shadow-none',
          isCollapsedCompact
            ? 'h-7 w-full px-0 text-[11px] leading-none'
            : compact
              ? 'h-7 px-0 w-10'
              : 'h-8 px-3',
          fullWidth && 'flex-1',
          fullWidth && compact && 'w-auto px-3'
        )}
        aria-pressed={language === 'es'}
        onClick={() => setLanguage('es' as Language)}
      >
        ES
      </Button>
    </div>
  );
}
