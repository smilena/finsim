/**
 * Unit tests for prepayment formulas
 */

import {
  applyReduceTermPrepayment,
  applyReducePaymentPrepayment,
  calculateInterestSavings,
  validatePrepayment,
} from '@/domain/debt/prepayment.formulas';
import { generateAmortizationSchedule } from '@/domain/debt/amortization.formulas';
import type { DebtInput, AmortizationPayment, Prepayment } from '@/domain/debt/debt.types';

 describe('Prepayment Formulas', () => {
  const testInput: DebtInput = {
    loanAmount: 100000,
    annualInterestRate: 6,
    termMonths: 12,
    paymentFrequency: 'monthly',
  };

  const createSchedule = (): AmortizationPayment[] =>
    generateAmortizationSchedule(testInput);

  describe('applyReduceTermPrepayment', () => {
    it('reduces schedule length when prepayment is applied', () => {
      const schedule = createSchedule();
      const monthlyPayment = schedule[0].paymentAmount;
      const monthlyRate = 0.06 / 12;

      const prepayment: Prepayment = {
        monthNumber: 6,
        amount: 10000,
        strategy: 'reduce-term',
      };

      const newSchedule = applyReduceTermPrepayment(
        schedule,
        prepayment,
        monthlyRate,
        monthlyPayment
      );

      expect(newSchedule.length).toBeLessThan(schedule.length);
    });

    it('keeps monthly payment same with reduce-term strategy', () => {
      const schedule = createSchedule();
      const monthlyPayment = schedule[0].paymentAmount;
      const monthlyRate = 0.06 / 12;

      const prepayment: Prepayment = {
        monthNumber: 3,
        amount: 5000,
        strategy: 'reduce-term',
      };

      const newSchedule = applyReduceTermPrepayment(
        schedule,
        prepayment,
        monthlyRate,
        monthlyPayment
      );

      newSchedule.forEach((p) => {
        expect(p.paymentAmount).toBeCloseTo(monthlyPayment, 0);
      });
    });
  });

  describe('applyReducePaymentPrepayment', () => {
    it('reduces monthly payment after prepayment', () => {
      const schedule = createSchedule();
      const originalPayment = schedule[0].paymentAmount;

      const prepayment: Prepayment = {
        monthNumber: 6,
        amount: 10000,
        strategy: 'reduce-payment',
      };

      const newSchedule = applyReducePaymentPrepayment(testInput, prepayment, schedule);

      const paymentsAfterPrepayment = newSchedule.filter(
        (p) => p.paymentNumber >= prepayment.monthNumber
      );

      expect(paymentsAfterPrepayment.length).toBeGreaterThan(0);
      paymentsAfterPrepayment.forEach((p) => {
        expect(p.paymentAmount).toBeLessThan(originalPayment);
      });
    });

    it('preserves schedule length with reduce-payment strategy', () => {
      const schedule = createSchedule();
      const prepayment: Prepayment = {
        monthNumber: 6,
        amount: 5000,
        strategy: 'reduce-payment',
      };

      const newSchedule = applyReducePaymentPrepayment(testInput, prepayment, schedule);

      expect(newSchedule.length).toBe(testInput.termMonths);
    });
  });

  describe('reference scenarios', () => {
    const referenceInput: DebtInput = {
      loanAmount: 200000,
      annualInterestRate: 5,
      termMonths: 360,
      paymentFrequency: 'monthly',
    };

    it('reduce-term: verifies term reduction and interest savings', () => {
      const schedule = generateAmortizationSchedule(referenceInput);
      const monthlyPayment = schedule[0].paymentAmount;
      const monthlyRate = 0.05 / 12;

      const prepayment: Prepayment = {
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-term',
      };

      const newSchedule = applyReduceTermPrepayment(
        schedule,
        prepayment,
        monthlyRate,
        monthlyPayment
      );

      expect(newSchedule.length).toBeLessThan(schedule.length);
      expect(newSchedule[newSchedule.length - 1].remainingBalance).toBe(0);

      const originalInterest = schedule.reduce((s, p) => s + p.interestPaid, 0);
      const newInterest = newSchedule.reduce((s, p) => s + p.interestPaid, 0);
      expect(newInterest).toBeLessThan(originalInterest);
    });

    it('reduce-payment: verifies new monthly payment and same term', () => {
      const schedule = generateAmortizationSchedule(referenceInput);
      const originalPayment = schedule[0].paymentAmount;

      const prepayment: Prepayment = {
        monthNumber: 12,
        amount: 10000,
        strategy: 'reduce-payment',
      };

      const newSchedule = applyReducePaymentPrepayment(referenceInput, prepayment, schedule);

      expect(newSchedule.length).toBe(referenceInput.termMonths);
      const paymentsAfter = newSchedule.filter((p) => p.paymentNumber >= 12);
      paymentsAfter.forEach((p) => {
        expect(p.paymentAmount).toBeLessThan(originalPayment);
      });
      expect(newSchedule[newSchedule.length - 1].remainingBalance).toBe(0);
    });
  });

  describe('calculateInterestSavings', () => {
    it('calculates positive savings when prepayment reduces interest', () => {
      const schedule = createSchedule();
      const shorterSchedule = schedule.slice(0, 6);

      const savings = calculateInterestSavings(schedule, shorterSchedule);

      expect(savings).toBeGreaterThan(0);
    });

    it('returns 0 when schedules have same total interest', () => {
      const schedule = createSchedule();
      const savings = calculateInterestSavings(schedule, [...schedule]);

      expect(savings).toBe(0);
    });
  });

  describe('validatePrepayment', () => {
    it('returns null for valid prepayment', () => {
      const schedule = createSchedule();
      const prepayment: Prepayment = {
        monthNumber: 6,
        amount: 5000,
        strategy: 'reduce-term',
      };

      const result = validatePrepayment(prepayment, schedule);
      expect(result).toBeNull();
    });

    it('returns error for prepayment exceeding balance', () => {
      const schedule = createSchedule();
      const prepayment: Prepayment = {
        monthNumber: 1,
        amount: 200000,
        strategy: 'reduce-term',
      };

      const result = validatePrepayment(prepayment, schedule);
      expect(result).toContain('no puede exceder');
    });

    it('returns error for invalid month number', () => {
      const schedule = createSchedule();
      const prepayment: Prepayment = {
        monthNumber: 0,
        amount: 1000,
        strategy: 'reduce-term',
      };

      const result = validatePrepayment(prepayment, schedule);
      expect(result).toBeTruthy();
    });

    it('returns error for negative prepayment amount', () => {
      const schedule = createSchedule();
      const prepayment: Prepayment = {
        monthNumber: 6,
        amount: -1000,
        strategy: 'reduce-term',
      };

      const result = validatePrepayment(prepayment, schedule);
      expect(result).toContain('positivo');
    });
  });
});
