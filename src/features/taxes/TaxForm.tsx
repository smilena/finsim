/**
 * Tax calculator input form - salary and periodicity
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '@/components/common/NumberInput';
import { SelectField } from '@/components/common/SelectField';
import { INPUT_CONSTRAINTS } from '@/types/common.types';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TaxFormState } from '@/features/taxes/useTaxCalculator';
import type { ValidationErrors } from '@/types/common.types';
import { Loader2 } from 'lucide-react';
import type { SalaryPeriodicity } from '@/domain/taxes/taxes.types';

export interface TaxFormProps {
  inputs: TaxFormState;
  onInputChange: (field: keyof TaxFormState, value: string | number) => void;
  onCalculate?: () => void;
  onReset: () => void;
  errors: ValidationErrors;
  isCalculating?: boolean;
}

export function TaxForm({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
  errors,
  isCalculating = false,
}: TaxFormProps) {
  const { t } = useLanguage();

  const periodicityOptions = [
    { value: 'monthly', label: t('taxes.form.monthly') },
    { value: 'annual', label: t('taxes.form.annual') },
  ];

  return (
    <Card className="min-w-0 form-card">
      <CardHeader>
        <CardTitle>{t('taxes.form.dataLabel')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberInput
              label={t('taxes.form.salary')}
              value={inputs.grossSalary ?? ''}
              onChange={(value) => onInputChange('grossSalary', value)}
              error={errors.grossSalary}
              prefix="$"
              constraints={INPUT_CONSTRAINTS.grossSalary}
              required
            />

            <SelectField
              label={t('taxes.form.periodicity')}
              value={inputs.periodicity}
              onChange={(value) => onInputChange('periodicity', value as SalaryPeriodicity)}
              options={periodicityOptions}
              error={errors.periodicity}
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
