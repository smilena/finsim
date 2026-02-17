/**
 * Investment breakdown table showing period-by-period growth
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/money';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/**
 * Table showing investment growth period by period with pagination
 */
export function InvestmentBreakdownTable({
  breakdown,
  title,
}: InvestmentBreakdownTableProps) {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const tableTitle = title || t('investment.breakdown');

  const totalPages = Math.ceil(breakdown.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, breakdown.length);
  const displayedBreakdown = breakdown.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-w-0 max-w-full">
      <h2 className="text-xl font-semibold text-foreground mb-4 sm:text-2xl">{tableTitle}</h2>

      <Card className="min-w-0">
        <CardContent className="p-0 min-w-0 overflow-hidden">
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

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-secondary">
            {t('debt.amortization.rowsPerPage')}:
          </span>
          <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground-secondary">
            {t('debt.amortization.showingOf', {
              shown: `${startIndex + 1}-${endIndex}`,
              total: breakdown.length,
            })}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label={t('common.previous')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-foreground-secondary">
                  {page}
                </span>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label={t('common.next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
