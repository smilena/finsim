/**
 * Debt simulator page
 */

'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { DebtForm } from '@/features/debt/DebtForm';
import { DebtResults } from '@/features/debt/DebtResults';
import { AmortizationTable } from '@/features/debt/AmortizationTable';
import { DebtEvolutionChart } from '@/features/debt/DebtEvolutionChart';
import { InterestSavingsChart } from '@/features/debt/InterestSavingsChart';
import { PrepaymentForm } from '@/features/debt/PrepaymentForm';
import { PrepaymentList } from '@/features/debt/PrepaymentList';
import { ComparisonCard } from '@/features/debt/ComparisonCard';
import { useDebtSimulator } from '@/features/debt/useDebtSimulator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';

export default function DebtPage() {
  const { t } = useLanguage();
  const [formKey, setFormKey] = useState(0);
  const {
    inputs,
    prepayments,
    results,
    errors,
    isCalculating,
    updateInput,
    addPrepayment,
    removePrepayment,
    calculate,
    reset,
  } = useDebtSimulator();

  const handleReset = () => {
    reset();
    setFormKey((k) => k + 1);
  };

  const handleClearErrors = () => {
    // In a real app, you'd clear errors from the hook
    // For now, we'll just handle them in the form
  };

  return (
    <AppLayout>
      <div className="min-w-0 max-w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2 sm:text-4xl">
          {t('debt.title')}
        </h1>
        <p className="text-base text-foreground-secondary mb-8">
          {t('debt.subtitle')}
        </p>

        {/* Overview */}
        <div className="mb-8">
          <p className="text-sm text-foreground-secondary mb-6">
            <strong>{t('debt.help')}</strong> {t('debt.helpText')}
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('debt.infoAlert')}
            </AlertDescription>
          </Alert>
        </div>

        {/* Loan Form - key forces remount on reset so inputs show cleared values */}
        <div className="mb-8">
          <DebtForm
            key={formKey}
            inputs={inputs}
            onInputChange={updateInput}
            onCalculate={calculate}
            onReset={handleReset}
            errors={errors}
            isCalculating={isCalculating}
          />
        </div>

        {/* Prepayment Section - only show if loan is calculated */}
        {results && (
          <>
            <hr className="my-8 border-border" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {t('debt.prepayment.title')}
              </h2>
              <p className="text-sm text-foreground-secondary mb-6">
                {t('debt.prepayment.subtitle')}
              </p>

              {/* Current Results */}
              <div className="mb-8">
                <DebtResults results={results} />
              </div>

              {/* Charts - before tables */}
              <div className="mb-8 min-w-0 space-y-8">
                <DebtEvolutionChart
                  baseSchedule={results.baseScenario.schedule}
                  prepaymentSchedule={results.prepaymentScenario.schedule}
                  showComparison={prepayments.length > 0}
                />
                <InterestSavingsChart
                  baseSchedule={results.baseScenario.schedule}
                  prepaymentSchedule={results.prepaymentScenario.schedule}
                  showComparison={prepayments.length > 0}
                />
              </div>

              {/* Prepayment Form */}
              <div className="mb-8">
                <PrepaymentForm
                  maxMonth={results.baseScenario.actualTermMonths}
                  onAddPrepayment={addPrepayment}
                  errors={errors}
                  onClearErrors={handleClearErrors}
                />
              </div>

              {/* Prepayment List */}
              {prepayments.length > 0 && (
                <div className="mb-8">
                  <PrepaymentList prepayments={prepayments} onRemovePrepayment={removePrepayment} />
                </div>
              )}

              {/* Comparison */}
              {prepayments.length > 0 && (
                <div className="mb-8">
                  <ComparisonCard results={results} />
                </div>
              )}

              {/* Amortization Schedule */}
              <div className="mb-8">
                <AmortizationTable
                  schedule={results.prepaymentScenario.schedule}
                />
              </div>
            </div>
          </>
        )}

        {/* No results message */}
        {!results && (
          <EmptyState
            title={t('debt.emptyTitle')}
            description={t('debt.emptyDescription')}
          />
        )}
      </div>
    </AppLayout>
  );
}
