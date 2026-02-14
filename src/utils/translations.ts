/**
 * Translation utility and example usage
 * 
 * This file demonstrates how to use the language context in components
 */

import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Example translations object structure
 * Each component can have its own translations
 */
export const translations = {
  header: {
    title: {
      es: 'Simuladores Financieros',
      en: 'Financial Simulators',
    },
    skipToContent: {
      es: 'Saltar al contenido principal',
      en: 'Skip to main content',
    },
  },
  nav: {
    home: {
      es: 'Inicio',
      en: 'Home',
    },
    investment: {
      es: 'Inversión',
      en: 'Investment',
    },
    debt: {
      es: 'Deuda',
      en: 'Debt',
    },
    openMenu: {
      es: 'Abrir menú de navegación',
      en: 'Open navigation menu',
    },
  },
  debt: {
    pageTitle: {
      es: 'Simulador de Deuda con Abonos a Capital',
      en: 'Debt Simulator with Capital Payments',
    },
    loanData: {
      es: 'Datos del Préstamo',
      en: 'Loan Information',
    },
    loanAmount: {
      es: 'Monto del Préstamo',
      en: 'Loan Amount',
    },
    annualInterestRate: {
      es: 'Tasa de Interés Anual',
      en: 'Annual Interest Rate',
    },
    loanTerm: {
      es: 'Plazo del Préstamo (meses)',
      en: 'Loan Term (months)',
    },
    paymentFrequency: {
      es: 'Frecuencia de Pago',
      en: 'Payment Frequency',
    },
    monthly: {
      es: 'Mensual',
      en: 'Monthly',
    },
    biweekly: {
      es: 'Quincenal',
      en: 'Bi-weekly',
    },
    clear: {
      es: 'Limpiar',
      en: 'Clear',
    },
    calculating: {
      es: 'Calculando...',
      en: 'Calculating...',
    },
  },
  investment: {
    pageTitle: {
      es: 'Calculadora de Inversión Compuesta',
      en: 'Compound Investment Calculator',
    },
    initialInvestment: {
      es: 'Inversión Inicial',
      en: 'Initial Investment',
    },
    monthlyContribution: {
      es: 'Aporte Mensual',
      en: 'Monthly Contribution',
    },
    expectedReturn: {
      es: 'Rendimiento Esperado Anual',
      en: 'Expected Annual Return',
    },
    investmentPeriod: {
      es: 'Período de Inversión (años)',
      en: 'Investment Period (years)',
    },
  },
};

/**
 * Hook to get translated text
 * 
 * Example usage in a component:
 * 
 * ```tsx
 * const { t } = useTranslation();
 * 
 * return <h1>{t.header.title}</h1>;
 * ```
 */
export function useTranslation() {
  const { language } = useLanguage();
  
  const t = new Proxy(translations, {
    get(target, section: string) {
      return new Proxy(target[section as keyof typeof translations], {
        get(sectionTarget, key: string) {
          const translation = sectionTarget[key as keyof typeof sectionTarget];
          if (translation && typeof translation === 'object' && language in translation) {
            return translation[language];
          }
          return translation;
        },
      });
    },
  });
  
  return { t, language };
}
