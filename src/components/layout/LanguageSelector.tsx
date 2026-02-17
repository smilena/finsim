/**
 * Language selector - shows selected language and opens dropdown to change
 */

'use client';

import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const languages = {
  es: { label: 'Español', flag: '🇪🇸' },
  en: { label: 'English', flag: '🇺🇸' },
};

export interface LanguageSelectorProps {
  /** Full-width style for sidebar */
  fullWidth?: boolean;
  /** Compact trigger: only flag (for collapsed sidebar) */
  compact?: boolean;
}

/**
 * Language selector dropdown
 * - Trigger shows only the current language flag
 * - Dropdown: flags only and check when active
 */
export function LanguageSelector({ fullWidth = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const current = languages[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'border-border bg-input text-foreground hover:bg-muted text-lg',
            fullWidth && 'w-full'
          )}
          aria-label={`Idioma actual: ${current.label}`}
        >
          {current.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={fullWidth ? 'start' : 'end'} className="w-fit min-w-0 border-0 shadow-none">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('es')}
          className="cursor-pointer"
          aria-label="Español"
        >
          <span className="mr-2">{languages.es.flag}</span>
          {language === 'es' && <span className="ml-1">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className="cursor-pointer"
          aria-label="English"
        >
          <span className="mr-2">{languages.en.flag}</span>
          {language === 'en' && <span className="ml-1">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
