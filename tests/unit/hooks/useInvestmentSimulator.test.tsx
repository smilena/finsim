/**
 * Unit tests for useInvestmentSimulator hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useInvestmentSimulator } from '@/features/investment/useInvestmentSimulator';

describe('useInvestmentSimulator', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    expect(result.current.inputs).toEqual({
      initialAmount: 10000,
      monthlyContribution: 500,
      durationMonths: 60,
      annualInterestRate: 7,
      compoundingFrequency: 'monthly',
    });
    expect(result.current.results).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.isCalculating).toBe(false);
  });

  it('updates input values', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', 20000);
    });

    expect(result.current.inputs.initialAmount).toBe(20000);
  });

  it('clears error when field is updated', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    // Set an error manually
    act(() => {
      result.current.updateInput('initialAmount', -100);
    });

    act(() => {
      result.current.calculate();
    });

    // Wait for validation
    await waitFor(() => {
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    // Update the field to valid value
    act(() => {
      result.current.updateInput('initialAmount', 10000);
    });

    // Error should be cleared for that field
    expect(result.current.errors.initialAmount).toBeUndefined();
  });

  it('validates inputs before calculation', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', -100);
    });

    act(() => {
      result.current.calculate();
    });

    // Wait a bit for validation
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    expect(result.current.results).toBeNull();
  });

  it('calculates investment projection with valid inputs', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.calculate();
    });

    // Should be calculating
    expect(result.current.isCalculating).toBe(true);

    // Wait for calculation to complete
    await waitFor(
      () => {
        expect(result.current.isCalculating).toBe(false);
      },
      { timeout: 1000 }
    );

    // Should have results
    expect(result.current.results).not.toBeNull();
    expect(result.current.results?.totalInvested).toBeGreaterThan(0);
    expect(result.current.results?.finalValue).toBeGreaterThan(0);
    expect(result.current.results?.breakdown.length).toBeGreaterThan(0);
  });

  it('resets to initial state', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    // Make changes
    act(() => {
      result.current.updateInput('initialAmount', 20000);
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    // Should be back to initial state
    expect(result.current.inputs.initialAmount).toBe(10000);
    expect(result.current.results).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.isCalculating).toBe(false);
  });

  it('calculates with different compounding frequencies', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('compoundingFrequency', 'quarterly');
    });

    // Verify input was updated
    expect(result.current.inputs.compoundingFrequency).toBe('quarterly');

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    expect(result.current.results?.input.compoundingFrequency).toBe('quarterly');
  });

  it('handles zero interest rate', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('annualInterestRate', 0);
      result.current.updateInput('monthlyContribution', 0); // No contributions to isolate interest
    });

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    // With 0% interest and no contributions, interest earned should be close to 0
    expect(result.current.results?.totalInterestEarned).toBeCloseTo(0, 0);
    // Final value should equal initial investment
    expect(result.current.results?.finalValue).toBeCloseTo(result.current.inputs.initialAmount, 0);
  });

  it('handles zero monthly contribution', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    const initialAmount = result.current.inputs.initialAmount;

    act(() => {
      result.current.updateInput('monthlyContribution', 0);
    });

    expect(result.current.inputs.monthlyContribution).toBe(0);

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    // Total invested should equal initial amount only (no contributions)
    expect(result.current.results?.totalInvested).toBe(initialAmount);
  });
});
