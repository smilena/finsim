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
   * Gross salary amount (in COP) - base salary, excludes transport allowance
   * @constraint Positive number
   */
  grossSalary: number;

  /**
   * Whether the amount is per month or per year
   */
  periodicity: SalaryPeriodicity;

  /** Number of dependents (reduces taxable base) - optional, default 0 */
  dependents?: number;

  /** Monthly prepaid health insurance (deductible up to 16 UVT) - optional, default 0 */
  medicinaPrepagadaMensual?: number;

  /** Monthly voluntary pension contributions (deductible) - optional, default 0 */
  aportesVoluntariosPensionMensual?: number;
}

/**
 * Single deduction or addition line for display
 */
export interface DeductionLine {
  /** Label for the concept */
  label: string;
  /** Translation key for the concept */
  labelKey: string;
  /** Optional interpolation params for labelKey (e.g. { count: 2 }) */
  labelParams?: Record<string, number | string>;
  /** Amount (negative for deductions, positive for additions like auxilio) */
  amount: number;
  /** Whether this is a deduction (negative impact) or addition */
  isDeduction: boolean;
  /** Optional tooltip translation key (e.g. for "Auxilio no genera descuentos") */
  tooltipKey?: string;
}

/**
 * Result of the tax calculation
 */
export interface TaxResult {
  /** Base salary per month (COP) - IBC, excludes transport allowance */
  baseSalaryMonthly: number;
  /** Transport allowance per month (COP) - 0 if salary > 2 SMMLV */
  transportAllowance: number;
  /** Gross salary per month (COP) = baseSalary + transportAllowance when applicable */
  grossSalaryMonthly: number;
  /** Gross salary per year (COP) */
  grossSalaryAnnual: number;
  /** Pension deduction (4% of base) - monthly */
  pension: number;
  /** Health (EPS) deduction (4% of base) - monthly */
  health: number;
  /** Fondo de Solidaridad Pensional (FSP, si IBC >= 4 SMMLV) - monthly */
  fsp: number;
  /** Taxable base for retention (baseSalary - pension - health - fsp, FSP no constitutivo de renta) - monthly */
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
