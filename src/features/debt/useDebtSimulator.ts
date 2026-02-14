/**
 * Hook for debt simulator state management
 *
 * Manual calculation: Results calculated when user clicks Calculate button.
 * Auto-recalculation: After initial calculation, prepayment changes trigger automatic recalculation.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { applyPrepayments } from '@/domain/debt/debt.service';
import { validateDebtInput, validatePrepaymentInput } from '@/utils/validation';
import type { DebtInput, Prepayment, PrepaymentResult } from '@/domain/debt/debt.types';
import type { ValidationErrors } from '@/types/common.types';

/**
 * Hook return type
 */
export interface UseDebtSimulatorReturn {
  /**
   * Current loan input values
   */
  inputs: DebtInput;

  /**
   * List of prepayments
   */
  prepayments: Prepayment[];

  /**
   * Calculated results (null if not yet calculated)
   */
  results: PrepaymentResult | null;

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
  updateInput: (field: keyof DebtInput, value: string | number) => void;

  /**
   * Add a prepayment
   */
  addPrepayment: (prepayment: Prepayment) => void;

  /**
   * Remove a prepayment by index
   */
  removePrepayment: (index: number) => void;

  /**
   * Calculate projection with current inputs
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
const DEFAULT_INPUTS: DebtInput = {
  loanAmount: 200000,
  annualInterestRate: 5,
  termMonths: 360, // 30 years
  paymentFrequency: 'monthly',
};

/**
 * Hook to manage debt simulator state
 *
 * Handles:
 * - Loan input state
 * - Prepayment management
 * - Validation
 * - Manual calculation on button click
 * - Auto-recalculation when prepayments change (if results exist)
 * - Results management
 */
export function useDebtSimulator(): UseDebtSimulatorReturn {
  const [inputs, setInputs] = useState<DebtInput>(DEFAULT_INPUTS);
  const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
  const [results, setResults] = useState<PrepaymentResult | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Keep a ref to the current inputs to avoid stale closures
  const inputsRef = useRef(inputs);
  
  // Track if we have calculated at least once
  const hasCalculatedRef = useRef(false);
  
  // Update ref whenever inputs change
  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  /**
   * Auto-recalculate when prepayments change (only if results already exist)
   */
  useEffect(() => {
    // Only auto-recalculate if we already have results (user has calculated before)
    if (!hasCalculatedRef.current) {
      return;
    }

    const currentInputs = inputsRef.current;

    // Validate prepayments if any
    if (prepayments.length > 0) {
      for (let i = 0; i < prepayments.length; i++) {
        const prepaymentErrors = validatePrepaymentInput(prepayments[i], currentInputs.termMonths);
        if (Object.keys(prepaymentErrors).length > 0) {
          setErrors(prepaymentErrors);
          return;
        }
      }
    }

    setErrors({});
    setIsCalculating(true);

    // Use setTimeout to allow UI to update
    const timer = setTimeout(() => {
      try {
        const projection = applyPrepayments(currentInputs, prepayments);
        setResults(projection);
      } catch (error) {
        console.error('Error calculating debt projection:', error);
        setErrors({
          general:
            error instanceof Error
              ? error.message
              : 'Ocurrió un error al calcular la proyección. Por favor intenta nuevamente.',
        });
      } finally {
        setIsCalculating(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [prepayments]);

  /**
   * Calculate projection manually
   */
  const calculate = () => {
    // Validate inputs
    const validationErrors = validateDebtInput(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResults(null);
      return;
    }

    // Validate prepayments if any
    if (prepayments.length > 0) {
      for (let i = 0; i < prepayments.length; i++) {
        const prepaymentErrors = validatePrepaymentInput(prepayments[i], inputs.termMonths);
        if (Object.keys(prepaymentErrors).length > 0) {
          setErrors(prepaymentErrors);
          return;
        }
      }
    }

    setErrors({});
    setIsCalculating(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const projection = applyPrepayments(inputs, prepayments);
        setResults(projection);
        hasCalculatedRef.current = true; // Mark as calculated
      } catch (error) {
        console.error('Error calculating debt projection:', error);
        setErrors({
          general:
            error instanceof Error
              ? error.message
              : 'Ocurrió un error al calcular la proyección. Por favor intenta nuevamente.',
        });
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  /**
   * Update a single input field
   */
  const updateInput = (field: keyof DebtInput, value: string | number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
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
   * Add a prepayment
   */
  const addPrepayment = (prepayment: Prepayment) => {
    const prepaymentErrors = validatePrepaymentInput(prepayment, inputs.termMonths);

    if (Object.keys(prepaymentErrors).length > 0) {
      setErrors(prepaymentErrors);
      return;
    }

    setPrepayments((prev) => [...prev, prepayment]);
    setErrors({});
  };

  /**
   * Remove a prepayment by index
   */
  const removePrepayment = (index: number) => {
    setPrepayments((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Reset form to initial state (clears all inputs to defaults)
   */
  const reset = () => {
    setInputs({ ...DEFAULT_INPUTS });
    setPrepayments([]);
    setResults(null);
    setErrors({});
    setIsCalculating(false);
    hasCalculatedRef.current = false; // Reset calculation flag
  };

  return {
    inputs,
    prepayments,
    results,
    errors,
    isCalculating,
    updateInput,
    addPrepayment,
    removePrepayment,
    calculate,
    reset,
  };
}
