/**
 * Tax calculation service - Colombia 2026
 * Orchestrates formulas and builds result with deduction lines
 */

import { roundToCents } from '@/utils/math';
import { UVT_2026 } from './taxes.constants';
import {
  calculateRetentionPesos,
  getMarginalRateForBaseUVT,
  getTransportAllowance,
  getPensionDeduction,
  getHealthDeduction,
  getFSPDeduction,
} from './taxes.formulas';
import type { TaxInput, TaxResult, DeductionLine } from './taxes.types';

/**
 * Calculate full tax result from user input
 *
 * @param input - Gross salary and periodicity
 * @returns TaxResult with all amounts and deduction lines
 */
export function calculateTax(input: TaxInput): TaxResult {
  const grossMonthly =
    input.periodicity === 'annual'
      ? roundToCents(input.grossSalary / 12)
      : roundToCents(input.grossSalary);
  const grossAnnual = roundToCents(grossMonthly * 12);

  const pension = getPensionDeduction(grossMonthly);
  const health = getHealthDeduction(grossMonthly);
  const fsp = getFSPDeduction(grossMonthly);
  const taxableBaseMonthly = roundToCents(grossMonthly - pension - health - fsp);
  const retention = calculateRetentionPesos(taxableBaseMonthly);
  const transportAllowance = getTransportAllowance(grossMonthly);

  const totalDeductionsMonthly = pension + health + fsp + retention;
  const netPayMonthly = roundToCents(
    grossMonthly - totalDeductionsMonthly + transportAllowance
  );
  const netPayAnnual = roundToCents(netPayMonthly * 12);

  const totalTaxesAnnual = retention * 12;
  const effectiveTaxRatePercent =
    grossAnnual > 0 ? roundToCents((totalTaxesAnnual / grossAnnual) * 100) : 0;
  const taxableBaseUVT = taxableBaseMonthly / UVT_2026;
  const marginalRate = getMarginalRateForBaseUVT(taxableBaseUVT);
  const marginalTaxRatePercent = roundToCents(marginalRate * 100);

  const deductionLines: DeductionLine[] = [
    { labelKey: 'taxes.deductions.grossSalary', label: 'Salario', amount: grossMonthly, isDeduction: false },
    { labelKey: 'taxes.deductions.pension', label: 'Pensión obligatoria', amount: -pension, isDeduction: true },
    { labelKey: 'taxes.deductions.health', label: 'Salud (EPS)', amount: -health, isDeduction: true },
  ];
  if (fsp > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.fsp',
      label: 'Fondo de Solidaridad Pensional',
      amount: -fsp,
      isDeduction: true,
    });
  }
  if (transportAllowance > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.transport',
      label: 'Auxilio de transporte',
      amount: transportAllowance,
      isDeduction: false,
    });
  }
  deductionLines.push(
    { labelKey: 'taxes.deductions.retention', label: 'Retención en la fuente', amount: -retention, isDeduction: true }
  );

  return {
    grossSalaryMonthly: grossMonthly,
    grossSalaryAnnual: grossAnnual,
    pension,
    health,
    fsp,
    transportAllowance,
    taxableBaseMonthly,
    retention,
    totalDeductionsMonthly,
    netPayMonthly,
    netPayAnnual,
    effectiveTaxRatePercent,
    marginalTaxRatePercent,
    deductionLines,
    input,
  };
}
