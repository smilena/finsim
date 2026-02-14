/**
 * Investment breakdown table showing period-by-period growth
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
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import type { InvestmentPeriod } from '@/domain/investment/investment.types';

export interface InvestmentBreakdownTableProps {
  /**
   * Period-by-period breakdown
   */
  breakdown: InvestmentPeriod[];

  /**
   * Optional title
   */
  title?: string;

  /**
   * Maximum rows to show
   * @default undefined (show all)
   */
  maxRows?: number;
}

/**
 * Table showing investment growth period by period
 */
export function InvestmentBreakdownTable({
  breakdown,
  title,
  maxRows,
}: InvestmentBreakdownTableProps) {
  const { t } = useLanguage();
  
  // Limit rows if maxRows is specified
  const displayedBreakdown = maxRows ? breakdown.slice(0, maxRows) : breakdown;
  const hasMore = maxRows && breakdown.length > maxRows;
  const tableTitle = title || t('investment.breakdown');

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-4">{tableTitle}</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <strong>{t('investment.period')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('investment.invested')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('investment.interest')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('investment.balance')}</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedBreakdown.map((period, index) => (
                <TableRow
                  key={period.periodNumber}
                  className={index === displayedBreakdown.length - 1 ? 'border-b-2' : ''}
                >
                  <TableCell className="font-medium">{period.periodLabel}</TableCell>
                  <TableCell className="text-right">{formatCurrency(period.totalInvested)}</TableCell>
                  <TableCell className="text-right text-success">
                    {formatCurrency(period.interestEarned)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(period.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {hasMore && (
        <p className="text-sm text-foreground-secondary text-center mt-2">
          {t('common.showing')} {displayedBreakdown.length} {t('common.previous').toLowerCase()} {breakdown.length} {t('investment.period').toLowerCase()}s
        </p>
      )}
    </div>
  );
}
