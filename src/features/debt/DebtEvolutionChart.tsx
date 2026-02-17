/**
 * Debt evolution chart showing balance over time
 */

'use client';

import {
  AreaChart,
  Area,
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
import type { AmortizationPayment } from '@/domain/debt/debt.types';

export interface DebtEvolutionChartProps {
  /**
   * Base scenario schedule (without prepayments)
   */
  baseSchedule: AmortizationPayment[];

  /**
   * Prepayment scenario schedule
   */
  prepaymentSchedule: AmortizationPayment[];

  /**
   * Whether to show prepayment scenario
   */
  showComparison?: boolean;
}

interface ChartDataPoint {
  month: number;
  withoutPrepayment: number;
  withPrepayment?: number;
}

/**
 * Chart showing debt balance evolution over time
 */
export function DebtEvolutionChart({
  baseSchedule,
  prepaymentSchedule,
  showComparison = true,
}: DebtEvolutionChartProps) {
  const { t } = useLanguage();
  const colors = useChartColors();
  // Prepare chart data
  const data: ChartDataPoint[] = baseSchedule.map((payment, index) => ({
    month: payment.paymentNumber,
    withoutPrepayment: payment.remainingBalance,
    withPrepayment: showComparison ? prepaymentSchedule[index]?.remainingBalance || 0 : undefined,
  }));

  // Custom tooltip
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
          <p className="text-sm font-medium text-foreground mb-2">{t('common.month')} {label}</p>
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
        <CardTitle>{t('debt.chart.evolution')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 w-full" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWithout-debt-evol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.debtWithoutPrepayment} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.debtWithoutPrepayment} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWith-debt-evol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.debtWithPrepayment} stopOpacity={0.6} />
                <stop offset="95%" stopColor={colors.debtWithPrepayment} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="month"
              stroke={colors.text}
              tick={{ fill: colors.text }}
              label={{ value: t('common.month'), position: 'insideBottom', offset: -5, fill: colors.text }}
            />
            <YAxis
              stroke={colors.text}
              tick={{ fill: colors.text }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Area
              type="monotone"
              dataKey="withoutPrepayment"
              name={t('debt.chart.withoutPrepayment')}
              stroke={colors.debtWithoutPrepayment}
              fillOpacity={1}
              fill="url(#colorWithout-debt-evol)"
            />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="withPrepayment"
                name={t('debt.chart.withPrepayment')}
                stroke={colors.debtWithPrepayment}
                fillOpacity={1}
                fill="url(#colorWith-debt-evol)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
