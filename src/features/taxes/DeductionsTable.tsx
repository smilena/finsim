/**
 * Table of salary deductions and net pay
 */

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyCOP } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TaxResult } from '@/domain/taxes/taxes.types';

export interface DeductionsTableProps {
  results: TaxResult;
}

export function DeductionsTable({ results }: DeductionsTableProps) {
  const { t } = useLanguage();

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t('taxes.chart.deductionsTable')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
<TableHeader>
          <TableRow>
            <TableHead className="text-foreground">{t('taxes.deductions.concept')}</TableHead>
            <TableHead className="text-right">{t('taxes.deductions.amount')}</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {results.deductionLines.map((line) => (
              <TableRow key={line.labelKey}>
                <TableCell className="text-foreground-secondary">{t(line.labelKey)}</TableCell>
                <TableCell className="text-right font-medium">
                  {line.amount < 0
                    ? `- ${formatCurrencyCOP(Math.abs(line.amount))}`
                    : formatCurrencyCOP(line.amount)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="text-foreground">
                <span className="font-semibold">{t('taxes.deductions.totalTaxes')}</span>
                <span className="block text-xs text-foreground-secondary mt-0.5">
                  ({results.fsp > 0 ? t('taxes.deductions.totalTaxesBreakdown') : t('taxes.deductions.totalTaxesBreakdownRetentionOnly')})
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">
                - {formatCurrencyCOP(results.retention + results.fsp)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-foreground font-bold">{t('taxes.deductions.netPay')}</TableCell>
              <TableCell className="text-right text-4xl font-semibold text-primary">
                {formatCurrencyCOP(results.netPayMonthly)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
