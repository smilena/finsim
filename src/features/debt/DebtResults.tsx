/**
 * Debt calculation results display
 */

'use client';

import { ResultCard } from '@/components/common/ResultCard';
import { formatCurrency } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrepaymentResult } from '@/domain/debt/debt.types';
import { CreditCard, TrendingUp, Calendar } from 'lucide-react';

export interface DebtResultsProps {
  results: PrepaymentResult;
}

export function DebtResults({ results }: DebtResultsProps) {
  const { t } = useLanguage();
  const years = Math.floor(results.baseScenario.actualTermMonths / 12);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-6">{t('debt.results')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard
          title={t('debt.monthlyPayment')}
          value={formatCurrency(results.baseScenario.monthlyPayment)}
          subtitle={t('debt.regularPayment')}
          icon={<CreditCard className="h-8 w-8 text-foreground-secondary" />}
        />
        <ResultCard
          title={t('debt.totalInterest')}
          value={formatCurrency(results.baseScenario.totalInterest)}
          subtitle={t('debt.withoutPrepayments')}
          icon={<TrendingUp className="h-8 w-8 text-warning" />}
        />
        <ResultCard
          title={t('debt.originalTerm')}
          value={`${results.baseScenario.actualTermMonths} ${t('common.months').toLowerCase()}`}
          subtitle={`${years} ${years === 1 ? t('common.year') : t('common.years').toLowerCase()}`}
          icon={<Calendar className="h-8 w-8 text-info" />}
        />
      </div>
    </div>
  );
}
