/**
 * Investment calculation service
 *
 * Orchestrates investment formulas to generate complete projections
 */

import {
  calculateFutureValuePrincipal,
  calculateFutureValueContributions,
  generateInvestmentBreakdown,
} from './investment.formulas';
import { COMPOUNDING_PERIODS } from './investment.types';
import type { InvestmentInput, InvestmentResult } from './investment.types';
import { roundToCents } from '@/utils/math';

/**
 * Calculate complete investment projection
 *
 * Takes investment parameters and returns full projection including:
 * - Total invested
 * - Total interest earned
 * - Final value
 * - Period-by-period breakdown
 *
 * @param input - Investment input parameters
 * @returns Complete investment projection results
 */
export function calculateInvestmentProjection(input: InvestmentInput): InvestmentResult {
  const { initialAmount, monthlyContribution, durationMonths, annualInterestRate } = input;

  const periodsPerYear = COMPOUNDING_PERIODS[input.compoundingFrequency];
  const years = durationMonths / 12;
  const annualRate = annualInterestRate / 100; // Convert percentage to decimal

  // Calculate future value of initial principal
  const fvPrincipal = calculateFutureValuePrincipal(
    initialAmount,
    annualRate,
    periodsPerYear,
    years
  );

  // Calculate future value of monthly contributions
  const fvContributions = calculateFutureValueContributions(
    monthlyContribution,
    annualRate,
    periodsPerYear,
    years
  );

  // Calculate totals
  const totalInvested = initialAmount + monthlyContribution * durationMonths;
  const finalValue = fvPrincipal + fvContributions;
  const totalInterestEarned = finalValue - totalInvested;

  // Generate period-by-period breakdown
  const breakdown = generateInvestmentBreakdown(input, 'monthly');

  return {
    totalInvested: roundToCents(totalInvested),
    totalInterestEarned: roundToCents(totalInterestEarned),
    finalValue: roundToCents(finalValue),
    breakdown,
    input,
  };
}
