/**
 * Common type definitions shared across the application
 */

/**
 * Application theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Navigation menu item
 */
export interface MenuItem {
  /**
   * Display label
   */
  label: string;

  /**
   * Route path
   */
  path: string;

  /**
   * Optional icon component
   */
  icon?: React.ReactNode;

  /**
   * Whether this item is currently active
   */
  isActive?: boolean;
}

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  INVESTMENT: '/investment',
  DEBT: '/debt',
  TAXES: '/taxes',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Validation error for a form field
 */
export interface ValidationError {
  /**
   * Field name that has the error
   */
  field: string;

  /**
   * Error message to display
   */
  message: string;
}

/**
 * Validation errors for a form (keyed by field name)
 */
export type ValidationErrors = Record<string, string>;

/**
 * Generic form state
 */
export interface FormState<T> {
  /**
   * Form values
   */
  values: T;

  /**
   * Validation errors (empty if no errors)
   */
  errors: ValidationErrors;

  /**
   * Whether form has been submitted at least once
   */
  touched: Record<string, boolean>;

  /**
   * Whether form is currently submitting/calculating
   */
  isSubmitting: boolean;

  /**
   * Whether form is valid (no errors)
   */
  isValid: boolean;
}

/**
 * Generic loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Result of an async operation
 */
export interface AsyncResult<T> {
  state: LoadingState;
  data: T | null;
  error: string | null;
}

/**
 * Numeric range constraint
 */
export interface NumericConstraint {
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
}

/**
 * Input constraints for validation
 */
export const INPUT_CONSTRAINTS = {
  initialAmount: { min: 0, max: 1_000_000_000, step: 0.01, decimals: 2 },
  monthlyContribution: { min: 0, step: 0.01, decimals: 2 },
  durationMonths: { min: 1, max: 1200, step: 1, decimals: 0 },
  annualInterestRate: { min: 0, max: 100, step: 0.01, decimals: 2 },
  loanAmount: { min: 0, max: 100_000_000, step: 0.01, decimals: 2 },
  termMonths: { min: 1, max: 600, step: 1, decimals: 0 },
  prepaymentAmount: { min: 0, max: 100_000_000, step: 0.01, decimals: 2 },
  prepaymentMonth: { min: 1, max: 600, step: 1, decimals: 0 },
  grossSalary: { min: 0, max: 1_000_000_000, step: 0.01, decimals: 2 },
  dependents: { min: 0, max: 15, step: 1, decimals: 0 },
  medicinaPrepagada: { min: 0, max: 1_000_000, step: 0.01, decimals: 2 },
  aportesVoluntarios: { min: 0, max: 50_000_000, step: 0.01, decimals: 2 },
} as const;

/**
 * Represents a numeric value with formatted display string
 */
export interface FormattedValue {
  /**
   * Raw numeric value
   */
  raw: number;

  /**
   * Formatted display string
   * @example "$44,274.58" or "7.50%"
   */
  formatted: string;
}

/**
 * Currency amount with formatting
 */
export type CurrencyValue = FormattedValue;

/**
 * Percentage with formatting
 */
export type PercentageValue = FormattedValue;

/**
 * Check if value is a valid ThemeMode
 */
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}
