/**
 * Validation utilities
 */

import type { ValidationErrors, NumericConstraint } from '@/types/common.types';
import type { InvestmentInput } from '@/domain/investment/investment.types';
import type { DebtInput, Prepayment } from '@/domain/debt/debt.types';

/**
 * Check if numeric value is within constraints
 *
 * @param value - Value to check
 * @param constraint - Min/max/step constraints
 * @param fieldName - Field name for error message
 * @returns Error message if invalid, null if valid
 */
export function validateNumericConstraint(
  value: number,
  constraint: NumericConstraint,
  fieldName: string
): string | null {
  if (constraint.min !== undefined && value < constraint.min) {
    return `${fieldName} must be at least ${constraint.min}`;
  }

  if (constraint.max !== undefined && value > constraint.max) {
    return `${fieldName} must be at most ${constraint.max}`;
  }

  if (constraint.decimals !== undefined) {
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > constraint.decimals) {
      return `${fieldName} can have at most ${constraint.decimals} decimal places`;
    }
  }

  return null;
}

/**
 * Validate that a value is a positive number
 */
export function validatePositiveNumber(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a number`;
  }

  if (value <= 0) {
    return `${fieldName} must be positive`;
  }

  return null;
}

/**
 * Validate that a value is a non-negative number
 */
export function validateNonNegativeNumber(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a number`;
  }

  if (value < 0) {
    return `${fieldName} must be non-negative`;
  }

  return null;
}

/**
 * Validate investment input
 *
 * @param input - Investment input to validate
 * @returns Validation errors (empty object if valid)
 */
export function validateInvestmentInput(input: Partial<InvestmentInput>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate initial amount
  if (input.initialAmount !== undefined) {
    const error = validatePositiveNumber(input.initialAmount, 'Initial amount');
    if (error) {
      errors.initialAmount = error;
    } else if (input.initialAmount > 1_000_000_000) {
      errors.initialAmount = 'Initial amount must be at most $1,000,000,000';
    }
  } else {
    errors.initialAmount = 'Initial amount is required';
  }

  // Validate monthly contribution
  if (input.monthlyContribution !== undefined) {
    const error = validateNonNegativeNumber(input.monthlyContribution, 'Monthly contribution');
    if (error) {
      errors.monthlyContribution = error;
    } else if (input.monthlyContribution > 1_000_000) {
      errors.monthlyContribution = 'Monthly contribution must be at most $1,000,000';
    }
  } else {
    errors.monthlyContribution = 'Monthly contribution is required';
  }

  // Validate duration
  if (input.durationMonths !== undefined) {
    const error = validatePositiveNumber(input.durationMonths, 'Duration');
    if (error) {
      errors.durationMonths = error;
    } else if (input.durationMonths > 1200) {
      errors.durationMonths = 'Duration must be at most 1200 months (100 years)';
    } else if (!Number.isInteger(input.durationMonths)) {
      errors.durationMonths = 'Duration must be a whole number of months';
    }
  } else {
    errors.durationMonths = 'Duration is required';
  }

  // Validate interest rate
  if (input.annualInterestRate !== undefined) {
    const error = validateNonNegativeNumber(input.annualInterestRate, 'Interest rate');
    if (error) {
      errors.annualInterestRate = error;
    } else if (input.annualInterestRate > 100) {
      errors.annualInterestRate = 'Interest rate must be at most 100%';
    }
  } else {
    errors.annualInterestRate = 'Interest rate is required';
  }

  // Validate compounding frequency
  if (!input.compoundingFrequency) {
    errors.compoundingFrequency = 'Compounding frequency is required';
  }

  return errors;
}

/**
 * Validate debt input
 *
 * @param input - Debt input to validate
 * @returns Validation errors (empty object if valid)
 */
export function validateDebtInput(input: Partial<DebtInput>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate loan amount
  if (input.loanAmount !== undefined) {
    const error = validatePositiveNumber(input.loanAmount, 'Loan amount');
    if (error) {
      errors.loanAmount = error;
    } else if (input.loanAmount > 100_000_000) {
      errors.loanAmount = 'Loan amount must be at most $100,000,000';
    }
  } else {
    errors.loanAmount = 'Loan amount is required';
  }

  // Validate interest rate
  if (input.annualInterestRate !== undefined) {
    const error = validateNonNegativeNumber(input.annualInterestRate, 'Interest rate');
    if (error) {
      errors.annualInterestRate = error;
    } else if (input.annualInterestRate > 100) {
      errors.annualInterestRate = 'Interest rate must be at most 100%';
    }
  } else {
    errors.annualInterestRate = 'Interest rate is required';
  }

  // Validate term
  if (input.termMonths !== undefined) {
    const error = validatePositiveNumber(input.termMonths, 'Loan term');
    if (error) {
      errors.termMonths = error;
    } else if (input.termMonths > 600) {
      errors.termMonths = 'Loan term must be at most 600 months (50 years)';
    } else if (!Number.isInteger(input.termMonths)) {
      errors.termMonths = 'Loan term must be a whole number of months';
    }
  } else {
    errors.termMonths = 'Loan term is required';
  }

  // Validate payment frequency
  if (!input.paymentFrequency) {
    errors.paymentFrequency = 'Payment frequency is required';
  }

  return errors;
}

/**
 * Validate prepayment against loan constraints
 *
 * @param prepayment - Prepayment to validate
 * @param termMonths - Maximum allowed month
 * @param remainingBalance - Optional remaining balance at that month
 * @returns Validation errors (empty object if valid)
 */
export function validatePrepaymentInput(
  prepayment: Partial<Prepayment>,
  termMonths: number,
  remainingBalance?: number
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate month number
  if (prepayment.monthNumber !== undefined) {
    if (!Number.isInteger(prepayment.monthNumber) || prepayment.monthNumber < 1) {
      errors.monthNumber = 'Prepayment month must be a positive integer';
    } else if (prepayment.monthNumber > termMonths) {
      errors.monthNumber = `Prepayment month cannot exceed loan term (${termMonths} months)`;
    }
  } else {
    errors.monthNumber = 'Prepayment month is required';
  }

  // Validate amount
  if (prepayment.amount !== undefined) {
    const error = validatePositiveNumber(prepayment.amount, 'Prepayment amount');
    if (error) {
      errors.amount = error;
    } else if (remainingBalance !== undefined && prepayment.amount > remainingBalance) {
      errors.amount = `Prepayment amount cannot exceed remaining balance ($${remainingBalance.toFixed(2)})`;
    }
  } else {
    errors.amount = 'Prepayment amount is required';
  }

  // Validate strategy
  if (!prepayment.strategy) {
    errors.strategy = 'Prepayment strategy is required';
  }

  return errors;
}
