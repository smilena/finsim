/**
 * Hook for tax calculator state management
 * Calculates on button click and holds results until reset or recalculate
 */

'use client';

import { useState } from 'react';
import { calculateTax } from '@/domain/taxes/taxes.service';
import { validateTaxInput } from '@/utils/validation';
import type { TaxInput, TaxResult, SalaryPeriodicity } from '@/domain/taxes/taxes.types';
import type { ValidationErrors } from '@/types/common.types';

export type TaxFormState = {
  grossSalary?: number;
  periodicity: SalaryPeriodicity;
};

export interface UseTaxCalculatorReturn {
  inputs: TaxFormState;
  results: TaxResult | null;
  errors: ValidationErrors;
  isCalculating: boolean;
  updateInput: (field: keyof TaxFormState, value: string | number) => void;
  calculate: () => void;
  reset: () => void;
}

const INITIAL_INPUTS: TaxFormState = {
  periodicity: 'monthly',
};

export function useTaxCalculator(): UseTaxCalculatorReturn {
  const [inputs, setInputs] = useState<TaxFormState>(INITIAL_INPUTS);
  const [results, setResults] = useState<TaxResult | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = () => {
    const validationErrors = validateTaxInput(inputs);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResults(null);
      return;
    }

    setErrors({});
    setIsCalculating(true);

    const fullInput: TaxInput = {
      grossSalary: inputs.grossSalary as number,
      periodicity: inputs.periodicity,
    };

    setTimeout(() => {
      try {
        const result = calculateTax(fullInput);
        setResults(result);
      } catch (error) {
        console.error('Error calculating tax:', error);
        setErrors({
          general:
            error instanceof Error
              ? error.message
              : 'Ocurrió un error al calcular. Por favor intenta nuevamente.',
        });
        setResults(null);
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  const updateInput = (field: keyof TaxFormState, value: string | number) => {
    const next = value === '' ? undefined : value;
    if (field === 'periodicity') {
      setInputs((prev) => ({
        ...prev,
        periodicity: value as SalaryPeriodicity,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [field]: next as number | undefined,
      }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const reset = () => {
    setInputs({ ...INITIAL_INPUTS });
    setResults(null);
    setErrors({});
    setIsCalculating(false);
  };

  return {
    inputs,
    results,
    errors,
    isCalculating,
    updateInput,
    calculate,
    reset,
  };
}
