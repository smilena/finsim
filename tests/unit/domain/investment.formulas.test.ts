/**
 * Unit tests for investment formulas
 */

import {
  calculateFutureValuePrincipal,
  calculateFutureValueContributions,
  generateInvestmentBreakdown,
} from '@/domain/investment/investment.formulas';
import type { InvestmentInput } from '@/domain/investment/investment.types';

describe('Investment Formulas', () => {
  describe('calculateFutureValuePrincipal', () => {
    it('calculates future value with compound interest', () => {
      // $10,000 at 7.5% annually for 5 years
      const result = calculateFutureValuePrincipal(10000, 0.075, 1, 5);
      expect(result).toBeCloseTo(14356.29, 1);
    });

    it('calculates future value with monthly compounding', () => {
      // $10,000 at 7.5% monthly compounding for 5 years
      const result = calculateFutureValuePrincipal(10000, 0.075, 12, 5);
      expect(result).toBeGreaterThan(14500);
      expect(result).toBeLessThan(14600);
    });

    it('returns principal when interest rate is 0', () => {
      const result = calculateFutureValuePrincipal(10000, 0, 12, 5);
      expect(result).toBe(10000);
    });

    it('returns 0 when principal is 0', () => {
      const result = calculateFutureValuePrincipal(0, 0.075, 12, 5);
      expect(result).toBe(0);
    });

    it('returns 0 when time is 0', () => {
      const result = calculateFutureValuePrincipal(10000, 0.075, 12, 0);
      expect(result).toBe(0);
    });
  });

  describe('calculateFutureValueContributions', () => {
    it('calculates future value of monthly contributions', () => {
      // $500/month at 7.5% annual (12 periods/year) for 5 years
      const result = calculateFutureValueContributions(500, 0.075, 12, 5);
      expect(result).toBeGreaterThan(34000);
      expect(result).toBeLessThan(37000);
    });

    it('returns 0 when monthly payment is 0', () => {
      const result = calculateFutureValueContributions(0, 0.075, 12, 5);
      expect(result).toBe(0);
    });

    it('returns sum of contributions when interest rate is 0', () => {
      // $500/month for 5 years = $30,000 total
      const result = calculateFutureValueContributions(500, 0, 12, 5);
      expect(result).toBe(30000);
    });

    it('handles quarterly compounding', () => {
      const result = calculateFutureValueContributions(500, 0.075, 4, 5);
      expect(result).toBeGreaterThan(34000);
    });
  });

  describe('generateInvestmentBreakdown', () => {
    const testInput: InvestmentInput = {
      initialAmount: 10000,
      monthlyContribution: 500,
      durationMonths: 12,
      annualInterestRate: 7.5,
      compoundingFrequency: 'monthly',
    };

    it('generates monthly breakdown', () => {
      const breakdown = generateInvestmentBreakdown(testInput, 'monthly');

      expect(breakdown.length).toBe(12);
      expect(breakdown[0].periodNumber).toBe(1);
      expect(breakdown[11].periodNumber).toBe(12);
    });

    it('shows progressive balance growth', () => {
      const breakdown = generateInvestmentBreakdown(testInput, 'monthly');

      // Balance should increase over time
      for (let i = 1; i < breakdown.length; i++) {
        expect(breakdown[i].balance).toBeGreaterThan(breakdown[i - 1].balance);
      }
    });

    it('tracks total invested correctly', () => {
      const breakdown = generateInvestmentBreakdown(testInput, 'monthly');

      const lastPeriod = breakdown[breakdown.length - 1];
      const expectedTotalInvested = testInput.initialAmount + testInput.monthlyContribution * 12;

      expect(lastPeriod.totalInvested).toBe(expectedTotalInvested);
    });

    it('calculates interest correctly', () => {
      const breakdown = generateInvestmentBreakdown(testInput, 'monthly');

      const lastPeriod = breakdown[breakdown.length - 1];
      const calculatedInterest = lastPeriod.balance - lastPeriod.totalInvested;

      expect(lastPeriod.interestEarned).toBeCloseTo(calculatedInterest, 1);
      expect(lastPeriod.interestEarned).toBeGreaterThan(0);
    });

    it('generates yearly breakdown', () => {
      const longInput: InvestmentInput = {
        ...testInput,
        durationMonths: 36, // 3 years
      };

      const breakdown = generateInvestmentBreakdown(longInput, 'yearly');

      expect(breakdown.length).toBe(3);
      expect(breakdown[0].periodLabel).toBe('Año 1');
      expect(breakdown[2].periodLabel).toBe('Año 3');
    });

    it('handles zero interest rate', () => {
      const zeroInterestInput: InvestmentInput = {
        ...testInput,
        annualInterestRate: 0,
      };

      const breakdown = generateInvestmentBreakdown(zeroInterestInput, 'monthly');
      const lastPeriod = breakdown[breakdown.length - 1];

      // With 0% interest, interest earned should be 0
      expect(lastPeriod.interestEarned).toBeCloseTo(0, 1);
    });
  });
});
