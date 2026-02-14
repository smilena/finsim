/**
 * Debt domain type definitions
 */

/**
 * Frequency of loan payments
 */
export type PaymentFrequency = 'monthly' | 'bi-weekly';

/**
 * Number of payments per year
 */
export const PAYMENT_PERIODS: Record<PaymentFrequency, number> = {
  monthly: 12,
  'bi-weekly': 26,
};

/**
 * User input for loan amortization calculation
 */
export interface DebtInput {
  /**
   * Principal loan amount in dollars
   * @constraint Positive number, max 100,000,000
   * @example 200000
   */
  loanAmount: number;

  /**
   * Annual interest rate as percentage
   * @constraint Non-negative number, max 100
   * @example 5.5 (for 5.5% annual rate)
   */
  annualInterestRate: number;

  /**
   * Loan term in months
   * @constraint Positive integer, max 600 (50 years)
   * @example 360 (30 years)
   */
  termMonths: number;

  /**
   * How often payments are made
   */
  paymentFrequency: PaymentFrequency;
}

/**
 * Represents a single payment in the amortization schedule
 */
export interface AmortizationPayment {
  /**
   * Payment number (1-indexed)
   * @example 1, 2, 3, ..., 360
   */
  paymentNumber: number;

  /**
   * Payment date representation
   * @example "Month 1", "Month 2", etc.
   */
  paymentLabel: string;

  /**
   * Total payment amount for this period
   * (Usually fixed, may vary for final payment)
   */
  paymentAmount: number;

  /**
   * Portion of payment applied to principal
   */
  principalPaid: number;

  /**
   * Portion of payment applied to interest
   */
  interestPaid: number;

  /**
   * Remaining loan balance after this payment
   */
  remainingBalance: number;
}

/**
 * Complete amortization schedule for a loan
 */
export interface AmortizationSchedule {
  /**
   * Fixed payment amount per period
   */
  monthlyPayment: number;

  /**
   * Total principal paid over life of loan
   * (Should equal original loan amount)
   */
  totalPrincipal: number;

  /**
   * Total interest paid over life of loan
   */
  totalInterest: number;

  /**
   * Total amount paid (principal + interest)
   */
  totalPaid: number;

  /**
   * Actual term (number of payments)
   * Usually equals input termMonths, but may differ if prepayments applied
   */
  actualTermMonths: number;

  /**
   * Payment-by-payment breakdown
   */
  schedule: AmortizationPayment[];

  /**
   * Input parameters used for this calculation
   */
  input: DebtInput;
}

/**
 * How prepayment affects the loan
 */
export type PrepaymentStrategy = 'reduce-payment' | 'reduce-term';

/**
 * Display labels for prepayment strategies
 */
export const PREPAYMENT_STRATEGY_LABELS: Record<PrepaymentStrategy, string> = {
  'reduce-payment': 'Reduce Monthly Payment',
  'reduce-term': 'Reduce Loan Term',
};

/**
 * Represents a capital prepayment (extra payment toward principal)
 */
export interface Prepayment {
  /**
   * Month number when prepayment occurs (1-indexed)
   * @constraint Must be between 1 and termMonths
   * @constraint Must not exceed actual loan term
   * @example 12 (prepayment in month 12)
   */
  monthNumber: number;

  /**
   * Prepayment amount in dollars
   * @constraint Positive number
   * @constraint Must not exceed remaining balance at that month
   * @example 10000
   */
  amount: number;

  /**
   * Strategy for applying prepayment
   */
  strategy: PrepaymentStrategy;
}

/**
 * Comparison of loan scenarios with and without prepayments
 */
export interface PrepaymentResult {
  /**
   * Original amortization schedule without prepayments
   */
  baseScenario: AmortizationSchedule;

  /**
   * Modified amortization schedule with prepayments applied
   */
  prepaymentScenario: AmortizationSchedule;

  /**
   * List of prepayments applied
   */
  prepayments: Prepayment[];

  /**
   * Total interest saved by making prepayments
   * (base total interest - prepayment total interest)
   */
  interestSavings: number;

  /**
   * Percentage of interest saved
   * (interestSavings / base total interest * 100)
   */
  interestSavingsPercent: number;

  /**
   * Months saved (only if reduce-term strategy used)
   * (base term - prepayment term)
   */
  termReduction: number | null;

  /**
   * New monthly payment amount (only if reduce-payment strategy used)
   */
  newMonthlyPayment: number | null;
}

/**
 * Summary statistics for quick comparison
 */
export interface PrepaymentSummary {
  baseMonthlyPayment: number;
  baseTermMonths: number;
  baseTotalInterest: number;
  baseTotalPaid: number;

  prepaymentMonthlyPayment: number;
  prepaymentTermMonths: number;
  prepaymentTotalInterest: number;
  prepaymentTotalPaid: number;

  totalSavings: number; // Interest + any reduced payments
}

/**
 * Debt form state
 */
export type DebtFormState = {
  values: DebtInput;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
};

/**
 * Check if value is a valid PaymentFrequency
 */
export function isPaymentFrequency(value: unknown): value is PaymentFrequency {
  return typeof value === 'string' && ['monthly', 'bi-weekly'].includes(value);
}

/**
 * Check if value is a valid PrepaymentStrategy
 */
export function isPrepaymentStrategy(value: unknown): value is PrepaymentStrategy {
  return typeof value === 'string' && ['reduce-payment', 'reduce-term'].includes(value);
}
