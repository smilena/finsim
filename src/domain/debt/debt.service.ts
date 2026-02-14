/**
 * Debt calculation service
 *
 * Orchestrates amortization and prepayment formulas
 */

import { calculateMonthlyPayment, generateAmortizationSchedule } from './amortization.formulas';
import {
  applyReduceTermPrepayment,
  applyReducePaymentPrepayment,
  calculateInterestSavings,
  validatePrepayment,
} from './prepayment.formulas';
import { roundToCents } from '@/utils/math';
import type { DebtInput, AmortizationSchedule, Prepayment, PrepaymentResult } from './debt.types';

/**
 * Calculate complete amortization schedule for a loan
 *
 * @param input - Loan parameters
 * @returns Complete amortization schedule with totals
 */
export function calculateAmortizationSchedule(input: DebtInput): AmortizationSchedule {
  const { loanAmount, annualInterestRate, termMonths } = input;

  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate / 100, termMonths);

  const schedule = generateAmortizationSchedule(input);

  // Calculate totals
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestPaid, 0);
  const totalPrincipal = schedule.reduce((sum, payment) => sum + payment.principalPaid, 0);
  const totalPaid = totalInterest + totalPrincipal;

  return {
    monthlyPayment,
    totalPrincipal: roundToCents(totalPrincipal),
    totalInterest: roundToCents(totalInterest),
    totalPaid: roundToCents(totalPaid),
    actualTermMonths: schedule.length,
    schedule,
    input,
  };
}

/**
 * Apply prepayments to amortization schedule and calculate savings
 *
 * @param input - Original loan parameters
 * @param prepayments - List of prepayments to apply
 * @returns Comparison of scenarios with and without prepayments
 */
export function applyPrepayments(input: DebtInput, prepayments: Prepayment[]): PrepaymentResult {
  // Calculate base scenario (no prepayments)
  const baseScenario = calculateAmortizationSchedule(input);

  if (prepayments.length === 0) {
    // No prepayments, return base scenario
    return {
      baseScenario,
      prepaymentScenario: baseScenario,
      prepayments: [],
      interestSavings: 0,
      interestSavingsPercent: 0,
      termReduction: null,
      newMonthlyPayment: null,
    };
  }

  // Sort prepayments by month
  const sortedPrepayments = [...prepayments].sort((a, b) => a.monthNumber - b.monthNumber);

  // Validate all prepayments against base schedule
  for (const prepayment of sortedPrepayments) {
    const error = validatePrepayment(prepayment, baseScenario.schedule);
    if (error) {
      throw new Error(error);
    }
  }

  const monthlyRate = input.annualInterestRate / 100 / 12;
  const originalMonthlyPayment = baseScenario.monthlyPayment;
  
  // Check if all prepayments use the same strategy
  const firstStrategy = sortedPrepayments[0].strategy;
  const mixedStrategies = sortedPrepayments.some(p => p.strategy !== firstStrategy);
  
  if (mixedStrategies) {
    // For simplicity, if mixed strategies, only apply the first prepayment
    // A full implementation would require complex recalculation logic
    const prepayment = sortedPrepayments[0];
    return applySinglePrepayment(baseScenario, prepayment, monthlyRate, originalMonthlyPayment, input);
  }

  // All prepayments use the same strategy
  if (firstStrategy === 'reduce-term') {
    return applyMultipleReduceTermPrepayments(
      baseScenario, 
      sortedPrepayments, 
      monthlyRate, 
      originalMonthlyPayment,
      input
    );
  } else {
    return applyMultipleReducePaymentPrepayments(
      baseScenario,
      sortedPrepayments,
      monthlyRate,
      input
    );
  }
}

/**
 * Apply a single prepayment
 */
function applySinglePrepayment(
  baseScenario: AmortizationSchedule,
  prepayment: Prepayment,
  monthlyRate: number,
  monthlyPayment: number,
  input: DebtInput
): PrepaymentResult {
  let prepaymentSchedule;
  let newMonthlyPayment: number | null = null;
  let termReduction: number | null = null;

  if (prepayment.strategy === 'reduce-term') {
    prepaymentSchedule = applyReduceTermPrepayment(
      baseScenario.schedule,
      prepayment,
      monthlyRate,
      monthlyPayment
    );
    termReduction = baseScenario.actualTermMonths - prepaymentSchedule.length;
  } else {
    prepaymentSchedule = applyReducePaymentPrepayment(input, prepayment, baseScenario.schedule);
    const paymentAfter = prepaymentSchedule[prepayment.monthNumber];
    newMonthlyPayment = paymentAfter?.paymentAmount || null;
  }

  const prepaymentScenario = createScheduleResult(prepaymentSchedule, newMonthlyPayment || monthlyPayment, input);
  const interestSavings = calculateInterestSavings(baseScenario.schedule, prepaymentSchedule);
  const interestSavingsPercent = baseScenario.totalInterest > 0 
    ? (interestSavings / baseScenario.totalInterest) * 100 
    : 0;

  return {
    baseScenario,
    prepaymentScenario,
    prepayments: [prepayment],
    interestSavings: roundToCents(interestSavings),
    interestSavingsPercent: roundToCents(interestSavingsPercent),
    termReduction,
    newMonthlyPayment,
  };
}

/**
 * Apply multiple reduce-term prepayments sequentially
 */
function applyMultipleReduceTermPrepayments(
  baseScenario: AmortizationSchedule,
  prepayments: Prepayment[],
  monthlyRate: number,
  monthlyPayment: number,
  input: DebtInput
): PrepaymentResult {
  const newSchedule: AmortizationPayment[] = [];
  let remainingBalance = baseScenario.schedule[0].remainingBalance + baseScenario.schedule[0].principalPaid;
  let currentMonth = 1;
  let prepaymentIndex = 0;

  while (remainingBalance > 0.01 && currentMonth <= baseScenario.schedule.length + 1000) {
    // Calculate regular payment
    const interestPaid = roundToCents(remainingBalance * monthlyRate);
    const principalPaid = roundToCents(Math.min(monthlyPayment - interestPaid, remainingBalance));
    
    remainingBalance = roundToCents(remainingBalance - principalPaid);

    // Check if there's a prepayment for this month in the ORIGINAL schedule
    if (prepaymentIndex < prepayments.length && prepayments[prepaymentIndex].monthNumber === currentMonth) {
      const prepaymentAmount = prepayments[prepaymentIndex].amount;
      remainingBalance = roundToCents(remainingBalance - prepaymentAmount);
      prepaymentIndex++;
    }

    // Add payment to schedule
    if (remainingBalance <= 0.01) {
      remainingBalance = 0;
    }

    newSchedule.push({
      paymentNumber: currentMonth,
      paymentLabel: `Mes ${currentMonth}`,
      paymentAmount: monthlyPayment,
      principalPaid,
      interestPaid,
      remainingBalance,
    });

    if (remainingBalance === 0) {
      break;
    }

    currentMonth++;
  }

  const termReduction = baseScenario.actualTermMonths - newSchedule.length;
  const prepaymentScenario = createScheduleResult(newSchedule, monthlyPayment, input);
  const interestSavings = calculateInterestSavings(baseScenario.schedule, newSchedule);
  const interestSavingsPercent = baseScenario.totalInterest > 0 
    ? (interestSavings / baseScenario.totalInterest) * 100 
    : 0;

  return {
    baseScenario,
    prepaymentScenario,
    prepayments,
    interestSavings: roundToCents(interestSavings),
    interestSavingsPercent: roundToCents(interestSavingsPercent),
    termReduction,
    newMonthlyPayment: null,
  };
}

/**
 * Apply multiple reduce-payment prepayments sequentially
 */
function applyMultipleReducePaymentPrepayments(
  baseScenario: AmortizationSchedule,
  prepayments: Prepayment[],
  monthlyRate: number,
  input: DebtInput
): PrepaymentResult {
  const newSchedule: AmortizationPayment[] = [];
  let remainingBalance = baseScenario.schedule[0].remainingBalance + baseScenario.schedule[0].principalPaid;
  let currentMonthlyPayment = baseScenario.monthlyPayment;
  let prepaymentIndex = 0;

  for (let month = 1; month <= input.termMonths; month++) {
    // Check if there's a prepayment for this month
    if (prepaymentIndex < prepayments.length && prepayments[prepaymentIndex].monthNumber === month) {
      const prepaymentAmount = prepayments[prepaymentIndex].amount;
      
      // First, apply regular payment
      const interestPaid = roundToCents(remainingBalance * monthlyRate);
      const principalPaid = roundToCents(currentMonthlyPayment - interestPaid);
      remainingBalance = roundToCents(remainingBalance - principalPaid);
      
      // Then apply prepayment
      remainingBalance = roundToCents(remainingBalance - prepaymentAmount);
      
      // Add the payment to schedule
      newSchedule.push({
        paymentNumber: month,
        paymentLabel: `Mes ${month}`,
        paymentAmount: currentMonthlyPayment,
        principalPaid,
        interestPaid,
        remainingBalance,
      });

      // Recalculate monthly payment for remaining term
      const remainingMonths = input.termMonths - month;
      if (remainingMonths > 0 && remainingBalance > 0) {
        currentMonthlyPayment = calculateMonthlyPayment(
          remainingBalance,
          input.annualInterestRate / 100,
          remainingMonths
        );
      }
      
      prepaymentIndex++;
    } else {
      // Regular payment (no prepayment this month)
      const interestPaid = roundToCents(remainingBalance * monthlyRate);
      const principalPaid = roundToCents(Math.min(currentMonthlyPayment - interestPaid, remainingBalance));
      
      remainingBalance = roundToCents(remainingBalance - principalPaid);

      if (remainingBalance <= 0.01) {
        remainingBalance = 0;
      }

      newSchedule.push({
        paymentNumber: month,
        paymentLabel: `Mes ${month}`,
        paymentAmount: currentMonthlyPayment,
        principalPaid,
        interestPaid,
        remainingBalance,
      });

      if (remainingBalance === 0) {
        break;
      }
    }
  }

  const prepaymentScenario = createScheduleResult(newSchedule, currentMonthlyPayment, input);
  const interestSavings = calculateInterestSavings(baseScenario.schedule, newSchedule);
  const interestSavingsPercent = baseScenario.totalInterest > 0 
    ? (interestSavings / baseScenario.totalInterest) * 100 
    : 0;

  return {
    baseScenario,
    prepaymentScenario,
    prepayments,
    interestSavings: roundToCents(interestSavings),
    interestSavingsPercent: roundToCents(interestSavingsPercent),
    termReduction: null,
    newMonthlyPayment: currentMonthlyPayment,
  };
}

/**
 * Helper to create AmortizationSchedule from payment array
 */
function createScheduleResult(
  schedule: AmortizationPayment[],
  monthlyPayment: number,
  input: DebtInput
): AmortizationSchedule {
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interestPaid, 0);
  const totalPrincipal = schedule.reduce((sum, payment) => sum + payment.principalPaid, 0);

  return {
    monthlyPayment,
    totalPrincipal: roundToCents(totalPrincipal),
    totalInterest: roundToCents(totalInterest),
    totalPaid: roundToCents(totalInterest + totalPrincipal),
    actualTermMonths: schedule.length,
    schedule,
    input,
  };
}
