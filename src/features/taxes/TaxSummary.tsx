/**
 * Narrative summary paragraph for tax results
 */

'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyCOP } from '@/utils/money';
import type { TaxResult } from '@/domain/taxes/taxes.types';

export interface TaxSummaryProps {
  results: TaxResult;
}

const INCREMENT_EXAMPLE = 100;

export function TaxSummary({ results }: TaxSummaryProps) {
  const { t } = useLanguage();
  const { input } = results;

  const periodicityLabel =
    input.periodicity === 'annual'
      ? t('taxes.form.annual').toLowerCase()
      : t('taxes.results.perMonth');

  const grossFormatted =
    input.periodicity === 'annual'
      ? formatCurrencyCOP(results.grossSalaryAnnual)
      : formatCurrencyCOP(results.grossSalaryMonthly);

  const taxesAnnual = results.retention * 12;
  const taxesFormatted = formatCurrencyCOP(taxesAnnual);
  const netAnnualFormatted = formatCurrencyCOP(results.netPayAnnual);
  const netMonthlyFormatted = formatCurrencyCOP(results.netPayMonthly);
  const effectiveRate = results.effectiveTaxRatePercent;
  const marginalRate = results.marginalTaxRatePercent;

  const taxIncrement = roundToCents(INCREMENT_EXAMPLE * (marginalRate / 100));
  const netIncrement = roundToCents(INCREMENT_EXAMPLE - taxIncrement);
  const incrementFormatted = formatCurrencyCOP(INCREMENT_EXAMPLE);
  const taxIncrementFormatted = formatCurrencyCOP(taxIncrement);
  const netIncrementFormatted = formatCurrencyCOP(netIncrement);

  const paragraph = t('taxes.summaryParagraph', {
    periodicityLabel,
    grossFormatted,
    taxesFormatted,
    netAnnualFormatted,
    netMonthlyFormatted,
    effectiveRate,
    marginalRate,
    incrementFormatted,
    taxIncrementFormatted,
    netIncrementFormatted,
  });

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">{t('taxes.summary')}</h2>
      <p className="text-base text-foreground-secondary leading-relaxed">{paragraph}</p>
    </div>
  );
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
