/**
 * Amortization schedule table
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
import type { AmortizationPayment } from '@/domain/debt/debt.types';

export interface AmortizationTableProps {
  schedule: AmortizationPayment[];
  title?: string;
  maxRows?: number;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function AmortizationTable({
  schedule,
  title,
}: AmortizationTableProps) {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  
  const tableTitle = title || t('debt.amortization.title');

  // Calculate pagination
  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, schedule.length);
  const displayedSchedule = schedule.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-4">{tableTitle}</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <strong>{t('common.month')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('debt.amortization.payment')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('debt.amortization.principal')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('debt.amortization.interest')}</strong>
                </TableHead>
                <TableHead className="text-right">
                  <strong>{t('debt.amortization.balance')}</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSchedule.map((payment, index) => (
                <TableRow
                  key={payment.paymentNumber}
                  className={index === displayedSchedule.length - 1 ? 'border-b-2 font-semibold' : ''}
                >
                  <TableCell>{payment.paymentLabel}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.paymentAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.principalPaid)}</TableCell>
                  <TableCell className="text-right text-warning">
                    {formatCurrency(payment.interestPaid)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.remainingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        {/* Rows per page selector */}
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

        {/* Page info and navigation */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground-secondary">
            {t('debt.amortization.showingOf', { shown: `${startIndex + 1}-${endIndex}`, total: schedule.length })}
          </span>
          
          <div className="flex items-center gap-1">
            {/* Previous button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {pageNumbers.map((page, index) => (
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
            ))}

            {/* Next button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
