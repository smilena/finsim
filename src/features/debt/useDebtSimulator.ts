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
import type { DebtInput, Prepayment, PrepaymentResult, PaymentFrequency } from '@/domain/debt/debt.types';
import type { ValidationErrors } from '@/types/common.types';

/** Estado del formulario: campos numéricos opcionales (vacío = sin valor inicial) */
export type DebtFormState = {
  loanAmount?: number;
  annualInterestRate?: number;
  termMonths?: number;
  paymentFrequency: PaymentFrequency;
};

/**
 * Hook return type
 */
export interface UseDebtSimulatorReturn {
  /**
   * Current loan input values (campos vacíos = undefined)
   */
  inputs: DebtFormState;

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
  updateInput: (field: keyof DebtFormState, value: string | number) => void;

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

/** Estado inicial: todos los campos numéricos vacíos */
const INITIAL_INPUTS: DebtFormState = {
  paymentFrequency: 'monthly',
};

/**
 * Hook to manage debt simulator state
 *
 * Handles:
 * - Loan input state (no initial values)
 * - Prepayment management
 * - Validation
 * - Manual calculation on button click
 * - Auto-recalculation when prepayments change (if results exist)
 * - Results management
 */
export function useDebtSimulator(): UseDebtSimulatorReturn {
  const [inputs, setInputs] = useState<DebtFormState>(INITIAL_INPUTS);
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
    if (!hasCalculatedRef.current) return;

    const current = inputsRef.current;
    if (current.loanAmount == null || current.annualInterestRate == null || current.termMonths == null) return;

    if (prepayments.length > 0) {
      for (let i = 0; i < prepayments.length; i++) {
        const prepaymentErrors = validatePrepaymentInput(prepayments[i], current.termMonths);
        if (Object.keys(prepaymentErrors).length > 0) {
          setErrors(prepaymentErrors);
          return;
        }
      }
    }

    setErrors({});
    setIsCalculating(true);

    const fullInput: DebtInput = {
      loanAmount: current.loanAmount,
      annualInterestRate: current.annualInterestRate,
      termMonths: current.termMonths,
      paymentFrequency: current.paymentFrequency,
    };

    const timer = setTimeout(() => {
      try {
        const projection = applyPrepayments(fullInput, prepayments);
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
    const validationErrors = validateDebtInput(inputs);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResults(null);
      return;
    }

    const termMonths = inputs.termMonths!;
    if (prepayments.length > 0) {
      for (let i = 0; i < prepayments.length; i++) {
        const prepaymentErrors = validatePrepaymentInput(prepayments[i], termMonths);
        if (Object.keys(prepaymentErrors).length > 0) {
          setErrors(prepaymentErrors);
          return;
        }
      }
    }

    setErrors({});
    setIsCalculating(true);

    const fullInput: DebtInput = {
      loanAmount: inputs.loanAmount!,
      annualInterestRate: inputs.annualInterestRate!,
      termMonths: inputs.termMonths!,
      paymentFrequency: inputs.paymentFrequency,
    };

    setTimeout(() => {
      try {
        const projection = applyPrepayments(fullInput, prepayments);
        setResults(projection);
        hasCalculatedRef.current = true;
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
   * Update a single input field ('' = vacío → undefined)
   */
  const updateInput = (field: keyof DebtFormState, value: string | number) => {
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
   * Add a prepayment (requiere termMonths definido)
   */
  const addPrepayment = (prepayment: Prepayment) => {
    if (inputs.termMonths == null) {
      setErrors({ termMonths: 'Loan term is required' });
      return;
    }
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
   * Reset form to initial state (todos los campos vacíos)
   */
  const reset = () => {
    setInputs({ ...INITIAL_INPUTS });
    setPrepayments([]);
    setResults(null);
    setErrors({});
    setIsCalculating(false);
    hasCalculatedRef.current = false;
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
