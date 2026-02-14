/**
 * Prepayment calculation formulas
 *
 * Pure functions for calculating prepayment impacts
 */

import { roundToCents } from '@/utils/math';
import { calculateMonthlyPayment } from './amortization.formulas';
import type { DebtInput, AmortizationPayment, Prepayment } from './debt.types';

/**
 * Apply prepayment with reduce-term strategy
 *
 * When prepayment is made, keeps monthly payment same but reduces total term
 *
 * @param schedule - Original amortization schedule
 * @param prepayment - Prepayment details
 * @param monthlyRate - Monthly interest rate
 * @param monthlyPayment - Original monthly payment
 * @returns Modified schedule with reduced term
 */
export function applyReduceTermPrepayment(
  schedule: AmortizationPayment[],
  prepayment: Prepayment,
  monthlyRate: number,
  monthlyPayment: number
): AmortizationPayment[] {
  const newSchedule: AmortizationPayment[] = [];
  let remainingBalance = schedule[0].remainingBalance + schedule[0].principalPaid; // Get initial balance

  for (let month = 1; month <= schedule.length; month++) {
    // Calculate regular payment breakdown
    const interestPaid = roundToCents(remainingBalance * monthlyRate);
    const principalPaid = roundToCents(monthlyPayment - interestPaid);

    // Apply regular payment
    remainingBalance = roundToCents(remainingBalance - principalPaid);

    // Check if this is the prepayment month - apply AFTER regular payment
    if (month === prepayment.monthNumber) {
      // Apply prepayment to principal
      remainingBalance = roundToCents(remainingBalance - prepayment.amount);

      // If prepayment pays off the loan, stop here
      if (remainingBalance <= 0) {
        newSchedule.push({
          paymentNumber: month,
          paymentLabel: `Mes ${month}`,
          paymentAmount: monthlyPayment,
          principalPaid,
          interestPaid,
          remainingBalance: 0,
        });
        break;
      }
    }

    // Check if loan is paid off
    if (remainingBalance <= 0) {
      remainingBalance = 0;
      newSchedule.push({
        paymentNumber: month,
        paymentLabel: `Mes ${month}`,
        paymentAmount: monthlyPayment,
        principalPaid,
        interestPaid,
        remainingBalance: 0,
      });
      break; // Loan paid off
    }

    newSchedule.push({
      paymentNumber: month,
      paymentLabel: `Mes ${month}`,
      paymentAmount: monthlyPayment,
      principalPaid,
      interestPaid,
      remainingBalance,
    });
  }

  return newSchedule;
}

/**
 * Apply prepayment with reduce-payment strategy
 *
 * When prepayment is made, recalculates monthly payment but keeps original term
 *
 * @param input - Original loan parameters
 * @param prepayment - Prepayment details
 * @param originalSchedule - Original amortization schedule
 * @returns Modified schedule with reduced monthly payment
 */
export function applyReducePaymentPrepayment(
  input: DebtInput,
  prepayment: Prepayment,
  originalSchedule: AmortizationPayment[]
): AmortizationPayment[] {
  const { annualInterestRate, termMonths } = input;
  const monthlyRate = annualInterestRate / 100 / 12;

  const newSchedule: AmortizationPayment[] = [];

  // Copy payments before prepayment month
  for (let i = 0; i < prepayment.monthNumber - 1; i++) {
    newSchedule.push({ ...originalSchedule[i] });
  }

  // Get balance at prepayment month (before the prepayment payment)
  const balanceBeforePrepayment =
    originalSchedule[prepayment.monthNumber - 1].remainingBalance +
    originalSchedule[prepayment.monthNumber - 1].principalPaid;

  // Apply prepayment
  const newBalance = roundToCents(balanceBeforePrepayment - prepayment.amount);

  // Calculate remaining months
  const remainingMonths = termMonths - prepayment.monthNumber + 1;

  // Recalculate monthly payment for remaining term
  const newMonthlyPayment = calculateMonthlyPayment(
    newBalance,
    annualInterestRate / 100,
    remainingMonths
  );

  // Generate new schedule for remaining months
  let remainingBalance = newBalance;

  for (let month = prepayment.monthNumber; month <= termMonths; month++) {
    const interestPaid = roundToCents(remainingBalance * monthlyRate);
    const principalPaid = roundToCents(newMonthlyPayment - interestPaid);

    remainingBalance = roundToCents(remainingBalance - principalPaid);

    // Ensure final balance is exactly 0
    if (month === termMonths) {
      remainingBalance = 0;
    }

    newSchedule.push({
      paymentNumber: month,
      paymentLabel: `Mes ${month}`,
      paymentAmount: newMonthlyPayment,
      principalPaid,
      interestPaid,
      remainingBalance,
    });
  }

  return newSchedule;
}

/**
 * Calculate interest savings from prepayment
 *
 * @param originalSchedule - Original amortization schedule
 * @param prepaymentSchedule - Schedule after prepayment
 * @returns Total interest saved
 */
export function calculateInterestSavings(
  originalSchedule: AmortizationPayment[],
  prepaymentSchedule: AmortizationPayment[]
): number {
  const originalInterest = originalSchedule.reduce((sum, payment) => sum + payment.interestPaid, 0);
  const prepaymentInterest = prepaymentSchedule.reduce(
    (sum, payment) => sum + payment.interestPaid,
    0
  );

  return roundToCents(originalInterest - prepaymentInterest);
}

/**
 * Validate prepayment amount against remaining balance
 *
 * @param prepayment - Prepayment to validate
 * @param schedule - Current amortization schedule
 * @returns True if valid, error message if invalid
 */
export function validatePrepayment(
  prepayment: Prepayment,
  schedule: AmortizationPayment[]
): string | null {
  if (prepayment.monthNumber < 1 || prepayment.monthNumber > schedule.length) {
    return 'El mes del abono a capital debe estar dentro del plazo del préstamo';
  }

  // Get balance at that month (before the payment)
  const payment = schedule[prepayment.monthNumber - 1];
  const balanceBeforePayment = payment.remainingBalance + payment.principalPaid;

  if (prepayment.amount > balanceBeforePayment) {
    return `El abono a capital no puede exceder el saldo restante ($${balanceBeforePayment.toFixed(2)})`;
  }

  if (prepayment.amount <= 0) {
    return 'El monto del abono a capital debe ser positivo';
  }

  return null; // Valid
}
