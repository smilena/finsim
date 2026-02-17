/**
 * Investment simulator page
 */

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { InvestmentForm } from '@/features/investment/InvestmentForm';
import { InvestmentResults } from '@/features/investment/InvestmentResults';
import { InvestmentBreakdownTable } from '@/features/investment/InvestmentBreakdownTable';
import { InvestmentProfitabilityChart } from '@/features/investment/InvestmentProfitabilityChart';
import { useInvestmentSimulator } from '@/features/investment/useInvestmentSimulator';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InvestmentPage() {
  const { t } = useLanguage();
  const { inputs, results, errors, isCalculating, updateInput, calculate, reset } =
    useInvestmentSimulator();

  return (
    <AppLayout>
      <div className="min-w-0 max-w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2 sm:text-4xl">
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

            <div className="mb-8 min-w-0">
              <InvestmentProfitabilityChart breakdown={results.breakdown} />
            </div>

            <hr className="my-8 border-border" />

            <div className="mb-8">
              <InvestmentBreakdownTable breakdown={results.breakdown} />
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
