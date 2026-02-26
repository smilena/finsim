/**
 * Tax calculation results - summary cards
 */

'use client';

import { ResultCard } from '@/components/common/ResultCard';
import { formatCurrencyCOP } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TaxResult } from '@/domain/taxes/taxes.types';
import { Wallet, Receipt, Percent } from 'lucide-react';

export interface TaxResultsProps {
  results: TaxResult;
}

export function TaxResults({ results }: TaxResultsProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-6">{t('taxes.results.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard
          title={t('taxes.results.netPay')}
          value={formatCurrencyCOP(results.netPayMonthly)}
          subtitle={t('taxes.results.perMonth')}
          icon={<Wallet className="h-8 w-8 text-success" />}
          variant="success"
        />
        <ResultCard
          title={t('taxes.results.totalTaxes')}
          value={formatCurrencyCOP(results.retention + results.fsp)}
          subtitle={t('taxes.results.perMonth') + (results.fsp > 0 ? ` (${t('taxes.deductions.retention')} + FSP)` : '')}
          icon={<Receipt className="h-8 w-8 text-warning" />}
          variant="warning"
        />
        <ResultCard
          title={t('taxes.results.effectiveRate')}
          value={`${results.effectiveTaxRatePercent}%`}
          subtitle={t('taxes.results.marginalRate') + `: ${results.marginalTaxRatePercent}%`}
          icon={<Percent className="h-8 w-8 text-info" />}
          variant="info"
        />
      </div>
    </div>
  );
}
