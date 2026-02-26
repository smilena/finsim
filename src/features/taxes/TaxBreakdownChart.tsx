/**
 * Iceberg-style breakdown: net pay (visible) vs taxes (below)
 * Uses stacked horizontal bar to show proportion
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartColors } from '@/hooks/useChartColors';
import { formatCurrencyCOP } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TaxResult } from '@/domain/taxes/taxes.types';

export interface TaxBreakdownChartProps {
  results: TaxResult;
}

export function TaxBreakdownChart({ results }: TaxBreakdownChartProps) {
  const { t } = useLanguage();
  const colors = useChartColors();

  const totalTaxes = results.retention + results.fsp;
  const total = results.netPayMonthly + totalTaxes;
  const netPercent = total > 0 ? (results.netPayMonthly / total) * 100 : 100;
  const taxPercent = total > 0 ? (totalTaxes / total) * 100 : 0;

  const data = [
    {
      segment: t('taxes.deductions.netPay'),
      value: results.netPayMonthly,
      percent: netPercent,
      fill: colors.debtWithPrepayment,
    },
    {
      segment: t('taxes.deductions.totalTaxes'),
      value: totalTaxes,
      percent: taxPercent,
      fill: colors.interest,
    },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t('taxes.chart.breakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 w-full" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="segment"
                width={75}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-foreground-secondary"
              />
              <Bar dataKey="value" stackId="a" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Legend
                formatter={(value, entry) => {
                  const item = entry?.payload as (typeof data)[0];
                  return (
                    <span className="text-foreground-secondary text-sm">
                      {value}: {formatCurrencyCOP(item?.value ?? 0)} ({item?.percent?.toFixed(1)}%)
                    </span>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-foreground-secondary mt-2 text-center">
          {t('taxes.deductions.netPay')}: {formatCurrencyCOP(results.netPayMonthly)} · {t('taxes.deductions.totalTaxes')}: {formatCurrencyCOP(results.retention + results.fsp)}
        </p>
      </CardContent>
    </Card>
  );
}
