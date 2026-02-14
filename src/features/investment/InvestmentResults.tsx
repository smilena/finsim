/**
 * Investment calculation results display
 */

'use client';

import { ResultCard } from '@/components/common/ResultCard';
import { formatCurrency, formatPercentage } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { InvestmentResult } from '@/domain/investment/investment.types';
import { TrendingUp, DollarSign, Wallet } from 'lucide-react';

export interface InvestmentResultsProps {
  /**
   * Calculation results
   */
  results: InvestmentResult;
}

/**
 * Display investment calculation results
 */
export function InvestmentResults({ results }: InvestmentResultsProps) {
  const { t } = useLanguage();
  const returnOnInvestment = (results.totalInterestEarned / results.totalInvested) * 100;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-6">{t('investment.results')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard
          title={t('investment.totalInvested')}
          value={formatCurrency(results.totalInvested)}
          subtitle={t('investment.invested')}
          icon={<DollarSign className="h-8 w-8 text-foreground-secondary" />}
        />

        <ResultCard
          title={t('investment.interestEarned')}
          value={formatCurrency(results.totalInterestEarned)}
          subtitle={`${t('investment.returnPercent')}: ${formatPercentage(returnOnInvestment, 1)}`}
          variant="success"
          icon={<TrendingUp className="h-8 w-8 text-success" />}
        />

        <ResultCard
          title={t('investment.finalValue')}
          value={formatCurrency(results.finalValue)}
          subtitle={t('investment.balance')}
          variant="info"
          icon={<Wallet className="h-8 w-8 text-info" />}
        />
      </div>
    </div>
  );
}
