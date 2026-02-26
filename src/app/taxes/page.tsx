/**
 * Tax (salary withholding) calculator page - Colombia 2026
 */

'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { TaxForm } from '@/features/taxes/TaxForm';
import { TaxResults } from '@/features/taxes/TaxResults';
import { DeductionsTable } from '@/features/taxes/DeductionsTable';
import { TaxDistributionChart } from '@/features/taxes/TaxDistributionChart';
import { TaxBreakdownChart } from '@/features/taxes/TaxBreakdownChart';
import { TaxSummary } from '@/features/taxes/TaxSummary';
import { useTaxCalculator } from '@/features/taxes/useTaxCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';

export default function TaxesPage() {
  const { t } = useLanguage();
  const [formKey, setFormKey] = useState(0);
  const {
    inputs,
    results,
    errors,
    isCalculating,
    updateInput,
    calculate,
    reset,
  } = useTaxCalculator();

  const handleReset = () => {
    reset();
    setFormKey((k) => k + 1);
  };

  return (
    <AppLayout>
      <div className="min-w-0 max-w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2 sm:text-4xl">
          {t('taxes.title')}
        </h1>
        <p className="text-base text-foreground-secondary mb-8">
          {t('taxes.subtitle')}
        </p>

        <div className="mb-8">
          <p className="text-sm text-foreground-secondary mb-6">
            <strong>{t('taxes.help')}</strong> {t('taxes.helpText')}
          </p>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{t('taxes.infoAlert')}</AlertDescription>
          </Alert>
        </div>

        <div className="mb-8">
          <TaxForm
            key={formKey}
            inputs={inputs}
            onInputChange={updateInput}
            onCalculate={calculate}
            onReset={handleReset}
            errors={errors}
            isCalculating={isCalculating}
          />
        </div>

        {results && (
          <>
            <hr className="my-8 border-border" />

            <div className="mb-8">
              <TaxResults results={results} />
            </div>

            <div className="mb-8 min-w-0 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <DeductionsTable results={results} />
              <TaxDistributionChart results={results} />
            </div>

            <div className="mb-8 min-w-0">
              <TaxBreakdownChart results={results} />
            </div>

            <div className="mb-8">
              <TaxSummary results={results} />
            </div>
          </>
        )}

        {!results && (
          <EmptyState
            title={t('taxes.emptyTitle')}
            description={t('taxes.emptyDescription')}
          />
        )}
      </div>
    </AppLayout>
  );
}
