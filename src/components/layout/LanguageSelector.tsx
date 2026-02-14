/**
 * Language selector - shows selected language and opens dropdown to change
 */

'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
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
}

/**
 * Language selector dropdown
 * - Trigger shows current language (flag + name)
 * - Dropdown to switch between ES/EN
 */
export function LanguageSelector({ fullWidth }: LanguageSelectorProps) {
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
          className={cn(
            'justify-between gap-2 border-border bg-input text-foreground hover:bg-muted',
            fullWidth && 'w-full'
          )}
          aria-label={`Idioma actual: ${current.label}`}
        >
          <span className="flex items-center gap-2">
            <span>{current.flag}</span>
            <span>{current.label}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={fullWidth ? 'start' : 'end'} className="min-w-[10rem]">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('es')}
          className="cursor-pointer"
        >
          <span className="mr-2">{languages.es.flag}</span>
          <span className={language === 'es' ? 'font-semibold' : ''}>
            {languages.es.label}
          </span>
          {language === 'es' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className="cursor-pointer"
        >
          <span className="mr-2">{languages.en.flag}</span>
          <span className={language === 'en' ? 'font-semibold' : ''}>
            {languages.en.label}
          </span>
          {language === 'en' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
