# Domain Service Contracts

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Define domain service interfaces (pure functions, no side effects)

---

## Principles

All domain services **MUST**:
1. Be pure functions (deterministic output for given input)
2. Have no side effects (no mutations, no I/O, no state)
3. Have no dependencies on React or UI libraries
4. Be fully unit testable
5. Handle edge cases gracefully (0% interest, extreme values, etc.)
6. Return predictable types (no `null` or `undefined` unless explicitly typed)

---

## 1. Investment Domain Services

### 1.1 Investment Calculation Service

**File**: `src/domain/investment/investment.service.ts`

```typescript
import type { InvestmentInput, InvestmentResult } from '@/types';

/**
 * Calculate complete investment projection
 * 
 * @param input - Investment parameters
 * @returns Calculated investment results including total invested, interest earned, final value, and breakdown
 * 
 * @example
 * const result = calculateInvestmentProjection({
 *   initialAmount: 10000,
 *   monthlyContribution: 500,
 *   durationMonths: 60,
 *   annualInterestRate: 7,
 *   compoundingFrequency: 'monthly'
 * });
 * // result.finalValue => 44274.58
 */
export function calculateInvestmentProjection(
  input: InvestmentInput
): InvestmentResult;
```

### 1.2 Investment Formula Functions

**File**: `src/domain/investment/investment.formulas.ts`

```typescript
import type { CompoundingFrequency } from '@/types';

/**
 * Calculate future value of principal with compound interest
 * 
 * Formula: FV = P × (1 + r/n)^(nt)
 * 
 * @param principal - Initial investment amount
 * @param annualRate - Annual interest rate (percentage, e.g., 7 for 7%)
 * @param compoundingFrequency - How often interest compounds
 * @param durationMonths - Investment duration in months
 * @returns Future value of principal only (no contributions)
 * 
 * @example
 * calculateFutureValuePrincipal(10000, 7, 'monthly', 60)
 * // => 14207.13
 */
export function calculateFutureValuePrincipal(
  principal: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  durationMonths: number
): number;

/**
 * Calculate future value of periodic contributions (annuity)
 * 
 * Formula: FV_annuity = PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 * 
 * @param monthlyContribution - Amount contributed each month
 * @param annualRate - Annual interest rate (percentage)
 * @param compoundingFrequency - How often interest compounds
 * @param durationMonths - Investment duration in months
 * @returns Future value of contributions only
 * 
 * @example
 * calculateFutureValueContributions(500, 7, 'monthly', 60)
 * // => 30067.45
 */
export function calculateFutureValueContributions(
  monthlyContribution: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  durationMonths: number
): number;

/**
 * Generate period-by-period investment breakdown
 * 
 * @param input - Investment parameters
 * @returns Array of investment periods showing growth over time
 * 
 * @example
 * generateInvestmentBreakdown(input)
 * // => [
 * //   { periodNumber: 1, periodLabel: 'Month 1', totalInvested: 10500, interestEarned: 58.33, balance: 10558.33 },
 * //   { periodNumber: 2, periodLabel: 'Month 2', totalInvested: 11000, interestEarned: 117.84, balance: 11117.84 },
 * //   ...
 * // ]
 */
export function generateInvestmentBreakdown(
  input: InvestmentInput
): InvestmentPeriod[];

/**
 * Convert compounding frequency to number of periods per year
 * 
 * @param frequency - Compounding frequency
 * @returns Number of compounding periods per year
 * 
 * @example
 * getCompoundingPeriods('monthly') // => 12
 * getCompoundingPeriods('quarterly') // => 4
 * getCompoundingPeriods('annually') // => 1
 */
export function getCompoundingPeriods(frequency: CompoundingFrequency): number;
```

---

## 2. Debt Domain Services

### 2.1 Amortization Calculation Service

**File**: `src/domain/debt/debt.service.ts`

```typescript
import type { DebtInput, AmortizationSchedule, Prepayment, PrepaymentResult } from '@/types';

/**
 * Calculate base amortization schedule (no prepayments)
 * 
 * @param input - Loan parameters
 * @returns Complete amortization schedule with payment breakdown
 * 
 * @example
 * const schedule = calculateAmortizationSchedule({
 *   loanAmount: 200000,
 *   annualInterestRate: 5,
 *   termMonths: 360,
 *   paymentFrequency: 'monthly'
 * });
 * // schedule.monthlyPayment => 1073.64
 * // schedule.totalInterest => 186511.57
 */
export function calculateAmortizationSchedule(
  input: DebtInput
): AmortizationSchedule;

/**
 * Apply prepayments to amortization schedule and calculate savings
 * 
 * @param input - Original loan parameters
 * @param prepayments - Array of prepayments to apply (chronologically ordered)
 * @returns Comparison of base scenario vs. prepayment scenario with savings
 * 
 * @throws {Error} If prepayment month exceeds loan term
 * @throws {Error} If prepayment amount exceeds remaining balance at that month
 * 
 * @example
 * const result = applyPrepayments(debtInput, [
 *   { monthNumber: 12, amount: 10000, strategy: 'reduce-term' }
 * ]);
 * // result.interestSavings => 15276.68
 * // result.termReduction => 15 (months saved)
 */
export function applyPrepayments(
  input: DebtInput,
  prepayments: Prepayment[]
): PrepaymentResult;
```

### 2.2 Amortization Formula Functions

**File**: `src/domain/debt/amortization.formulas.ts`

```typescript
import type { PaymentFrequency } from '@/types';

/**
 * Calculate fixed monthly payment amount for a loan
 * 
 * Formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
 * 
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (percentage, e.g., 5 for 5%)
 * @param termMonths - Loan term in months
 * @returns Monthly payment amount
 * 
 * @example
 * calculateMonthlyPayment(200000, 5, 360)
 * // => 1073.64
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number;

/**
 * Calculate principal and interest portions of a payment
 * 
 * @param currentBalance - Current outstanding loan balance
 * @param paymentAmount - Total payment amount
 * @param monthlyInterestRate - Monthly interest rate (annual / 12 / 100)
 * @returns Object with principal paid, interest paid, and new balance
 * 
 * @example
 * calculatePaymentBreakdown(200000, 1073.64, 0.004167)
 * // => { principalPaid: 240.31, interestPaid: 833.33, remainingBalance: 199759.69 }
 */
export function calculatePaymentBreakdown(
  currentBalance: number,
  paymentAmount: number,
  monthlyInterestRate: number
): {
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
};

/**
 * Generate complete amortization payment schedule
 * 
 * @param loanAmount - Principal amount
 * @param monthlyPayment - Fixed monthly payment
 * @param monthlyInterestRate - Monthly interest rate
 * @param termMonths - Number of payments
 * @returns Array of payment breakdowns for each month
 */
export function generateAmortizationPayments(
  loanAmount: number,
  monthlyPayment: number,
  monthlyInterestRate: number,
  termMonths: number
): AmortizationPayment[];

/**
 * Convert annual interest rate to monthly rate
 * 
 * @param annualRate - Annual interest rate (percentage)
 * @returns Monthly interest rate (decimal)
 * 
 * @example
 * annualToMonthlyRate(5) // => 0.004167 (approx)
 */
export function annualToMonthlyRate(annualRate: number): number;
```

### 2.3 Prepayment Formula Functions

**File**: `src/domain/debt/prepayment.formulas.ts`

```typescript
import type { 
  AmortizationSchedule, 
  Prepayment, 
  PrepaymentStrategy,
  AmortizationPayment 
} from '@/types';

/**
 * Apply single prepayment with "reduce term" strategy
 * 
 * @param schedule - Current amortization schedule
 * @param prepaymentMonth - Month number when prepayment occurs (1-indexed)
 * @param prepaymentAmount - Amount of prepayment
 * @param annualRate - Annual interest rate
 * @returns Modified schedule with earlier payoff
 * 
 * @example
 * const newSchedule = applyPrepaymentReduceTerm(baseSchedule, 12, 10000, 5);
 * // newSchedule.actualTermMonths => 345 (15 months saved)
 */
export function applyPrepaymentReduceTerm(
  schedule: AmortizationSchedule,
  prepaymentMonth: number,
  prepaymentAmount: number,
  annualRate: number
): AmortizationSchedule;

/**
 * Apply single prepayment with "reduce payment" strategy
 * 
 * @param schedule - Current amortization schedule
 * @param prepaymentMonth - Month number when prepayment occurs (1-indexed)
 * @param prepaymentAmount - Amount of prepayment
 * @param annualRate - Annual interest rate
 * @returns Modified schedule with lower monthly payment
 * 
 * @example
 * const newSchedule = applyPrepaymentReducePayment(baseSchedule, 12, 10000, 5);
 * // newSchedule.monthlyPayment => 1023.54 (lower than original 1073.64)
 */
export function applyPrepaymentReducePayment(
  schedule: AmortizationSchedule,
  prepaymentMonth: number,
  prepaymentAmount: number,
  annualRate: number
): AmortizationSchedule;

/**
 * Calculate interest savings from prepayments
 * 
 * @param baseSchedule - Original schedule without prepayments
 * @param prepaymentSchedule - Schedule with prepayments applied
 * @returns Total interest saved and percentage saved
 * 
 * @example
 * calculateInterestSavings(baseSchedule, prepaymentSchedule)
 * // => { savings: 15276.68, percent: 8.19 }
 */
export function calculateInterestSavings(
  baseSchedule: AmortizationSchedule,
  prepaymentSchedule: AmortizationSchedule
): {
  savings: number;
  percent: number;
};

/**
 * Validate prepayment (check month range and amount vs. balance)
 * 
 * @param prepayment - Prepayment to validate
 * @param schedule - Current amortization schedule
 * @returns Validation result with error message if invalid
 * 
 * @example
 * validatePrepayment(prepayment, schedule)
 * // => { isValid: false, error: 'Prepayment exceeds remaining balance' }
 */
export function validatePrepayment(
  prepayment: Prepayment,
  schedule: AmortizationSchedule
): {
  isValid: boolean;
  error?: string;
};
```

---

## 3. Validation Services

### 3.1 Input Validation Service

**File**: `src/domain/validation/validation.service.ts`

```typescript
import type { InvestmentInput, DebtInput, Prepayment, ValidationErrors } from '@/types';

/**
 * Validate investment input
 * 
 * @param input - Investment input to validate
 * @returns Validation errors (empty object if valid)
 * 
 * @example
 * validateInvestmentInput({ initialAmount: -100, ... })
 * // => { initialAmount: 'Must be a positive number' }
 */
export function validateInvestmentInput(
  input: Partial<InvestmentInput>
): ValidationErrors;

/**
 * Validate debt input
 * 
 * @param input - Debt input to validate
 * @returns Validation errors (empty object if valid)
 */
export function validateDebtInput(
  input: Partial<DebtInput>
): ValidationErrors;

/**
 * Validate prepayment against loan constraints
 * 
 * @param prepayment - Prepayment to validate
 * @param termMonths - Maximum allowed month
 * @param remainingBalance - Optional remaining balance at that month
 * @returns Validation errors (empty object if valid)
 */
export function validatePrepaymentInput(
  prepayment: Partial<Prepayment>,
  termMonths: number,
  remainingBalance?: number
): ValidationErrors;

/**
 * Check if numeric value is within constraints
 * 
 * @param value - Value to check
 * @param constraint - Min/max/step constraints
 * @param fieldName - Field name for error message
 * @returns Error message if invalid, null if valid
 */
export function validateNumericConstraint(
  value: number,
  constraint: NumericConstraint,
  fieldName: string
): string | null;
```

---

## 4. Utility Services

### 4.1 Number Formatting Service

**File**: `src/domain/utils/formatting.service.ts`

```typescript
import type { FormattedValue } from '@/types';

/**
 * Format number as currency (USD)
 * 
 * @param amount - Numeric amount
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(44274.58) // => "$44,274.58"
 * formatCurrency(1234567.89) // => "$1,234,567.89"
 */
export function formatCurrency(amount: number): string;

/**
 * Format number as percentage
 * 
 * @param value - Percentage value (e.g., 7.5 for 7.5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(7.5) // => "7.50%"
 * formatPercentage(0.123, 3) // => "0.123%"
 */
export function formatPercentage(value: number, decimals?: number): string;

/**
 * Format number with thousands separators
 * 
 * @param value - Numeric value
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567.89, 2) // => "1,234,567.89"
 */
export function formatNumber(value: number, decimals?: number): string;

/**
 * Create formatted value object (raw + formatted string)
 * 
 * @param amount - Numeric amount
 * @param formatter - Formatting function
 * @returns Object with raw value and formatted string
 */
export function createFormattedValue(
  amount: number,
  formatter: (value: number) => string
): FormattedValue;
```

### 4.2 Math Utility Service

**File**: `src/domain/utils/math.service.ts`

```typescript
/**
 * Round number to specified decimal places
 * Uses banker's rounding (round half to even)
 * 
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 * 
 * @example
 * roundToDecimals(44274.5849, 2) // => 44274.58
 */
export function roundToDecimals(value: number, decimals: number): number;

/**
 * Round to cents (2 decimal places)
 * 
 * @param amount - Amount to round
 * @returns Amount rounded to cents
 */
export function roundToCents(amount: number): number;

/**
 * Clamp value between min and max
 * 
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number;

/**
 * Check if two numbers are approximately equal (within epsilon)
 * 
 * @param a - First number
 * @param b - Second number
 * @param epsilon - Tolerance (default: 0.01)
 * @returns True if numbers are approximately equal
 */
export function approximatelyEqual(
  a: number,
  b: number,
  epsilon?: number
): boolean;
```

---

## Summary

**Domain services are organized into**:
1. **Investment**: Calculate investment projections with compound interest
2. **Debt**: Calculate amortization schedules and prepayment impacts
3. **Validation**: Validate user inputs against constraints
4. **Utilities**: Format numbers, perform math operations

**All services**:
- Are pure functions (no side effects)
- Have no React dependencies
- Are fully unit testable
- Handle edge cases
- Return predictable types

**Next**: Create component contracts (contracts/components.md).
