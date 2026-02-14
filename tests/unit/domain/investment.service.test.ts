/**
 * Unit tests for investment service
 */

import { calculateInvestmentProjection } from '@/domain/investment/investment.service';
import type { InvestmentInput } from '@/domain/investment/investment.types';

describe('Investment Service', () => {
  describe('calculateInvestmentProjection', () => {
    it('calculates complete investment projection', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60, // 5 years
        annualInterestRate: 7.5,
        compoundingFrequency: 'monthly',
      };

      const result = calculateInvestmentProjection(input);

      // Verify structure
      expect(result).toHaveProperty('totalInvested');
      expect(result).toHaveProperty('totalInterestEarned');
      expect(result).toHaveProperty('finalValue');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('input');

      // Verify input is preserved
      expect(result.input).toEqual(input);

      // Verify calculations
      const expectedTotalInvested = input.initialAmount + input.monthlyContribution * 60;
      expect(result.totalInvested).toBe(expectedTotalInvested);

      // Final value should be greater than total invested (due to interest)
      expect(result.finalValue).toBeGreaterThan(result.totalInvested);

      // Interest should be positive
      expect(result.totalInterestEarned).toBeGreaterThan(0);

      // Final value should equal total invested + interest
      expect(result.finalValue).toBeCloseTo(
        result.totalInvested + result.totalInterestEarned,
        1
      );
    });

    it('calculates breakdown with correct number of periods', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 24,
        annualInterestRate: 6,
        compoundingFrequency: 'monthly',
      };

      const result = calculateInvestmentProjection(input);

      expect(result.breakdown.length).toBe(24);
    });

    it('handles zero interest rate', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 12,
        annualInterestRate: 0,
        compoundingFrequency: 'monthly',
      };

      const result = calculateInvestmentProjection(input);

      // With 0% interest, total interest should be 0
      expect(result.totalInterestEarned).toBeCloseTo(0, 1);

      // Final value should equal total invested
      expect(result.finalValue).toBeCloseTo(result.totalInvested, 1);
    });

    it('handles quarterly compounding', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7.5,
        compoundingFrequency: 'quarterly',
      };

      const result = calculateInvestmentProjection(input);

      expect(result.totalInterestEarned).toBeGreaterThan(0);
      expect(result.finalValue).toBeGreaterThan(result.totalInvested);
    });

    it('handles annual compounding', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7.5,
        compoundingFrequency: 'annually',
      };

      const result = calculateInvestmentProjection(input);

      expect(result.totalInterestEarned).toBeGreaterThan(0);
      expect(result.finalValue).toBeGreaterThan(result.totalInvested);
    });

    it('handles no monthly contributions', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 0,
        durationMonths: 60,
        annualInterestRate: 7.5,
        compoundingFrequency: 'monthly',
      };

      const result = calculateInvestmentProjection(input);

      expect(result.totalInvested).toBe(input.initialAmount);
      expect(result.totalInterestEarned).toBeGreaterThan(0);
    });

    it('last period in breakdown is in reasonable range', () => {
      const input: InvestmentInput = {
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7.5,
        compoundingFrequency: 'monthly',
      };

      const result = calculateInvestmentProjection(input);
      const lastPeriod = result.breakdown[result.breakdown.length - 1];

      // Both methods should give similar results (within ~1%)
      // Difference exists due to simulation vs closed-form formula
      const percentDiff = Math.abs(lastPeriod.balance - result.finalValue) / result.finalValue;
      expect(percentDiff).toBeLessThan(0.01); // Less than 1% difference

      expect(lastPeriod.totalInvested).toBe(result.totalInvested);
      
      // Interest should be in similar range
      const interestPercentDiff = Math.abs(lastPeriod.interestEarned - result.totalInterestEarned) / result.totalInterestEarned;
      expect(interestPercentDiff).toBeLessThan(0.05); // Less than 5% difference
    });
  });
});
