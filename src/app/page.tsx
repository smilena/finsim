/**
 * Home page - Welcome experience
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { TrendingUp, CreditCard, Calculator } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="min-w-0 max-w-full text-center mb-12 mt-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 sm:text-4xl md:text-5xl">
          {t('home.title')}
        </h1>
        <p className="text-xl text-foreground-secondary max-w-3xl mx-auto mt-4">
          {t('home.subtitle')}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/investment" className="group">
          <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary mr-4" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('investment.title')}
                </h2>
              </div>
              <p className="text-base text-foreground-secondary mb-4">
                {t('investment.subtitle')}
              </p>
              <p className="text-sm text-foreground-secondary">
                <strong>{t('common.calculate')}:</strong> {t('investment.finalValue')},{' '}
                {t('investment.interestEarned')}, {t('investment.breakdown').toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/debt" className="group">
          <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-12 w-12 text-secondary mr-4" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('debt.title')}
                </h2>
              </div>
              <p className="text-base text-foreground-secondary mb-4">
                {t('debt.subtitle')}
              </p>
              <p className="text-sm text-foreground-secondary">
                <strong>{t('common.calculate')}:</strong> {t('debt.totalInterest')},{' '}
                {t('debt.prepayment.title').toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/taxes" className="group">
          <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calculator className="h-12 w-12 text-info mr-4" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('taxes.title')}
                </h2>
              </div>
              <p className="text-base text-foreground-secondary mb-4">
                {t('taxes.subtitle')}
              </p>
              <p className="text-sm text-foreground-secondary">
                <strong>{t('common.calculate')}:</strong> {t('taxes.results.retention')},{' '}
                {t('taxes.results.netPay').toLowerCase()}, {t('taxes.summary').toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-16 text-center p-6 bg-surface rounded-lg">
        <p className="text-sm text-foreground-secondary">
          <strong>{t('home.privacy')}</strong> {t('home.privacyText')}
        </p>
      </div>
    </AppLayout>
  );
}
