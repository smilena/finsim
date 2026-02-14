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
import { CHART_COLORS } from '@/lib/chart-config';
import { formatCurrency } from '@/utils/money';
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
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">Mes {label}</p>
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
    <Card>
      <CardHeader>
        <CardTitle>Evolución del Saldo de la Deuda</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.debtWithoutPrepayment} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.debtWithoutPrepayment} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.debtWithPrepayment} stopOpacity={0.6} />
                <stop offset="95%" stopColor={CHART_COLORS.debtWithPrepayment} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="month"
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text }}
              label={{ value: 'Mes', position: 'insideBottom', offset: -5, fill: CHART_COLORS.text }}
            />
            <YAxis
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text }}
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
              name="Sin Abonos"
              stroke={CHART_COLORS.debtWithoutPrepayment}
              fillOpacity={1}
              fill="url(#colorWithout)"
            />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="withPrepayment"
                name="Con Abonos"
                stroke={CHART_COLORS.debtWithPrepayment}
                fillOpacity={1}
                fill="url(#colorWith)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
