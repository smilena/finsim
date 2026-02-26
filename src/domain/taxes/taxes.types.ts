/**
 * Tax (salary withholding) domain type definitions
 * Colombia 2026 - Retención en la fuente sobre ingresos laborales
 */

/**
 * Periodicity of the salary amount entered by the user
 */
export type SalaryPeriodicity = 'monthly' | 'annual';

/**
 * User input for tax calculation
 */
export interface TaxInput {
  /**
   * Gross salary amount (in COP)
   * @constraint Positive number
   */
  grossSalary: number;

  /**
   * Whether the amount is per month or per year
   */
  periodicity: SalaryPeriodicity;
}

/**
 * Single deduction or addition line for display
 */
export interface DeductionLine {
  /** Label for the concept */
  label: string;
  /** Translation key for the concept */
  labelKey: string;
  /** Amount (negative for deductions, positive for additions like auxilio) */
  amount: number;
  /** Whether this is a deduction (negative impact) or addition */
  isDeduction: boolean;
}

/**
 * Result of the tax calculation
 */
export interface TaxResult {
  /** Gross salary per month (COP) */
  grossSalaryMonthly: number;
  /** Gross salary per year (COP) */
  grossSalaryAnnual: number;
  /** Pension deduction (4% of base) - monthly */
  pension: number;
  /** Health (EPS) deduction (4% of base) - monthly */
  health: number;
  /** Fondo de Solidaridad Pensional (FSP, si IBC >= 4 SMMLV) - monthly */
  fsp: number;
  /** Transport allowance (if applicable) - monthly, positive */
  transportAllowance: number;
  /** Taxable base for retention (gross - pension - health - fsp, FSP no constitutivo de renta) - monthly */
  taxableBaseMonthly: number;
  /** Income tax withholding (retención en la fuente) - monthly */
  retention: number;
  /** Total deductions from gross (pension + health + fsp + retention), excluding transport - monthly */
  totalDeductionsMonthly: number;
  /** Net pay (take-home) - monthly */
  netPayMonthly: number;
  /** Net pay - annual */
  netPayAnnual: number;
  /** Average tax rate (effective) as percentage e.g. 7.8 */
  effectiveTaxRatePercent: number;
  /** Marginal tax rate as percentage e.g. 18.2 */
  marginalTaxRatePercent: number;
  /** Deduction lines for table display (order: salary, then deductions, then net) */
  deductionLines: DeductionLine[];
  /** Original input */
  input: TaxInput;
}

/**
 * Tax form state
 */
export interface TaxFormState {
  values: TaxInput;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Check if value is a valid SalaryPeriodicity
 */
export function isSalaryPeriodicity(value: unknown): value is SalaryPeriodicity {
  return typeof value === 'string' && ['monthly', 'annual'].includes(value);
}
