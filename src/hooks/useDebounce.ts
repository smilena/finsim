import { useState, useEffect } from 'react';

/**
 * Debounce a value. Returns the value only after `delay` ms of no changes.
 *
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds (e.g., 350)
 * @returns Debounced value
 *
 * @example
 * const [loanAmount, setLoanAmount] = useState(200000);
 * const debouncedAmount = useDebounce(loanAmount, 350);
 *
 * useEffect(() => {
 *   if (isValid(debouncedAmount)) runCalculation(debouncedAmount);
 * }, [debouncedAmount]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
