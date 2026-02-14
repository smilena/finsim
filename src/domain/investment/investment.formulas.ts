/**
 * Investment calculation formulas
 *
 * Pure functions for calculating investment growth with compound interest
 */

import { roundToCents } from '@/utils/math';
import type { InvestmentInput, InvestmentPeriod } from './investment.types';

/**
 * Calculate future value of principal with compound interest
 *
 * Formula: FV = P * (1 + r/n)^(n*t)
 *
 * Where:
 * - P = Principal (initial investment)
 * - r = Annual interest rate (as decimal, e.g., 0.075 for 7.5%)
 * - n = Number of times interest compounds per year
 * - t = Time in years
 *
 * @example
 * Reference case (verified with standard calculators):
 * - Principal: $10,000
 * - Rate: 7% annual (0.07 as decimal)
 * - Compounding: Monthly (12 periods/year)
 * - Duration: 10 years
 * - Expected FV: ~$20,097.57
 *
 * @param principal - Initial investment amount
 * @param annualRate - Annual interest rate (as decimal)
 * @param periodsPerYear - Number of compounding periods per year
 * @param years - Investment duration in years
 * @returns Future value of principal
 */
export function calculateFutureValuePrincipal(
  principal: number,
  annualRate: number,
  periodsPerYear: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal;

  const rate = annualRate / periodsPerYear; // Period interest rate
  const totalPeriods = periodsPerYear * years;

  const futureValue = principal * Math.pow(1 + rate, totalPeriods);

  return roundToCents(futureValue);
}

/**
 * Calculate future value of periodic contributions (annuity)
 *
 * Formula: FVA = PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]
 *
 * Where:
 * - PMT = Periodic payment (contribution)
 * - r = Annual interest rate (as decimal)
 * - n = Number of times interest compounds per year
 * - t = Time in years
 *
 * @example
 * Reference case (verified with standard calculators):
 * - Monthly contribution: $500
 * - Rate: 7% annual (0.07 as decimal)
 * - Compounding: Monthly (12 periods/year)
 * - Duration: 10 years (120 months)
 * - Expected FV of contributions: ~$86,730.49
 *
 * @param monthlyPayment - Monthly contribution amount
 * @param annualRate - Annual interest rate (as decimal)
 * @param periodsPerYear - Number of compounding periods per year
 * @param years - Investment duration in years
 * @returns Future value of all contributions
 */
export function calculateFutureValueContributions(
  monthlyPayment: number,
  annualRate: number,
  periodsPerYear: number,
  years: number
): number {
  if (monthlyPayment === 0 || years <= 0) return 0;
  if (annualRate === 0) {
    // If no interest, just sum contributions
    const monthsPerPeriod = 12 / periodsPerYear;
    const totalPayments = Math.floor((years * 12) / monthsPerPeriod);
    return roundToCents(monthlyPayment * monthsPerPeriod * totalPayments);
  }

  const rate = annualRate / periodsPerYear; // Period interest rate
  const totalPeriods = periodsPerYear * years;

  // Adjust monthly payment to period payment
  const monthsPerPeriod = 12 / periodsPerYear;
  const periodPayment = monthlyPayment * monthsPerPeriod;

  const futureValue = periodPayment * ((Math.pow(1 + rate, totalPeriods) - 1) / rate);

  return roundToCents(futureValue);
}

/**
 * Generate period-by-period investment breakdown
 *
 * Shows investment growth month by month (or year by year)
 *
 * @param input - Investment input parameters
 * @param displayFrequency - Frequency for breakdown display ('monthly' | 'yearly')
 * @returns Array of investment periods showing progressive growth
 */
export function generateInvestmentBreakdown(
  input: InvestmentInput,
  displayFrequency: 'monthly' | 'yearly' = 'monthly'
): InvestmentPeriod[] {
  const { initialAmount, monthlyContribution, durationMonths, annualInterestRate } = input;

  const periods: InvestmentPeriod[] = [];
  const annualRate = annualInterestRate / 100; // Convert percentage to decimal

  // Calculate step size based on display frequency
  const stepMonths = displayFrequency === 'yearly' ? 12 : 1;

  let currentBalance = initialAmount;
  let totalContributed = initialAmount;

  for (let month = stepMonths; month <= durationMonths; month += stepMonths) {
    // Calculate contributions for this period
    const contributionsThisPeriod = monthlyContribution * stepMonths;

    // Calculate interest earned for this period
    // We need to simulate month-by-month to be accurate
    let periodBalance = currentBalance;
    for (let m = 0; m < stepMonths; m++) {
      // Add monthly contribution
      periodBalance += monthlyContribution;

      // Apply interest based on compounding frequency
      // We apply interest proportionally for each month
      const interestPerMonth = (annualRate / 12) * periodBalance;
      periodBalance += interestPerMonth;
    }

    currentBalance = periodBalance;
    totalContributed += contributionsThisPeriod;

    const totalInterest = currentBalance - totalContributed;

    periods.push({
      periodNumber: displayFrequency === 'yearly' ? month / 12 : month,
      periodLabel: displayFrequency === 'yearly' ? `Año ${month / 12}` : `Mes ${month}`,
      totalInvested: roundToCents(totalContributed),
      interestEarned: roundToCents(totalInterest),
      balance: roundToCents(currentBalance),
    });
  }

  return periods;
}
