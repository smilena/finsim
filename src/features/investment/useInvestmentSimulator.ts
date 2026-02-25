/**
 * Hook for investment simulator state management
 */

'use client';

import { useState } from 'react';
import { calculateInvestmentProjection } from '@/domain/investment/investment.service';
import { validateInvestmentInput } from '@/utils/validation';
import type { InvestmentInput, InvestmentResult, CompoundingFrequency } from '@/domain/investment/investment.types';
import type { ValidationErrors } from '@/types/common.types';

/** Estado del formulario: campos numéricos opcionales (vacío = sin valor inicial) */
export type InvestmentFormState = {
  initialAmount?: number;
  monthlyContribution?: number;
  durationMonths?: number;
  annualInterestRate?: number;
  compoundingFrequency: CompoundingFrequency;
};

/**
 * Hook return type
 */
export interface UseInvestmentSimulatorReturn {
  /**
   * Current input values (campos vacíos = undefined)
   */
  inputs: InvestmentFormState;

  /**
   * Calculated results (null if not yet calculated)
   */
  results: InvestmentResult | null;

  /**
   * Validation errors
   */
  errors: ValidationErrors;

  /**
   * Whether calculation is in progress
   */
  isCalculating: boolean;

  /**
   * Update a single input field
   */
  updateInput: (field: keyof InvestmentFormState, value: string | number) => void;

  /**
   * Calculate investment projection
   */
  calculate: () => void;

  /**
   * Reset form to initial state
   */
  reset: () => void;
}

/** Estado inicial: todos los campos numéricos vacíos */
const INITIAL_INPUTS: InvestmentFormState = {
  compoundingFrequency: 'monthly',
};

/**
 * Hook to manage investment simulator state
 *
 * Handles:
 * - Form input state (no initial values)
 * - Validation
 * - Calculation orchestration
 * - Results management
 */
export function useInvestmentSimulator(): UseInvestmentSimulatorReturn {
  const [inputs, setInputs] = useState<InvestmentFormState>(INITIAL_INPUTS);
  const [results, setResults] = useState<InvestmentResult | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Update a single input field ('' = vacío → undefined)
   */
  const updateInput = (field: keyof InvestmentFormState, value: string | number) => {
    const next = value === '' ? undefined : value;
    setInputs((prev) => ({
      ...prev,
      [field]: next,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Calculate investment projection
   */
  const calculate = () => {
    const validationErrors = validateInvestmentInput(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsCalculating(true);

    setTimeout(() => {
      try {
        const fullInput: InvestmentInput = {
          initialAmount: inputs.initialAmount!,
          monthlyContribution: inputs.monthlyContribution!,
          durationMonths: inputs.durationMonths!,
          annualInterestRate: inputs.annualInterestRate!,
          compoundingFrequency: inputs.compoundingFrequency,
        };
        const projection = calculateInvestmentProjection(fullInput);
        setResults(projection);
      } catch (error) {
        console.error('Error calculating investment projection:', error);
        setErrors({
          general: 'Ocurrió un error al calcular la proyección. Por favor intenta nuevamente.',
        });
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  };

  /**
   * Reset form to initial state (todos los campos vacíos)
   */
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
