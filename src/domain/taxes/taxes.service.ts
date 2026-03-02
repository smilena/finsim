/**
 * Tax calculation service - Colombia 2026
 * Orchestrates formulas and builds result with deduction lines
 *
 * Key rules:
 * - Deductions (pension, health, FSP) apply ONLY to base salary (IBC), NOT to transport allowance
 * - Transport allowance: only if base salary <= 2 SMMLV
 * - Retention: only if taxable base exceeds legal minimum (95 UVT)
 */

import { roundToCents } from '@/utils/math';
import {
  AUXILIO_TRANSPORTE_2026,
  AUXILIO_TRANSPORTE_MAX_SALARY,
  UVT_2026,
  MEDICINA_PREPAGADA_MAX_UVT,
  DEDUCCION_DEPENDIENTE_UVT,
} from './taxes.constants';
import {
  calculateRetentionPesos,
  getMarginalRateForBaseUVT,
  getPensionDeduction,
  getHealthDeduction,
  getFSPDeduction,
} from './taxes.formulas';
import type { TaxInput, TaxResult, DeductionLine } from './taxes.types';

/**
 * Resolve base salary and transport allowance from user input.
 * User enters base salary (salario contractual). If <= 2 SMMLV, auxilio applies.
 * Validation: auxilio only if baseSalary <= 2 SMMLV.
 */
function resolveBaseSalaryAndAuxilio(grossMonthly: number): {
  baseSalaryMonthly: number;
  transportAllowance: number;
} {
  const baseSalaryMonthly = grossMonthly;
  const transportAllowance =
    baseSalaryMonthly <= AUXILIO_TRANSPORTE_MAX_SALARY
      ? AUXILIO_TRANSPORTE_2026
      : 0;
  return { baseSalaryMonthly, transportAllowance };
}

/**
 * Calculate full tax result from user input
 *
 * @param input - Gross salary (total devengado) and periodicity
 * @returns TaxResult with all amounts and deduction lines
 */
export function calculateTax(input: TaxInput): TaxResult {
  const grossMonthly =
    input.periodicity === 'annual'
      ? roundToCents(input.grossSalary / 12)
      : roundToCents(input.grossSalary);

  const { baseSalaryMonthly, transportAllowance } =
    resolveBaseSalaryAndAuxilio(grossMonthly);

  const grossSalaryMonthly = roundToCents(baseSalaryMonthly + transportAllowance);
  const grossAnnual = roundToCents(grossSalaryMonthly * 12);

  const pension = getPensionDeduction(baseSalaryMonthly);
  const health = getHealthDeduction(baseSalaryMonthly);
  const fsp = getFSPDeduction(baseSalaryMonthly);

  const medicinaPrepagada = Math.min(
    input.medicinaPrepagadaMensual ?? 0,
    MEDICINA_PREPAGADA_MAX_UVT * UVT_2026
  );
  const aportesVoluntarios = input.aportesVoluntariosPensionMensual ?? 0;
  const dependents = Math.max(0, Math.floor(input.dependents ?? 0));
  const deduccionDependientes = dependents * DEDUCCION_DEPENDIENTE_UVT * UVT_2026;

  const taxableBaseMonthly = roundToCents(
    baseSalaryMonthly -
      pension -
      health -
      fsp -
      medicinaPrepagada -
      aportesVoluntarios -
      deduccionDependientes
  );
  const retention = calculateRetentionPesos(Math.max(0, taxableBaseMonthly));

  const totalDeductionsMonthly = pension + health + fsp + retention;
  const netPayMonthly = roundToCents(
    baseSalaryMonthly - totalDeductionsMonthly + transportAllowance
  );
  const netPayAnnual = roundToCents(netPayMonthly * 12);

  const totalTaxesAnnual = retention * 12;
  const effectiveTaxRatePercent =
    grossAnnual > 0 ? roundToCents((totalTaxesAnnual / grossAnnual) * 100) : 0;
  const taxableBaseUVT = taxableBaseMonthly / UVT_2026;
  const marginalRate = getMarginalRateForBaseUVT(taxableBaseUVT);
  const marginalTaxRatePercent = roundToCents(marginalRate * 100);

  const deductionLines: DeductionLine[] = [
    {
      labelKey: 'taxes.deductions.baseSalaryContractual',
      label: 'Salario base contractual',
      amount: baseSalaryMonthly,
      isDeduction: false,
      tooltipKey: 'taxes.deductions.baseCotizacionTooltip',
    },
  ];
  if (transportAllowance > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.transport',
      label: 'Auxilio de transporte',
      amount: transportAllowance,
      isDeduction: false,
      tooltipKey: 'taxes.deductions.transportNoDeductions',
    });
    deductionLines.push({
      labelKey: 'taxes.deductions.ingresoTotalDevengado',
      label: 'Ingreso total devengado',
      amount: roundToCents(baseSalaryMonthly + transportAllowance),
      isDeduction: false,
    });
  }
  deductionLines.push({
    labelKey: 'taxes.deductions.baseCotizacion',
    label: 'Base para seguridad social (IBC)',
    amount: baseSalaryMonthly,
    isDeduction: false,
  });
  deductionLines.push(
    {
      labelKey: 'taxes.deductions.pension',
      label: 'Pensión obligatoria',
      amount: -pension,
      isDeduction: true,
    },
    {
      labelKey: 'taxes.deductions.health',
      label: 'Salud (EPS)',
      amount: -health,
      isDeduction: true,
    }
  );
  if (medicinaPrepagada > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.medicinaPrepagada',
      label: 'Medicina prepagada',
      amount: -medicinaPrepagada,
      isDeduction: true,
    });
  }
  if (aportesVoluntarios > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.aportesVoluntarios',
      label: 'Aportes voluntarios a pensión',
      amount: -aportesVoluntarios,
      isDeduction: true,
    });
  }
  if (deduccionDependientes > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.dependientes',
      labelParams: { count: dependents },
      label: `Deducción por ${dependents} dependiente(s)`,
      amount: -deduccionDependientes,
      isDeduction: true,
    });
  }
  if (fsp > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.fsp',
      label: 'Fondo de Solidaridad Pensional',
      amount: -fsp,
      isDeduction: true,
    });
  }
  if (retention > 0) {
    deductionLines.push({
      labelKey: 'taxes.deductions.retention',
      label: 'Retención en la fuente',
      amount: -retention,
      isDeduction: true,
    });
  }

  return {
    baseSalaryMonthly,
    transportAllowance,
    grossSalaryMonthly,
    grossSalaryAnnual: grossAnnual,
    pension,
    health,
    fsp,
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
