/**
 * Prepayment list component
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2 } from 'lucide-react';
import type { Prepayment } from '@/domain/debt/debt.types';

export interface PrepaymentListProps {
  prepayments: Prepayment[];
  onRemovePrepayment: (index: number) => void;
}

export function PrepaymentList({ prepayments, onRemovePrepayment }: PrepaymentListProps) {
  const { t } = useLanguage();
  
  if (prepayments.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        {t('debt.prepayment.registered', { count: prepayments.length })}
      </h3>
      <ul className="space-y-2">
        {prepayments.map((prepayment, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-1">
                <p className="text-base text-foreground">
                  {t('debt.prepayment.inMonth', { 
                    month: prepayment.monthNumber, 
                    amount: `$${prepayment.amount.toLocaleString()}` 
                  })}
                </p>
                <Badge variant={prepayment.strategy === 'reduce-term' ? 'default' : 'secondary'}>
                  {prepayment.strategy === 'reduce-term' 
                    ? t('debt.prepayment.reduceTermShort')
                    : t('debt.prepayment.reducePaymentShort')
                  }
                </Badge>
              </div>
              <p className="text-sm text-foreground-secondary">
                {t('debt.comparison.strategy')}: {
                  prepayment.strategy === 'reduce-term'
                    ? t('debt.prepayment.reduceTerm')
                    : t('debt.prepayment.reducePayment')
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemovePrepayment(index)}
              aria-label={t('debt.prepayment.delete')}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
