/**
 * Settings page - language and other preferences
 */

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          {t('settings.title')}
        </h1>
        <p className="mb-8 text-base text-foreground-secondary">
          {t('settings.subtitle')}
        </p>

        <section className="max-w-md rounded-xl border border-border bg-card/50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {t('settings.languageLabel')}
          </h2>
          <LanguageSelector fullWidth />
        </section>
      </div>
    </AppLayout>
  );
}
