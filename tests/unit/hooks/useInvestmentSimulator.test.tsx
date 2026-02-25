/**
 * Unit tests for useInvestmentSimulator hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useInvestmentSimulator } from '@/features/investment/useInvestmentSimulator';

describe('useInvestmentSimulator', () => {
  it('initializes with empty form (no default numeric values)', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    expect(result.current.inputs.compoundingFrequency).toBe('monthly');
    expect(result.current.inputs.initialAmount).toBeUndefined();
    expect(result.current.inputs.monthlyContribution).toBeUndefined();
    expect(result.current.inputs.durationMonths).toBeUndefined();
    expect(result.current.inputs.annualInterestRate).toBeUndefined();
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

    act(() => {
      result.current.updateInput('initialAmount', -100);
      result.current.updateInput('monthlyContribution', 500);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
    });
    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.updateInput('initialAmount', 10000);
    });

    expect(result.current.errors.initialAmount).toBeUndefined();
  });

  it('validates inputs before calculation', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', -100);
      result.current.updateInput('monthlyContribution', 500);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
    });
    act(() => {
      result.current.calculate();
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    expect(result.current.results).toBeNull();
  });

  it('calculates investment projection with valid inputs', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', 10000);
      result.current.updateInput('monthlyContribution', 500);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
    });

    act(() => {
      result.current.calculate();
    });

    await waitFor(
      () => {
        expect(result.current.isCalculating).toBe(false);
        expect(result.current.results).not.toBeNull();
      },
      { timeout: 1000 }
    );

    expect(result.current.results?.totalInvested).toBeGreaterThan(0);
    expect(result.current.results?.finalValue).toBeGreaterThan(0);
    expect(result.current.results?.breakdown.length).toBeGreaterThan(0);
  });

  it('resets to initial state', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', 20000);
      result.current.updateInput('monthlyContribution', 500);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
    });
    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.inputs.initialAmount).toBeUndefined();
    expect(result.current.inputs.compoundingFrequency).toBe('monthly');
    expect(result.current.results).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.isCalculating).toBe(false);
  });

  it('calculates with different compounding frequencies', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', 10000);
      result.current.updateInput('monthlyContribution', 500);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
      result.current.updateInput('compoundingFrequency', 'quarterly');
    });
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
      result.current.updateInput('initialAmount', 10000);
      result.current.updateInput('monthlyContribution', 0);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 0);
    });
    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    expect(result.current.results?.totalInterestEarned).toBeCloseTo(0, 0);
    expect(result.current.results?.finalValue).toBeCloseTo(result.current.inputs.initialAmount!, 0);
  });

  it('handles zero monthly contribution', async () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.updateInput('initialAmount', 10000);
      result.current.updateInput('monthlyContribution', 0);
      result.current.updateInput('durationMonths', 60);
      result.current.updateInput('annualInterestRate', 7);
    });
    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.results).not.toBeNull();
    });

    expect(result.current.results?.totalInvested).toBe(10000);
  });
});
