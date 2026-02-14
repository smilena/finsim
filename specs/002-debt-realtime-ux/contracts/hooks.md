# Custom Hooks Contracts: Debt Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Define contract changes for useDebtSimulator and useDebounce

---

## 1. useDebtSimulator (Updated)

**File**: `src/features/debt/useDebtSimulator.ts`

### Changes from 001

| Aspect | 001 | 002 |
|--------|-----|-----|
| Calculation trigger | Explicit `calculate()` call | Automatic on valid inputs + prepayments |
| `calculate` | Exposed in return | **Removed** |
| Input updates | `updateInput` → user must call `calculate` | `updateInput` → debounced auto-recalc |
| Prepayment changes | `addPrepayment`/`removePrepayment` → user must call `calculate` | Triggers **immediate** recalc |

### Contract

```typescript
/**
 * Hook return type for debt simulator (Real-Time UX)
 */
export interface UseDebtSimulatorReturn {
  /**
   * Current loan input values
   */
  inputs: DebtInput;

  /**
   * List of capital payments (abonos a capital)
   */
  prepayments: Prepayment[];

  /**
   * Calculated results (null if not yet calculated or invalid)
   */
  results: PrepaymentResult | null;

  /**
   * Validation errors (keyed by field name)
   */
  errors: ValidationErrors;

  /**
   * Whether calculation is in progress
   */
  isCalculating: boolean;

  /**
   * Update a single input field.
   * Triggers debounced recalculation when inputs become valid.
   */
  updateInput: (field: keyof DebtInput, value: string | number) => void;

  /**
   * Add a capital payment.
   * Triggers immediate recalculation.
   */
  addPrepayment: (prepayment: Prepayment) => void;

  /**
   * Remove a capital payment by index.
   * Triggers immediate recalculation.
   */
  removePrepayment: (index: number) => void;

  /**
   * Reset form to initial state.
   */
  reset: () => void;
}
```

### Behavior

1. **Initial load**: `results` is `null` until inputs are valid.
2. **Input change**: `updateInput` updates state; debounced effect (300–400 ms) runs calculation when valid.
3. **Prepayment add/remove**: Triggers calculation on next render (no debounce).
4. **Validation**: If `validateDebtInput(inputs)` or `validatePrepaymentInput` fails, do not calculate; set `errors`.
5. **Loading**: Set `isCalculating = true` at start of calculation, `false` at end.

---

## 2. useDebounce (New)

**File**: `src/hooks/useDebounce.ts`

### Contract

```typescript
/**
 * Debounce a value. Returns the value only after `delay` ms of no changes.
 *
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds (e.g., 350)
 * @returns Debounced value
 *
 * @example
 * const [loanAmount, setLoanAmount] = useState(200000);
 * const debouncedAmount = useDebounce(loanAmount, 350);
 *
 * useEffect(() => {
 *   if (isValid(debouncedAmount)) runCalculation(debouncedAmount);
 * }, [debouncedAmount]);
 */
export function useDebounce<T>(value: T, delay: number): T;
```

### Dependencies

- Uses `useState` and `useEffect`
- No external library (lodash, etc.)
