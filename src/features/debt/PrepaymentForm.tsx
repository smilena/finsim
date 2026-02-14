/**
 * Prepayment input form
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { NumberInput } from '@/components/common/NumberInput';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Prepayment, PrepaymentStrategy } from '@/domain/debt/debt.types';
import type { ValidationErrors } from '@/types/common.types';

export interface PrepaymentFormProps {
  maxMonth: number;
  onAddPrepayment: (prepayment: Prepayment) => void;
  errors: ValidationErrors;
  onClearErrors: () => void;
}

export function PrepaymentForm({
  maxMonth,
  onAddPrepayment,
  errors,
  onClearErrors,
}: PrepaymentFormProps) {
  const { t } = useLanguage();
  const [monthNumber, setMonthNumber] = useState<number>(1);
  const [amount, setAmount] = useState<number>(1);
  const [strategy, setStrategy] = useState<PrepaymentStrategy>('reduce-term');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prepayment: Prepayment = { monthNumber, amount, strategy };
    onAddPrepayment(prepayment);
    setMonthNumber(1);
    setAmount(1);
    setStrategy('reduce-term');
  };

  return (
    <div className="p-6 border border-border rounded-lg mt-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">{t('debt.prepayment.strategy')}</Label>
            <RadioGroup
              value={strategy}
              onValueChange={(value) => {
                setStrategy(value as PrepaymentStrategy);
                onClearErrors();
              }}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduce-term" id="reduce-term" />
                <Label htmlFor="reduce-term" className="font-normal cursor-pointer">
                  {t('debt.prepayment.reduceTerm')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduce-payment" id="reduce-payment" />
                <Label htmlFor="reduce-payment" className="font-normal cursor-pointer">
                  {t('debt.prepayment.reducePayment')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <NumberInput
              label={t('debt.prepayment.month')}
              value={monthNumber}
              onChange={(value) => {
                setMonthNumber(value);
                onClearErrors();
              }}
              error={errors.monthNumber}
              constraints={{ min: 1, max: maxMonth, step: 1 }}
              helperText={t('debt.prepayment.monthHelper', { max: maxMonth })}
              required
            />
            <NumberInput
              label={t('debt.prepayment.amount')}
              value={amount}
              onChange={(value) => {
                setAmount(value);
                onClearErrors();
              }}
              error={errors.amount}
              prefix="$"
              constraints={{ min: 0.01, max: 100000000, step: 0.01 }}
              required
            />
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <Button type="submit" size="sm">
              {t('debt.prepayment.add')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
