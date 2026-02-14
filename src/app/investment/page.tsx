/**
 * Investment simulator page
 */

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { InvestmentForm } from '@/features/investment/InvestmentForm';
import { InvestmentResults } from '@/features/investment/InvestmentResults';
import { InvestmentBreakdownTable } from '@/features/investment/InvestmentBreakdownTable';
import { useInvestmentSimulator } from '@/features/investment/useInvestmentSimulator';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InvestmentPage() {
  const { t } = useLanguage();
  const { inputs, results, errors, isCalculating, updateInput, calculate, reset } =
    useInvestmentSimulator();

  return (
    <AppLayout>
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('investment.title')}
        </h1>
        <p className="text-base text-foreground-secondary mb-8">
          {t('investment.subtitle')}
        </p>

        <div className="mb-8">
          <InvestmentForm
            inputs={inputs}
            onInputChange={updateInput}
            onCalculate={calculate}
            onReset={reset}
            errors={errors}
            isCalculating={isCalculating}
          />
        </div>

        {results && (
          <>
            <div className="mb-8">
              <InvestmentResults results={results} />
            </div>

            <hr className="my-8 border-border" />

            <div className="mb-8">
              <InvestmentBreakdownTable
                breakdown={results.breakdown}
                maxRows={results.breakdown.length > 24 ? 12 : undefined}
              />
            </div>
          </>
        )}

        {!results && (
          <EmptyState
            title={`👆 ${t('investment.title')}`}
            description={t('investment.subtitle')}
          />
        )}
      </div>
    </AppLayout>
  );
}
