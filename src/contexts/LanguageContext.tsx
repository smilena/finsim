/**
 * Language context for managing app locale
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import esTranslations from '@/i18n/locales/es.json';
import enTranslations from '@/i18n/locales/en.json';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app-language';

const translations = {
  es: esTranslations,
  en: enTranslations,
};

// Helper function to get nested translation
function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}

// Simple interpolation function
function interpolate(str: string, options?: Record<string, string | number>): string {
  if (!options) return str;

  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return options[key] !== undefined ? String(options[key]) : match;
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Load language from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && (stored === 'es' || stored === 'en')) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string, options?: Record<string, string | number>): string => {
    const translation = getNestedTranslation(
      translations[language] as Record<string, unknown>,
      key
    );
    return interpolate(translation, options);
  };

  // Always provide the context, even before mounting
  // This prevents the "must be used within provider" error
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default implementation if context is not available
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
