/**
 * Unit tests for amortization formulas
 */

import {
  calculateMonthlyPayment,
  calculatePaymentBreakdown,
  generateAmortizationSchedule,
} from '@/domain/debt/amortization.formulas';
import type { DebtInput } from '@/domain/debt/debt.types';

describe('Amortization Formulas', () => {
  describe('calculateMonthlyPayment', () => {
    it('calculates monthly payment correctly', () => {
      // $200,000 loan at 5% for 30 years
      const payment = calculateMonthlyPayment(200000, 0.05, 360);
      
      // Expected: approximately $1,073.64
      expect(payment).toBeGreaterThan(1070);
      expect(payment).toBeLessThan(1080);
    });

    it('matches reference scenario: $200k at 5% for 360 months ≈ $1,073.64', () => {
      const payment = calculateMonthlyPayment(200000, 0.05, 360);
      expect(payment).toBeCloseTo(1073.64, 0);
    });

    it('handles zero interest rate', () => {
      // $12,000 loan at 0% for 12 months
      const payment = calculateMonthlyPayment(12000, 0, 12);
      
      // Should be exactly $1,000/month
      expect(payment).toBe(1000);
    });

    it('returns 0 for zero loan amount', () => {
      const payment = calculateMonthlyPayment(0, 0.05, 360);
      expect(payment).toBe(0);
    });

    it('returns 0 for zero term', () => {
      const payment = calculateMonthlyPayment(200000, 0.05, 0);
      expect(payment).toBe(0);
    });
  });

  describe('calculatePaymentBreakdown', () => {
    it('splits payment into principal and interest', () => {
      const remainingBalance = 200000;
      const monthlyPayment = 1073.64;
      const monthlyRate = 0.05 / 12;

      const breakdown = calculatePaymentBreakdown(
        remainingBalance,
        monthlyPayment,
        monthlyRate
      );

      // First payment: mostly interest
      expect(breakdown.interestPaid).toBeGreaterThan(800);
      expect(breakdown.principalPaid).toBeLessThan(300);
      
      // Total should equal monthly payment (approximately)
      expect(breakdown.principalPaid + breakdown.interestPaid).toBeCloseTo(
        monthlyPayment,
        0
      );
    });

    it('handles zero interest', () => {
      const breakdown = calculatePaymentBreakdown(10000, 1000, 0);

      expect(breakdown.interestPaid).toBe(0);
      expect(breakdown.principalPaid).toBe(1000);
    });
  });

  describe('generateAmortizationSchedule', () => {
    const testInput: DebtInput = {
      loanAmount: 100000,
      annualInterestRate: 6,
      termMonths: 12,
      paymentFrequency: 'monthly',
    };

    it('generates correct number of payments', () => {
      const schedule = generateAmortizationSchedule(testInput);

      expect(schedule.length).toBe(12);
    });

    it('has decreasing remaining balance', () => {
      const schedule = generateAmortizationSchedule(testInput);

      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].remainingBalance).toBeLessThan(
          schedule[i - 1].remainingBalance
        );
      }
    });

    it('final balance is zero', () => {
      const schedule = generateAmortizationSchedule(testInput);
      const lastPayment = schedule[schedule.length - 1];

      expect(lastPayment.remainingBalance).toBe(0);
    });

    it('total principal equals loan amount', () => {
      const schedule = generateAmortizationSchedule(testInput);
      
      const totalPrincipal = schedule.reduce(
        (sum, payment) => sum + payment.principalPaid,
        0
      );

      expect(totalPrincipal).toBeCloseTo(testInput.loanAmount, 0);
    });

    it('interest decreases over time', () => {
      const schedule = generateAmortizationSchedule(testInput);

      // First payment has more interest than last
      expect(schedule[0].interestPaid).toBeGreaterThan(
        schedule[schedule.length - 1].interestPaid
      );
    });

    it('principal increases over time', () => {
      const schedule = generateAmortizationSchedule(testInput);

      // First payment has less principal than last
      expect(schedule[0].principalPaid).toBeLessThan(
        schedule[schedule.length - 1].principalPaid
      );
    });

    it('reference scenario: schedule totals consistent and final balance zero', () => {
      const referenceInput: DebtInput = {
        loanAmount: 200000,
        annualInterestRate: 5,
        termMonths: 360,
        paymentFrequency: 'monthly',
      };
      const schedule = generateAmortizationSchedule(referenceInput);

      const totalPrincipal = schedule.reduce((sum, p) => sum + p.principalPaid, 0);
      const totalInterest = schedule.reduce((sum, p) => sum + p.interestPaid, 0);
      const lastPayment = schedule[schedule.length - 1];

      expect(lastPayment.remainingBalance).toBe(0);
      expect(totalPrincipal).toBeCloseTo(referenceInput.loanAmount, -2);
      expect(totalInterest).toBeGreaterThan(0);
    });
  });
});
