/**
 * Unit tests for debt service
 */

import {
  calculateAmortizationSchedule,
  applyPrepayments,
} from '@/domain/debt/debt.service';
import type { DebtInput, Prepayment } from '@/domain/debt/debt.types';

describe('Debt Service', () => {
  const testInput: DebtInput = {
    loanAmount: 200000,
    annualInterestRate: 5,
    termMonths: 360, // 30 years
    paymentFrequency: 'monthly',
  };

  describe('calculateAmortizationSchedule', () => {
    it('returns complete amortization schedule', () => {
      const result = calculateAmortizationSchedule(testInput);

      expect(result).toHaveProperty('monthlyPayment');
      expect(result).toHaveProperty('totalPrincipal');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('totalPaid');
      expect(result).toHaveProperty('schedule');
      expect(result).toHaveProperty('input');
    });

    it('preserves input parameters', () => {
      const result = calculateAmortizationSchedule(testInput);

      expect(result.input).toEqual(testInput);
    });

    it('total paid equals principal plus interest', () => {
      const result = calculateAmortizationSchedule(testInput);

      expect(result.totalPaid).toBeCloseTo(
        result.totalPrincipal + result.totalInterest,
        0
      );
    });

    it('total principal approximately equals loan amount', () => {
      const result = calculateAmortizationSchedule(testInput);

      // Allow small rounding difference (within $5)
      expect(Math.abs(result.totalPrincipal - testInput.loanAmount)).toBeLessThan(5);
    });

    it('interest is positive for non-zero rate', () => {
      const result = calculateAmortizationSchedule(testInput);

      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('term matches input', () => {
      const result = calculateAmortizationSchedule(testInput);

      expect(result.actualTermMonths).toBe(testInput.termMonths);
      expect(result.schedule.length).toBe(testInput.termMonths);
    });
  });

  describe('applyPrepayments', () => {
    it('returns base scenario when no prepayments', () => {
      const result = applyPrepayments(testInput, []);

      expect(result.interestSavings).toBe(0);
      expect(result.prepayments.length).toBe(0);
      expect(result.baseScenario).toEqual(result.prepaymentScenario);
    });

    it('calculates interest savings with reduce-term prepayment', () => {
      const prepayment: Prepayment = {
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-term',
      };

      const result = applyPrepayments(testInput, [prepayment]);

      // Should have interest savings
      expect(result.interestSavings).toBeGreaterThan(0);
      
      // Prepayment scenario should have fewer months
      expect(result.prepaymentScenario.actualTermMonths).toBeLessThan(
        result.baseScenario.actualTermMonths
      );

      // Monthly payment should stay the same
      expect(result.prepaymentScenario.monthlyPayment).toBeCloseTo(
        result.baseScenario.monthlyPayment,
        0
      );

      // Term reduction should be reported
      expect(result.termReduction).toBeGreaterThan(0);
    });

    it('calculates interest savings with reduce-payment prepayment', () => {
      const prepayment: Prepayment = {
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-payment',
      };

      const result = applyPrepayments(testInput, [prepayment]);

      // Should have interest savings
      expect(result.interestSavings).toBeGreaterThan(0);

      // Term should stay the same
      expect(result.prepaymentScenario.actualTermMonths).toBe(
        result.baseScenario.actualTermMonths
      );

      // Monthly payment should be lower
      expect(result.newMonthlyPayment).toBeLessThan(
        result.baseScenario.monthlyPayment
      );
    });

    it('validates prepayment amount', () => {
      const prepayment: Prepayment = {
        monthNumber: 1,
        amount: 300000, // More than loan amount
        strategy: 'reduce-term',
      };

      expect(() => {
        applyPrepayments(testInput, [prepayment]);
      }).toThrow();
    });

    it('validates prepayment month', () => {
      const prepayment: Prepayment = {
        monthNumber: 500, // Beyond term
        amount: 10000,
        strategy: 'reduce-term',
      };

      expect(() => {
        applyPrepayments(testInput, [prepayment]);
      }).toThrow();
    });

    it('calculates interest savings percentage', () => {
      const prepayment: Prepayment = {
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-term',
      };

      const result = applyPrepayments(testInput, [prepayment]);

      expect(result.interestSavingsPercent).toBeGreaterThan(0);
      expect(result.interestSavingsPercent).toBeLessThan(100);
    });
  });
});
