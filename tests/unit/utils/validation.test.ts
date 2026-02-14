/**
 * Unit tests for validation utilities
 */

import {
  validateNumericConstraint,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateInvestmentInput,
  validateDebtInput,
  validatePrepaymentInput,
} from '@/utils/validation';
import type { InvestmentInput } from '@/domain/investment/investment.types';
import type { DebtInput, Prepayment } from '@/domain/debt/debt.types';

describe('validation utilities', () => {
  describe('validateNumericConstraint', () => {
    it('validates min constraint', () => {
      const result = validateNumericConstraint(5, { min: 10 }, 'Test field');
      expect(result).toBe('Test field must be at least 10');
    });

    it('validates max constraint', () => {
      const result = validateNumericConstraint(150, { max: 100 }, 'Test field');
      expect(result).toBe('Test field must be at most 100');
    });

    it('validates decimal places', () => {
      const result = validateNumericConstraint(10.123, { decimals: 2 }, 'Test field');
      expect(result).toBe('Test field can have at most 2 decimal places');
    });

    it('returns null for valid value', () => {
      const result = validateNumericConstraint(50, { min: 0, max: 100 }, 'Test field');
      expect(result).toBeNull();
    });
  });

  describe('validatePositiveNumber', () => {
    it('rejects negative numbers', () => {
      expect(validatePositiveNumber(-1, 'Test')).toContain('must be positive');
    });

    it('rejects zero', () => {
      expect(validatePositiveNumber(0, 'Test')).toContain('must be positive');
    });

    it('rejects non-numbers', () => {
      expect(validatePositiveNumber('abc', 'Test')).toContain('must be a number');
    });

    it('accepts positive numbers', () => {
      expect(validatePositiveNumber(100, 'Test')).toBeNull();
    });
  });

  describe('validateNonNegativeNumber', () => {
    it('rejects negative numbers', () => {
      expect(validateNonNegativeNumber(-1, 'Test')).toContain('must be non-negative');
    });

    it('accepts zero', () => {
      expect(validateNonNegativeNumber(0, 'Test')).toBeNull();
    });

    it('accepts positive numbers', () => {
      expect(validateNonNegativeNumber(100, 'Test')).toBeNull();
    });
  });

  describe('validateInvestmentInput', () => {
    const validInput: InvestmentInput = {
      initialAmount: 10000,
      monthlyContribution: 500,
      durationMonths: 60,
      annualInterestRate: 7,
      compoundingFrequency: 'monthly',
    };

    it('validates correct input', () => {
      const errors = validateInvestmentInput(validInput);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('validates initialAmount', () => {
      const errors = validateInvestmentInput({ ...validInput, initialAmount: -100 });
      expect(errors.initialAmount).toBeDefined();
    });

    it('validates monthlyContribution', () => {
      const errors = validateInvestmentInput({ ...validInput, monthlyContribution: -50 });
      expect(errors.monthlyContribution).toBeDefined();
    });

    it('validates durationMonths', () => {
      const errors = validateInvestmentInput({ ...validInput, durationMonths: 0 });
      expect(errors.durationMonths).toBeDefined();
    });

    it('validates annualInterestRate', () => {
      const errors = validateInvestmentInput({ ...validInput, annualInterestRate: 150 });
      expect(errors.annualInterestRate).toBeDefined();
    });

    it('requires all fields', () => {
      const errors = validateInvestmentInput({});
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  describe('validateDebtInput', () => {
    const validInput: DebtInput = {
      loanAmount: 200000,
      annualInterestRate: 5,
      termMonths: 360,
      paymentFrequency: 'monthly',
    };

    it('validates correct input', () => {
      const errors = validateDebtInput(validInput);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('validates loanAmount', () => {
      const errors = validateDebtInput({ ...validInput, loanAmount: -1000 });
      expect(errors.loanAmount).toBeDefined();
    });

    it('validates loanAmount max', () => {
      const errors = validateDebtInput({ ...validInput, loanAmount: 150_000_000 });
      expect(errors.loanAmount).toBeDefined();
      expect(errors.loanAmount).toContain('at most $100,000,000');
    });

    it('validates termMonths', () => {
      const errors = validateDebtInput({ ...validInput, termMonths: 0 });
      expect(errors.termMonths).toBeDefined();
    });

    it('validates termMonths is integer', () => {
      const errors = validateDebtInput({ ...validInput, termMonths: 12.5 });
      expect(errors.termMonths).toBeDefined();
      expect(errors.termMonths).toContain('whole number');
    });

    it('validates termMonths max', () => {
      const errors = validateDebtInput({ ...validInput, termMonths: 700 });
      expect(errors.termMonths).toBeDefined();
      expect(errors.termMonths).toContain('at most 600 months');
    });

    it('validates annualInterestRate', () => {
      const errors = validateDebtInput({ ...validInput, annualInterestRate: -5 });
      expect(errors.annualInterestRate).toBeDefined();
    });

    it('validates annualInterestRate max', () => {
      const errors = validateDebtInput({ ...validInput, annualInterestRate: 150 });
      expect(errors.annualInterestRate).toBeDefined();
      expect(errors.annualInterestRate).toContain('at most 100%');
    });

    it('requires all fields', () => {
      const errors = validateDebtInput({});
      expect(errors.loanAmount).toBeDefined();
      expect(errors.annualInterestRate).toBeDefined();
      expect(errors.termMonths).toBeDefined();
    });
  });

  describe('validatePrepaymentInput', () => {
    const validPrepayment: Prepayment = {
      monthNumber: 12,
      amount: 10000,
      strategy: 'reduce-term',
    };

    it('validates correct prepayment', () => {
      const errors = validatePrepaymentInput(validPrepayment, 360, 195000);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('validates monthNumber range', () => {
      const errors = validatePrepaymentInput({ ...validPrepayment, monthNumber: 500 }, 360);
      expect(errors.monthNumber).toBeDefined();
      expect(errors.monthNumber).toContain('cannot exceed loan term');
    });

    it('validates monthNumber minimum', () => {
      const errors = validatePrepaymentInput({ ...validPrepayment, monthNumber: 0 }, 360);
      expect(errors.monthNumber).toBeDefined();
    });

    it('validates prepayment does not exceed balance', () => {
      const errors = validatePrepaymentInput(
        { ...validPrepayment, amount: 200000 },
        360,
        150000
      );
      expect(errors.amount).toBeDefined();
      expect(errors.amount).toContain('cannot exceed remaining balance');
    });

    it('validates prepayment amount positive', () => {
      const errors = validatePrepaymentInput({ ...validPrepayment, amount: -1000 }, 360);
      expect(errors.amount).toBeDefined();
    });

    it('validates prepayment amount when balance provided', () => {
      const errors = validatePrepaymentInput(
        { ...validPrepayment, amount: 200000 },
        360,
        150000
      );
      expect(errors.amount).toBeDefined();
      expect(errors.amount).toContain('cannot exceed remaining balance');
    });

    it('works without remainingBalance parameter', () => {
      const errors = validatePrepaymentInput(validPrepayment, 360);
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
