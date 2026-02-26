/**
 * Tax calculation formulas - Colombia 2026
 * Retención en la fuente sobre ingresos laborales (Art. 383 ET)
 */

import { roundToCents } from '@/utils/math';
import {
  UVT_2026,
  SMLMV_2026,
  AUXILIO_TRANSPORTE_2026,
  AUXILIO_TRANSPORTE_MAX_SALARY,
  PENSION_RATE,
  HEALTH_RATE,
  FSP_THRESHOLD_PESOS,
  FSP_BRACKETS,
  RETENTION_BRACKETS_2026,
  RETENTION_START_UVT,
} from './taxes.constants';

/**
 * Calculate income tax withholding in UVT using the progressive table
 * Result is in UVT; multiply by UVT_2026 to get pesos
 *
 * @param taxableBaseUVT - Taxable base (ingreso laboral depurado) in UVT
 * @returns Tax amount in UVT
 */
export function calculateRetentionUVT(taxableBaseUVT: number): number {
  if (taxableBaseUVT <= RETENTION_START_UVT) return 0;

  const brackets = RETENTION_BRACKETS_2026;
  for (let i = 1; i < brackets.length; i++) {
    const bracket = brackets[i];
    const prevLimit = brackets[i - 1].limitUVT;
    if (taxableBaseUVT <= bracket.limitUVT) {
      return bracket.accumulatedTaxUVT + (taxableBaseUVT - prevLimit) * bracket.marginalRate;
    }
  }
  const last = brackets[brackets.length - 1];
  const prevLimit = brackets[brackets.length - 2].limitUVT;
  return last.accumulatedTaxUVT + (taxableBaseUVT - prevLimit) * last.marginalRate;
}

/**
 * Get marginal rate (0-1) for a given taxable base in UVT
 */
export function getMarginalRateForBaseUVT(taxableBaseUVT: number): number {
  if (taxableBaseUVT <= RETENTION_START_UVT) return 0;
  const brackets = RETENTION_BRACKETS_2026;
  for (let i = 1; i < brackets.length; i++) {
    if (taxableBaseUVT <= brackets[i].limitUVT) return brackets[i].marginalRate;
  }
  return brackets[brackets.length - 1].marginalRate;
}

/**
 * Calculate retention in pesos from taxable base in pesos (monthly)
 */
export function calculateRetentionPesos(taxableBaseMonthlyPesos: number): number {
  const uvt = taxableBaseMonthlyPesos / UVT_2026;
  const taxUVT = calculateRetentionUVT(uvt);
  return roundToCents(taxUVT * UVT_2026);
}

/**
 * Transport allowance: only if monthly gross <= 2 SMLMV
 */
export function getTransportAllowance(grossSalaryMonthly: number): number {
  return grossSalaryMonthly <= AUXILIO_TRANSPORTE_MAX_SALARY ? AUXILIO_TRANSPORTE_2026 : 0;
}

/**
 * Pension deduction (4% of gross - IBC is salary without auxilio)
 */
export function getPensionDeduction(grossSalaryMonthly: number): number {
  return roundToCents(grossSalaryMonthly * PENSION_RATE);
}

/**
 * Health deduction (4% of gross)
 */
export function getHealthDeduction(grossSalaryMonthly: number): number {
  return roundToCents(grossSalaryMonthly * HEALTH_RATE);
}

/**
 * Fondo de Solidaridad Pensional (FSP) - solo si IBC >= 4 SMMLV
 * Base: IBC (salario mensual). Tasa según tramos en SMMLV.
 */
export function getFSPDeduction(grossSalaryMonthly: number): number {
  if (grossSalaryMonthly < FSP_THRESHOLD_PESOS) return 0;
  const smmlv = grossSalaryMonthly / SMLMV_2026;
  let rate = 0;
  for (const bracket of FSP_BRACKETS) {
    if (smmlv <= bracket.limitSMMLV) {
      rate = bracket.rate;
      break;
    }
    rate = bracket.rate;
  }
  return roundToCents(grossSalaryMonthly * rate);
}
