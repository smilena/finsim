/**
 * Hook for investment simulator state management
 */

'use client';

import { useState } from 'react';
import { calculateInvestmentProjection } from '@/domain/investment/investment.service';
import { validateInvestmentInput } from '@/utils/validation';
import type { InvestmentInput, InvestmentResult } from '@/domain/investment/investment.types';
import type { ValidationErrors } from '@/types/common.types';

/**
 * Hook return type
 */
export interface UseInvestmentSimulatorReturn {
  /**
   * Current input values
   */
  inputs: InvestmentInput;

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
  updateInput: (field: keyof InvestmentInput, value: string | number) => void;

  /**
   * Calculate investment projection
   */
  calculate: () => void;

  /**
   * Reset form to initial state
   */
  reset: () => void;
}

/**
 * Default initial values
 */
const DEFAULT_INPUTS: InvestmentInput = {
  initialAmount: 10000,
  monthlyContribution: 500,
  durationMonths: 60, // 5 years
  annualInterestRate: 7,
  compoundingFrequency: 'monthly',
};

/**
 * Hook to manage investment simulator state
 *
 * Handles:
 * - Form input state
 * - Validation
 * - Calculation orchestration
 * - Results management
 */
export function useInvestmentSimulator(): UseInvestmentSimulatorReturn {
  const [inputs, setInputs] = useState<InvestmentInput>(DEFAULT_INPUTS);
  const [results, setResults] = useState<InvestmentResult | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Update a single input field
   */
  const updateInput = (field: keyof InvestmentInput, value: string | number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
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
    // Validate inputs
    const validationErrors = validateInvestmentInput(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Simulate async calculation for better UX
    setIsCalculating(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const projection = calculateInvestmentProjection(inputs);
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
   * Reset form to initial state
   */
  const reset = () => {
    setInputs(DEFAULT_INPUTS);
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
