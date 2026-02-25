/**
 * Debt simulator loan input form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '@/components/common/NumberInput';
import { INPUT_CONSTRAINTS } from '@/types/common.types';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DebtFormState } from '@/features/debt/useDebtSimulator';
import type { ValidationErrors } from '@/types/common.types';
import { Loader2 } from 'lucide-react';

export interface DebtFormProps {
  /**
   * Current loan input values (campos vacíos = undefined)
   */
  inputs: DebtFormState;

  /**
   * Update handler for input changes
   */
  onInputChange: (field: keyof DebtFormState, value: string | number) => void;

  /**
   * Calculate handler
   */
  onCalculate?: () => void;

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
  isCalculating?: boolean;
}

/**
 * Debt input form - collects loan parameters
 */
export function DebtForm({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
  errors,
  isCalculating = false,
}: DebtFormProps) {
  const { t } = useLanguage();

  const termMonths = inputs.termMonths ?? 0;
  const years = Math.floor(termMonths / 12);
  const months = termMonths % 12;

  return (
    <Card className="min-w-0 form-card">
      <CardHeader>
        <CardTitle>{t('debt.loanData')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberInput
              label={t('debt.loanAmount')}
              value={inputs.loanAmount ?? ''}
              onChange={(value) => onInputChange('loanAmount', value)}
              error={errors.loanAmount}
              prefix="$"
              constraints={INPUT_CONSTRAINTS.loanAmount}
              required
            />

            <NumberInput
              label={t('debt.interestRate')}
              value={inputs.annualInterestRate ?? ''}
              onChange={(value) => onInputChange('annualInterestRate', value)}
              error={errors.annualInterestRate}
              suffix="%"
              constraints={INPUT_CONSTRAINTS.annualInterestRate}
              required
            />

            <NumberInput
              label={t('debt.term')}
              value={inputs.termMonths ?? ''}
              onChange={(value) => onInputChange('termMonths', value)}
              error={errors.termMonths}
              constraints={INPUT_CONSTRAINTS.termMonths}
              helperText={inputs.termMonths != null ? t('debt.termHelper', { years, months }) : undefined}
              required
            />

            <div className="md:col-span-2 flex gap-4 justify-end">
              <Button 
                type="button" 
                onClick={onReset}
                variant="outline"
                disabled={isCalculating}
                className="rounded-full"
              >
                {t('common.reset')}
              </Button>
              {onCalculate && (
                <Button 
                  type="button" 
                  onClick={onCalculate}
                  disabled={isCalculating}
                  className="btn-cta"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('common.calculate')
                  )}
                </Button>
              )}
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
