/**
 * Interest savings chart - cumulative interest paid: without vs with prepayments
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
import type { AmortizationPayment } from '@/domain/debt/debt.types';

export interface InterestSavingsChartProps {
  baseSchedule: AmortizationPayment[];
  prepaymentSchedule: AmortizationPayment[];
  showComparison?: boolean;
}

interface ChartDataPoint {
  month: number;
  interestWithout: number;
  interestWith: number;
}

/**
 * Line chart comparing cumulative interest paid over time (without vs with prepayments)
 */
export function InterestSavingsChart({
  baseSchedule,
  prepaymentSchedule,
  showComparison = true,
}: InterestSavingsChartProps) {
  const { t } = useLanguage();
  const colors = useChartColors();

  const data: ChartDataPoint[] = baseSchedule.map((payment, index) => {
    const baseCumulative = baseSchedule
      .slice(0, index + 1)
      .reduce((sum, p) => sum + p.interestPaid, 0);
    const prepayCumulative = showComparison
      ? prepaymentSchedule
          .slice(0, index + 1)
          .reduce((sum, p) => sum + p.interestPaid, 0)
      : 0;
    return {
      month: payment.paymentNumber,
      interestWithout: baseCumulative,
      interestWith: prepayCumulative,
    };
  });

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
            {t('common.month')} {label}
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
        <CardTitle>{t('debt.chart.interestSavings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-0 w-full" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="month"
                stroke={colors.text}
                tick={{ fill: colors.text }}
                label={{
                  value: t('common.month'),
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
                dataKey="interestWithout"
                name={t('debt.chart.withoutPrepayment')}
                stroke={colors.debtWithoutPrepayment}
                strokeWidth={2}
                dot={false}
              />
              {showComparison && (
                <Line
                  type="monotone"
                  dataKey="interestWith"
                  name={t('debt.chart.withPrepayment')}
                  stroke={colors.debtWithPrepayment}
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
