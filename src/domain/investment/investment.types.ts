/**
 * Investment domain type definitions
 */

/**
 * Frequency of interest compounding
 */
export type CompoundingFrequency = 'monthly' | 'quarterly' | 'annually';

/**
 * Numeric representation of compounding frequency
 * Used in financial formulas
 */
export const COMPOUNDING_PERIODS: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

/**
 * User input for investment profitability projection
 */
export interface InvestmentInput {
  /**
   * Initial investment amount in dollars
   * @constraint Positive number, max 1,000,000,000
   * @example 10000
   */
  initialAmount: number;

  /**
   * Monthly contribution amount in dollars
   * @constraint Non-negative number, max 1,000,000
   * @example 500
   */
  monthlyContribution: number;

  /**
   * Investment duration in months
   * @constraint Positive integer, max 1200 (100 years)
   * @example 60 (5 years)
   */
  durationMonths: number;

  /**
   * Annual interest rate as percentage
   * @constraint Non-negative number, max 100
   * @example 7.5 (for 7.5% annual rate)
   */
  annualInterestRate: number;

  /**
   * How often interest compounds per year
   */
  compoundingFrequency: CompoundingFrequency;
}

/**
 * Represents investment state at end of a specific period
 */
export interface InvestmentPeriod {
  /**
   * Period number (1-indexed)
   * @example 1, 2, 3, ..., 60
   */
  periodNumber: number;

  /**
   * Period end date representation
   * For monthly: "Month 1", "Month 2", etc.
   * For yearly: "Year 1", "Year 2", etc.
   */
  periodLabel: string;

  /**
   * Cumulative amount invested up to this period
   * (initial + contributions up to this point)
   */
  totalInvested: number;

  /**
   * Cumulative interest earned up to this period
   */
  interestEarned: number;

  /**
   * Total balance at end of this period
   * (totalInvested + interestEarned)
   */
  balance: number;
}

/**
 * Calculated investment projection results
 */
export interface InvestmentResult {
  /**
   * Total amount invested (initial + all contributions)
   */
  totalInvested: number;

  /**
   * Total interest earned over investment period
   */
  totalInterestEarned: number;

  /**
   * Final value of investment (totalInvested + totalInterestEarned)
   */
  finalValue: number;

  /**
   * Period-by-period breakdown of investment growth
   */
  breakdown: InvestmentPeriod[];

  /**
   * Input parameters used for this calculation
   * (Useful for displaying alongside results)
   */
  input: InvestmentInput;
}

/**
 * Investment form state
 */
export type InvestmentFormState = {
  values: InvestmentInput;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
};

/**
 * Check if value is a valid CompoundingFrequency
 */
export function isCompoundingFrequency(value: unknown): value is CompoundingFrequency {
  return typeof value === 'string' && ['monthly', 'quarterly', 'annually'].includes(value);
}

/**
 * Convert years to months
 */
export function yearsToMonths(years: number): number {
  return Math.round(years * 12);
}

/**
 * Convert months to years (rounded to 2 decimals)
 */
export function monthsToYears(months: number): number {
  return Math.round((months / 12) * 100) / 100;
}
