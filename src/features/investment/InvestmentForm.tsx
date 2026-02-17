/**
 * Investment simulator input form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '@/components/common/NumberInput';
import { SelectField } from '@/components/common/SelectField';
import { INPUT_CONSTRAINTS } from '@/types/common.types';
import { useLanguage } from '@/contexts/LanguageContext';
import type { InvestmentInput, CompoundingFrequency } from '@/domain/investment/investment.types';
import type { ValidationErrors } from '@/types/common.types';
import { Loader2 } from 'lucide-react';

export interface InvestmentFormProps {
  /**
   * Current input values
   */
  inputs: InvestmentInput;

  /**
   * Update handler for input changes
   */
  onInputChange: (field: keyof InvestmentInput, value: string | number) => void;

  /**
   * Calculate handler
   */
  onCalculate: () => void;

  /**
   * Reset handler
   */
  onReset: () => void;

  /**
   * Validation errors
   */
  errors: ValidationErrors;

  /**
   * Whether calculation is in progress
   */
  isCalculating: boolean;
}

/**
 * Investment input form
 */
export function InvestmentForm({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
  errors,
  isCalculating,
}: InvestmentFormProps) {
  const { t } = useLanguage();
  
  const compoundingOptions = [
    { value: 'monthly', label: t('investment.compoundingMonthly') },
    { value: 'quarterly', label: t('investment.compoundingQuarterly') },
    { value: 'annually', label: t('investment.compoundingAnnually') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  const years = Math.floor(inputs.durationMonths / 12);
  const months = inputs.durationMonths % 12;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{t('investment.data')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberInput
              label={t('investment.initialAmount')}
              value={inputs.initialAmount}
              onChange={(value) => onInputChange('initialAmount', value)}
              error={errors.initialAmount}
              prefix="$"
              constraints={INPUT_CONSTRAINTS.initialAmount}
              required
            />

            <NumberInput
              label={t('investment.monthlyContribution')}
              value={inputs.monthlyContribution}
              onChange={(value) => onInputChange('monthlyContribution', value)}
              error={errors.monthlyContribution}
              prefix="$"
              constraints={INPUT_CONSTRAINTS.monthlyContribution}
              required
            />

            <NumberInput
              label={t('investment.duration')}
              value={inputs.durationMonths}
              onChange={(value) => onInputChange('durationMonths', value)}
              error={errors.durationMonths}
              constraints={INPUT_CONSTRAINTS.durationMonths}
              helperText={t('investment.durationHelper', { years, months })}
              required
            />

            <NumberInput
              label={t('investment.interestRate')}
              value={inputs.annualInterestRate}
              onChange={(value) => onInputChange('annualInterestRate', value)}
              error={errors.annualInterestRate}
              suffix="%"
              constraints={INPUT_CONSTRAINTS.annualInterestRate}
              required
            />

            <SelectField
              label={t('investment.compoundingFrequency')}
              value={inputs.compoundingFrequency}
              onChange={(value) =>
                onInputChange('compoundingFrequency', value as CompoundingFrequency)
              }
              options={compoundingOptions}
              error={errors.compoundingFrequency}
              required
            />

            <div className="md:col-span-2 flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onReset} disabled={isCalculating}>
                {t('common.reset')}
              </Button>
              <Button type="submit" disabled={isCalculating}>
                {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCalculating ? t('common.loading') : t('common.calculate')}
              </Button>
            </div>

            {errors.general && (
              <div className="md:col-span-2">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
