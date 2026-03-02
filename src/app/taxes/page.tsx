/**
 * Tax (salary withholding) calculator page - Colombia 2026
 */

'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrencyCOP } from '@/utils/money';
import { SMLMV_2026, AUXILIO_TRANSPORTE_2026 } from '@/domain/taxes/taxes.constants';
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

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t('taxes.minWageCard.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-secondary">
                  {t('taxes.minWageCard.baseSalary')}
                </span>
                <span className="font-medium">{formatCurrencyCOP(SMLMV_2026)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-secondary">
                  {t('taxes.minWageCard.transportAllowance')}
                </span>
                <span className="font-medium">
                  {formatCurrencyCOP(AUXILIO_TRANSPORTE_2026)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm">
                <span className="font-medium">{t('taxes.minWageCard.total')}</span>
                <span className="font-semibold">
                  {formatCurrencyCOP(SMLMV_2026 + AUXILIO_TRANSPORTE_2026)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {t('taxes.minWageCard.source')}
              </p>
            </CardContent>
          </Card>

          <div className="min-w-0 space-y-4">
            <p className="text-sm text-foreground-secondary">
              <strong>{t('taxes.help')}</strong> {t('taxes.helpText')}
            </p>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{t('taxes.infoAlert')}</AlertDescription>
            </Alert>
          </div>
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
