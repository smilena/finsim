# Data Model: Financial Projections and Debt Simulation

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Define TypeScript types and interfaces for all entities

---

## 1. Investment Domain

### 1.1 Investment Input

Represents user input for investment projection calculation.

```typescript
/**
 * User input for investment profitability projection
 */
export interface InvestmentInput {
  /**
   * Initial investment amount in dollars
   * @constraint Positive number, max 1,000,000,000
   * @example 10000
   */
  initialAmount: number;

  /**
   * Monthly contribution amount in dollars
   * @constraint Non-negative number, max 1,000,000
   * @example 500
   */
  monthlyContribution: number;

  /**
   * Investment duration in months
   * @constraint Positive integer, max 1200 (100 years)
   * @example 60 (5 years)
   */
  durationMonths: number;

  /**
   * Annual interest rate as percentage
   * @constraint Non-negative number, max 100
   * @example 7.5 (for 7.5% annual rate)
   */
  annualInterestRate: number;

  /**
   * How often interest compounds per year
   */
  compoundingFrequency: CompoundingFrequency;
}

/**
 * Frequency of interest compounding
 */
export type CompoundingFrequency = 'monthly' | 'quarterly' | 'annually';

/**
 * Numeric representation of compounding frequency
 * Used in financial formulas
 */
export const COMPOUNDING_PERIODS: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annually: 1,
};
```

### 1.2 Investment Result

Represents calculated results from investment projection.

```typescript
/**
 * Calculated investment projection results
 */
export interface InvestmentResult {
  /**
   * Total amount invested (initial + all contributions)
   */
  totalInvested: number;

  /**
   * Total interest earned over investment period
   */
  totalInterestEarned: number;

  /**
   * Final value of investment (totalInvested + totalInterestEarned)
   */
  finalValue: number;

  /**
   * Period-by-period breakdown of investment growth
   */
  breakdown: InvestmentPeriod[];

  /**
   * Input parameters used for this calculation
   * (Useful for displaying alongside results)
   */
  input: InvestmentInput;
}

/**
 * Represents investment state at end of a specific period
 */
export interface InvestmentPeriod {
  /**
   * Period number (1-indexed)
   * @example 1, 2, 3, ..., 60
   */
  periodNumber: number;

  /**
   * Period end date representation
   * For monthly: "Month 1", "Month 2", etc.
   * For yearly: "Year 1", "Year 2", etc.
   */
  periodLabel: string;

  /**
   * Cumulative amount invested up to this period
   * (initial + contributions up to this point)
   */
  totalInvested: number;

  /**
   * Cumulative interest earned up to this period
   */
  interestEarned: number;

  /**
   * Total balance at end of this period
   * (totalInvested + interestEarned)
   */
  balance: number;
}
```

---

## 2. Debt Domain

### 2.1 Debt Input

Represents user input for debt/loan calculation.

```typescript
/**
 * User input for loan amortization calculation
 */
export interface DebtInput {
  /**
   * Principal loan amount in dollars
   * @constraint Positive number, max 100,000,000
   * @example 200000
   */
  loanAmount: number;

  /**
   * Annual interest rate as percentage
   * @constraint Non-negative number, max 100
   * @example 5.5 (for 5.5% annual rate)
   */
  annualInterestRate: number;

  /**
   * Loan term in months
   * @constraint Positive integer, max 600 (50 years)
   * @example 360 (30 years)
   */
  termMonths: number;

  /**
   * How often payments are made
   */
  paymentFrequency: PaymentFrequency;
}

/**
 * Frequency of loan payments
 */
export type PaymentFrequency = 'monthly' | 'bi-weekly';

/**
 * Number of payments per year
 */
export const PAYMENT_PERIODS: Record<PaymentFrequency, number> = {
  monthly: 12,
  'bi-weekly': 26,
};
```

### 2.2 Amortization Schedule

Represents calculated loan amortization schedule.

```typescript
/**
 * Complete amortization schedule for a loan
 */
export interface AmortizationSchedule {
  /**
   * Fixed payment amount per period
   */
  monthlyPayment: number;

  /**
   * Total principal paid over life of loan
   * (Should equal original loan amount)
   */
  totalPrincipal: number;

  /**
   * Total interest paid over life of loan
   */
  totalInterest: number;

  /**
   * Total amount paid (principal + interest)
   */
  totalPaid: number;

  /**
   * Actual term (number of payments)
   * Usually equals input termMonths, but may differ if prepayments applied
   */
  actualTermMonths: number;

  /**
   * Payment-by-payment breakdown
   */
  schedule: AmortizationPayment[];

  /**
   * Input parameters used for this calculation
   */
  input: DebtInput;
}

/**
 * Represents a single payment in the amortization schedule
 */
export interface AmortizationPayment {
  /**
   * Payment number (1-indexed)
   * @example 1, 2, 3, ..., 360
   */
  paymentNumber: number;

  /**
   * Payment date representation
   * @example "Month 1", "Month 2", etc.
   */
  paymentLabel: string;

  /**
   * Total payment amount for this period
   * (Usually fixed, may vary for final payment)
   */
  paymentAmount: number;

  /**
   * Portion of payment applied to principal
   */
  principalPaid: number;

  /**
   * Portion of payment applied to interest
   */
  interestPaid: number;

  /**
   * Remaining loan balance after this payment
   */
  remainingBalance: number;
}
```

### 2.3 Prepayment

Represents an extra payment toward loan principal.

```typescript
/**
 * Represents a capital prepayment (extra payment toward principal)
 */
export interface Prepayment {
  /**
   * Month number when prepayment occurs (1-indexed)
   * @constraint Must be between 1 and termMonths
   * @constraint Must not exceed actual loan term
   * @example 12 (prepayment in month 12)
   */
  monthNumber: number;

  /**
   * Prepayment amount in dollars
   * @constraint Positive number
   * @constraint Must not exceed remaining balance at that month
   * @example 10000
   */
  amount: number;

  /**
   * Strategy for applying prepayment
   */
  strategy: PrepaymentStrategy;
}

/**
 * How prepayment affects the loan
 */
export type PrepaymentStrategy = 'reduce-payment' | 'reduce-term';

/**
 * Display labels for prepayment strategies
 */
export const PREPAYMENT_STRATEGY_LABELS: Record<PrepaymentStrategy, string> = {
  'reduce-payment': 'Reduce Monthly Payment',
  'reduce-term': 'Reduce Loan Term',
};
```

### 2.4 Prepayment Result

Represents comparison between base scenario and scenario with prepayments.

```typescript
/**
 * Comparison of loan scenarios with and without prepayments
 */
export interface PrepaymentResult {
  /**
   * Original amortization schedule without prepayments
   */
  baseScenario: AmortizationSchedule;

  /**
   * Modified amortization schedule with prepayments applied
   */
  prepaymentScenario: AmortizationSchedule;

  /**
   * List of prepayments applied
   */
  prepayments: Prepayment[];

  /**
   * Total interest saved by making prepayments
   * (base total interest - prepayment total interest)
   */
  interestSavings: number;

  /**
   * Percentage of interest saved
   * (interestSavings / base total interest * 100)
   */
  interestSavingsPercent: number;

  /**
   * Months saved (only if reduce-term strategy used)
   * (base term - prepayment term)
   */
  termReduction: number | null;

  /**
   * New monthly payment amount (only if reduce-payment strategy used)
   */
  newMonthlyPayment: number | null;
}

/**
 * Summary statistics for quick comparison
 */
export interface PrepaymentSummary {
  baseMonthlyPayment: number;
  baseTermMonths: number;
  baseTotalInterest: number;
  baseTotalPaid: number;

  prepaymentMonthlyPayment: number;
  prepaymentTermMonths: number;
  prepaymentTotalInterest: number;
  prepaymentTotalPaid: number;

  totalSavings: number; // Interest + any reduced payments
}
```

---

## 3. Theme & UI State

### 3.1 Theme Preference

```typescript
/**
 * Application theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme preference persisted to localStorage
 */
export interface ThemePreference {
  /**
   * Current theme mode
   */
  mode: ThemeMode;
}

/**
 * localStorage key for theme preference
 */
export const THEME_STORAGE_KEY = 'finanzas-theme-mode';
```

### 3.2 Navigation State

```typescript
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
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
```

---

## 4. Form & Validation State

### 4.1 Validation Error

```typescript
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
```

### 4.2 Form State

```typescript
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
 * Investment form state
 */
export type InvestmentFormState = FormState<InvestmentInput>;

/**
 * Debt form state
 */
export type DebtFormState = FormState<DebtInput>;
```

---

## 5. Common Utility Types

### 5.1 Loading State

```typescript
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
```

### 5.2 Range Constraints

```typescript
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
  monthlyContribution: { min: 0, max: 1_000_000, step: 0.01, decimals: 2 },
  durationMonths: { min: 1, max: 1200, step: 1, decimals: 0 },
  annualInterestRate: { min: 0, max: 100, step: 0.01, decimals: 2 },
  loanAmount: { min: 0, max: 100_000_000, step: 0.01, decimals: 2 },
  termMonths: { min: 1, max: 600, step: 1, decimals: 0 },
  prepaymentAmount: { min: 0, max: 100_000_000, step: 0.01, decimals: 2 },
  prepaymentMonth: { min: 1, max: 600, step: 1, decimals: 0 },
} as const;
```

---

## 6. Display Formatting Types

### 6.1 Formatted Values

```typescript
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
```

### 6.2 Chart Data (Optional, for future enhancement)

```typescript
/**
 * Data point for charts/visualizations
 */
export interface ChartDataPoint {
  /**
   * X-axis value (period number or date)
   */
  x: number | string;

  /**
   * Y-axis value
   */
  y: number;

  /**
   * Optional label
   */
  label?: string;
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  /**
   * Dataset label
   */
  label: string;

  /**
   * Data points
   */
  data: ChartDataPoint[];

  /**
   * Color for this dataset
   */
  color?: string;
}
```

---

## 7. Type Guards & Utilities

### 7.1 Type Guards

```typescript
/**
 * Check if value is a valid CompoundingFrequency
 */
export function isCompoundingFrequency(value: unknown): value is CompoundingFrequency {
  return typeof value === 'string' && ['monthly', 'quarterly', 'annually'].includes(value);
}

/**
 * Check if value is a valid PaymentFrequency
 */
export function isPaymentFrequency(value: unknown): value is PaymentFrequency {
  return typeof value === 'string' && ['monthly', 'bi-weekly'].includes(value);
}

/**
 * Check if value is a valid PrepaymentStrategy
 */
export function isPrepaymentStrategy(value: unknown): value is PrepaymentStrategy {
  return typeof value === 'string' && ['reduce-payment', 'reduce-term'].includes(value);
}

/**
 * Check if value is a valid ThemeMode
 */
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}
```

### 7.2 Type Converters

```typescript
/**
 * Convert years to months
 */
export function yearsToMonths(years: number): number {
  return Math.round(years * 12);
}

/**
 * Convert months to years (rounded to 2 decimals)
 */
export function monthsToYears(months: number): number {
  return Math.round((months / 12) * 100) / 100;
}

/**
 * Convert percentage to decimal (7.5% → 0.075)
 */
export function percentToDecimal(percent: number): number {
  return percent / 100;
}

/**
 * Convert decimal to percentage (0.075 → 7.5%)
 */
export function decimalToPercent(decimal: number): number {
  return decimal * 100;
}
```

---

## 8. Entity Relationships

```
InvestmentInput
    ↓
[Investment Service]
    ↓
InvestmentResult
    ├── totalInvested
    ├── totalInterestEarned
    ├── finalValue
    └── breakdown: InvestmentPeriod[]

---

DebtInput
    ↓
[Debt Service]
    ↓
AmortizationSchedule
    ├── monthlyPayment
    ├── totalInterest
    └── schedule: AmortizationPayment[]

AmortizationSchedule + Prepayment[]
    ↓
[Prepayment Service]
    ↓
PrepaymentResult
    ├── baseScenario: AmortizationSchedule
    ├── prepaymentScenario: AmortizationSchedule
    ├── interestSavings
    └── termReduction / newMonthlyPayment
```

---

## 9. Example Instances

### Example 1: Investment Projection

```typescript
const exampleInvestmentInput: InvestmentInput = {
  initialAmount: 10000,
  monthlyContribution: 500,
  durationMonths: 60,
  annualInterestRate: 7,
  compoundingFrequency: 'monthly',
};

const exampleInvestmentResult: InvestmentResult = {
  totalInvested: 40000, // 10000 + 500 * 60
  totalInterestEarned: 4274.58,
  finalValue: 44274.58,
  breakdown: [
    {
      periodNumber: 12,
      periodLabel: 'Year 1',
      totalInvested: 16000,
      interestEarned: 612.35,
      balance: 16612.35,
    },
    // ... more periods
  ],
  input: exampleInvestmentInput,
};
```

### Example 2: Debt with Prepayment

```typescript
const exampleDebtInput: DebtInput = {
  loanAmount: 200000,
  annualInterestRate: 5,
  termMonths: 360,
  paymentFrequency: 'monthly',
};

const examplePrepayment: Prepayment = {
  monthNumber: 12,
  amount: 10000,
  strategy: 'reduce-term',
};

const examplePrepaymentResult: PrepaymentResult = {
  baseScenario: {
    monthlyPayment: 1073.64,
    totalPrincipal: 200000,
    totalInterest: 186511.57,
    totalPaid: 386511.57,
    actualTermMonths: 360,
    schedule: [/* ... */],
    input: exampleDebtInput,
  },
  prepaymentScenario: {
    monthlyPayment: 1073.64,
    totalPrincipal: 200000,
    totalInterest: 171234.89, // Less interest due to prepayment
    totalPaid: 381234.89,
    actualTermMonths: 345, // 15 months saved
    schedule: [/* ... */],
    input: exampleDebtInput,
  },
  prepayments: [examplePrepayment],
  interestSavings: 15276.68,
  interestSavingsPercent: 8.19,
  termReduction: 15,
  newMonthlyPayment: null, // reduce-term strategy
};
```

---

## Summary

**All entities are defined with**:
- Strong TypeScript typing (no `any`, interfaces with clear constraints)
- JSDoc comments for documentation
- Validation constraints documented
- Examples provided
- Type guards and utility functions for safety

**Next Step**: Create service contracts (contracts/domain.md, contracts/components.md, contracts/hooks.md).
