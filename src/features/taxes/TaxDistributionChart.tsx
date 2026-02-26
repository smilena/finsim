/**
 * Pie chart: distribution of net pay vs total taxes
 */

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartColors } from '@/hooks/useChartColors';
import { formatCurrencyCOP } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TaxResult } from '@/domain/taxes/taxes.types';

export interface TaxDistributionChartProps {
  results: TaxResult;
}

export function TaxDistributionChart({ results }: TaxDistributionChartProps) {
  const { t } = useLanguage();
  const colors = useChartColors();

  const totalTaxes = results.retention + results.fsp;
  const total = results.netPayMonthly + totalTaxes;
  const netPercent = total > 0 ? (results.netPayMonthly / total) * 100 : 0;
  const taxPercent = total > 0 ? (totalTaxes / total) * 100 : 0;

  const data = [
    {
      name: t('taxes.deductions.netPay'),
      value: results.netPayMonthly,
      percent: netPercent,
      color: colors.debtWithPrepayment,
    },
    {
      name: t('taxes.deductions.totalTaxes'),
      value: totalTaxes,
      percent: taxPercent,
      color: colors.interest,
    },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{p.name}</p>
          <p className="text-sm text-foreground-secondary">
            {formatCurrencyCOP(p.value)} ({p.payload.percent.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) return null;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t('taxes.chart.distribution')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 w-full" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry) => {
                  const payload = entry?.payload as { percent?: number } | undefined;
                  return (
                    <span className="text-foreground-secondary text-sm">
                      {(payload?.percent ?? 0).toFixed(1)}% {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 justify-center text-sm text-foreground-secondary">
          <span>{t('taxes.results.effectiveRate')}: {results.effectiveTaxRatePercent}%</span>
          <span>{t('taxes.results.marginalRate')}: {results.marginalTaxRatePercent}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
