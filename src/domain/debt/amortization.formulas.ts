/**
 * Amortization calculation formulas
 *
 * Pure functions for calculating loan amortization schedules
 */

import { roundToCents } from '@/utils/math';
import type { DebtInput, AmortizationPayment } from './debt.types';

/**
 * Calculate monthly payment for a fixed-rate loan
 *
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Where:
 * - M = Monthly payment
 * - P = Principal (loan amount)
 * - r = Monthly interest rate (annual rate / 12)
 * - n = Number of payments (term in months)
 *
 * @example
 * Reference case (verified with standard calculators):
 * - Loan: $200,000
 * - Rate: 5% annual (0.05 as decimal)
 * - Term: 360 months (30 years)
 * - Expected monthly payment: ~$1,073.64
 *
 * @param loanAmount - Principal loan amount
 * @param annualRate - Annual interest rate (as decimal, e.g., 0.055 for 5.5%)
 * @param termMonths - Loan term in months
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): number {
  if (loanAmount <= 0 || termMonths <= 0) return 0;
  if (annualRate === 0) {
    // No interest, just divide principal by term
    return roundToCents(loanAmount / termMonths);
  }

  const monthlyRate = annualRate / 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  const monthlyPayment = loanAmount * (numerator / denominator);

  return roundToCents(monthlyPayment);
}

/**
 * Calculate principal and interest breakdown for a single payment
 *
 * @param remainingBalance - Current loan balance
 * @param monthlyPayment - Fixed monthly payment
 * @param monthlyRate - Monthly interest rate (annual / 12)
 * @returns Object with principal and interest amounts
 */
export function calculatePaymentBreakdown(
  remainingBalance: number,
  monthlyPayment: number,
  monthlyRate: number
): { principalPaid: number; interestPaid: number } {
  // Interest is calculated on remaining balance
  const interestPaid = roundToCents(remainingBalance * monthlyRate);

  // Principal is whatever is left of the payment after interest
  const principalPaid = roundToCents(monthlyPayment - interestPaid);

  return { principalPaid, interestPaid };
}

/**
 * Generate complete amortization schedule
 *
 * @param input - Loan parameters
 * @returns Array of payment details for each month
 */
export function generateAmortizationSchedule(input: DebtInput): AmortizationPayment[] {
  const { loanAmount, annualInterestRate, termMonths } = input;

  const monthlyRate = annualInterestRate / 100 / 12; // Convert percentage to decimal
  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate / 100, termMonths);

  const schedule: AmortizationPayment[] = [];
  let remainingBalance = loanAmount;

  for (let month = 1; month <= termMonths; month++) {
    const { principalPaid, interestPaid } = calculatePaymentBreakdown(
      remainingBalance,
      monthlyPayment,
      monthlyRate
    );

    // Update remaining balance
    remainingBalance = roundToCents(remainingBalance - principalPaid);

    // Ensure final balance is exactly 0 (handle rounding errors)
    if (month === termMonths) {
      remainingBalance = 0;
    }

    schedule.push({
      paymentNumber: month,
      paymentLabel: `Mes ${month}`,
      paymentAmount: monthlyPayment,
      principalPaid,
      interestPaid,
      remainingBalance,
    });
  }

  return schedule;
}
