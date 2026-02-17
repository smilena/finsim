/**
 * Debt comparison card
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrepaymentResult } from '@/domain/debt/debt.types';

export interface ComparisonCardProps {
  results: PrepaymentResult;
}

export function ComparisonCard({ results }: ComparisonCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="min-w-0 bg-gradient-to-br from-surface via-surface to-success/10">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {t('debt.comparison.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div>
            {/* Monthly Payment */}
            <div className="mb-6">
              <p className="text-sm text-foreground-secondary mb-1">{t('debt.monthlyPayment')}</p>
              <p className="text-3xl font-medium text-foreground">
                {formatCurrency(results.prepaymentScenario.monthlyPayment)}
              </p>
              {results.newMonthlyPayment && results.newMonthlyPayment !== results.baseScenario.monthlyPayment && (
                <p className="text-sm text-success mt-2">
                  {t('debt.comparison.newPayment', { 
                    amount: formatCurrency(results.newMonthlyPayment) 
                  })}
                </p>
              )}
            </div>
            
            {/* Loan Term */}
            <div>
              <p className="text-sm text-foreground-secondary mb-1">
                {t('debt.term')}
              </p>
              <p className="text-3xl font-medium text-foreground">
                {results.prepaymentScenario.actualTermMonths} {t('common.months').toLowerCase()}
              </p>
              {results.termReduction && results.termReduction > 0 && (
                <p className="text-sm text-success mt-2">
                  {t('debt.comparison.termReduced', { months: results.termReduction })}
                </p>
              )}
              <p className="text-sm text-foreground-secondary mt-1">
                {t('debt.originalTerm')}: {results.baseScenario.actualTermMonths} {t('common.months').toLowerCase()}
              </p>
            </div>
          </div>
          
          {/* Right column */}
          <div>
            {/* Total Interest */}
            <div className="mb-6">
              <p className="text-sm text-foreground-secondary mb-1">
                {t('debt.totalInterest')}
              </p>
              <p className="text-3xl font-medium text-foreground">
                {formatCurrency(results.prepaymentScenario.totalInterest)}
              </p>
              <p className="text-sm text-foreground-secondary mt-1">
                {t('debt.withoutPrepayments')}: {formatCurrency(results.baseScenario.totalInterest)}
              </p>
            </div>
            
            {/* Interest Savings */}
            <div>
              <p className="text-sm text-foreground-secondary mb-1">{t('debt.comparison.savings')}</p>
              <p className="text-4xl font-semibold text-success">
                {formatCurrency(results.interestSavings)}
              </p>
              <p className="text-sm text-success mt-1">
                {t('debt.comparison.savingsPercent', { 
                  percent: formatPercentage(results.interestSavingsPercent, 1) 
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
