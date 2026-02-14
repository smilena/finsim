/**
 * Unit tests for useDebtSimulator hook
 *
 * Real-time UX: No calculate() - results update automatically when inputs valid.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebtSimulator } from '@/features/debt/useDebtSimulator';

describe('useDebtSimulator', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useDebtSimulator());

    expect(result.current.inputs).toEqual({
      loanAmount: 200000,
      annualInterestRate: 5,
      termMonths: 360,
      paymentFrequency: 'monthly',
    });
    expect(result.current.prepayments).toEqual([]);
    expect(result.current.errors).toEqual({});
    expect(result.current.results).toBeNull();
  });

  it('does not expose calculate method', () => {
    const { result } = renderHook(() => useDebtSimulator());

    expect(result.current).not.toHaveProperty('calculate');
  });

  it('displays results automatically when inputs are valid', async () => {
    const { result } = renderHook(() => useDebtSimulator());

    await waitFor(
      () => {
        expect(result.current.results).not.toBeNull();
      },
      { timeout: 2000 }
    );

    expect(result.current.results?.baseScenario.monthlyPayment).toBeGreaterThan(0);
    expect(result.current.results?.baseScenario.schedule.length).toBeGreaterThan(0);
  });

  it('updates input values', () => {
    const { result } = renderHook(() => useDebtSimulator());

    act(() => {
      result.current.updateInput('loanAmount', 250000);
    });

    expect(result.current.inputs.loanAmount).toBe(250000);
  });

  it('adds prepayment and triggers immediate recalc', async () => {
    const { result } = renderHook(() => useDebtSimulator());

    await waitFor(
      () => {
        expect(result.current.results).not.toBeNull();
      },
      { timeout: 2000 }
    );

    act(() => {
      result.current.addPrepayment({
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-term',
      });
    });

    expect(result.current.prepayments).toHaveLength(1);
    expect(result.current.prepayments[0].amount).toBe(10000);

    await waitFor(
      () => {
        expect(result.current.results?.interestSavings).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );
  });

  it('removes prepayment and triggers immediate recalc', async () => {
    const { result } = renderHook(() => useDebtSimulator());

    await waitFor(() => expect(result.current.results).not.toBeNull(), { timeout: 2000 });

    act(() => {
      result.current.addPrepayment({
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-term',
      });
    });

    expect(result.current.prepayments).toHaveLength(1);

    act(() => {
      result.current.removePrepayment(0);
    });

    expect(result.current.prepayments).toHaveLength(0);

    await waitFor(
      () => {
        expect(result.current.results?.interestSavings).toBe(0);
      },
      { timeout: 1000 }
    );
  });

  it('shows validation errors for invalid inputs', async () => {
    const { result } = renderHook(() => useDebtSimulator());

    act(() => {
      result.current.updateInput('loanAmount', -100);
    });

    await waitFor(
      () => {
        expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
        expect(result.current.results).toBeNull();
      },
      { timeout: 1000 }
    );
  });

  it('resets all state', async () => {
    const { result } = renderHook(() => useDebtSimulator());

    await waitFor(() => expect(result.current.results).not.toBeNull(), { timeout: 2000 });

    act(() => {
      result.current.reset();
    });

    expect(result.current.results).toBeNull();
    expect(result.current.prepayments).toEqual([]);
    expect(result.current.errors).toEqual({});
  });
});
