/**
 * Investment profitability chart - balance and total invested over time
 */

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartColors } from '@/hooks/useChartColors';
import { formatCurrency } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { InvestmentPeriod } from '@/domain/investment/investment.types';

export interface InvestmentProfitabilityChartProps {
  breakdown: InvestmentPeriod[];
}

/**
 * Line chart showing balance and total invested over periods
 */
export function InvestmentProfitabilityChart({
  breakdown,
}: InvestmentProfitabilityChartProps) {
  const { t } = useLanguage();
  const colors = useChartColors();

  const data = breakdown.map((p) => ({
    period: p.periodNumber,
    balance: p.balance,
    totalInvested: p.totalInvested,
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-lg">
          <p className="mb-2 text-sm font-medium text-foreground">
            {t('investment.period')} {label}
          </p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t('investment.chart.profitability')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 w-full" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="period"
                stroke={colors.text}
                tick={{ fill: colors.text }}
                label={{
                  value: t('investment.period'),
                  position: 'insideBottom',
                  offset: -5,
                  fill: colors.text,
                }}
              />
              <YAxis
                stroke={colors.text}
                tick={{ fill: colors.text }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="balance"
                name={t('investment.balance')}
                stroke={colors.investment}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="totalInvested"
                name={t('investment.invested')}
                stroke={colors.principal}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
