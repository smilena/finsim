# Custom Hooks Contracts

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Define custom React hooks interfaces and behavior

---

## Hook Design Principles

All custom hooks **MUST**:
1. Follow React hooks rules (prefix with `use`, can only be called in function components or other hooks)
2. Have strongly typed return values (no `any`)
3. Be testable with `@testing-library/react-hooks`
4. Have clear, single responsibility
5. Document behavior and side effects
6. Handle edge cases and errors gracefully

---

## 1. Investment Feature Hooks

### 1.1 useInvestmentSimulator

**File**: `src/features/investment/useInvestmentSimulator.ts`

Hook to orchestrate investment calculation flow.

```typescript
/**
 * Hook return type for investment simulator
 */
export interface UseInvestmentSimulatorReturn {
  /**
   * Current investment input values
   * Null if not yet calculated
   */
  input: InvestmentInput | null;

  /**
   * Calculated investment result
   * Null if not yet calculated or calculation failed
   */
  result: InvestmentResult | null;

  /**
   * Validation errors (keyed by field name)
   * Empty object if no errors
   */
  errors: ValidationErrors;

  /**
   * Whether calculation is in progress
   */
  isCalculating: boolean;

  /**
   * Calculate investment projection
   * Validates input, calls domain service, updates state
   * 
   * @param input - Investment parameters
   */
  calculate: (input: InvestmentInput) => void;

  /**
   * Reset all state (clear input, result, errors)
   */
  reset: () => void;

  /**
   * Whether form is valid (no errors)
   */
  isValid: boolean;
}

/**
 * Hook to manage investment calculation state and logic
 * 
 * Responsibilities:
 * - Validate investment input
 * - Call investment domain service
 * - Manage calculation state (loading, result, errors)
 * - Provide reset functionality
 * 
 * Side effects:
 * - None (synchronous calculation)
 * 
 * @example
 * const { input, result, errors, calculate, reset } = useInvestmentSimulator();
 * 
 * // Calculate
 * calculate({
 *   initialAmount: 10000,
 *   monthlyContribution: 500,
 *   durationMonths: 60,
 *   annualInterestRate: 7,
 *   compoundingFrequency: 'monthly'
 * });
 * 
 * // result is now populated
 * console.log(result.finalValue); // 44274.58
 */
export function useInvestmentSimulator(): UseInvestmentSimulatorReturn;
```

---

## 2. Debt Feature Hooks

### 2.1 useDebtSimulator

**File**: `src/features/debt/useDebtSimulator.ts`

Hook to orchestrate debt calculation with prepayments.

```typescript
/**
 * Hook return type for debt simulator
 */
export interface UseDebtSimulatorReturn {
  /**
   * Current debt input values
   * Null if not yet calculated
   */
  debtInput: DebtInput | null;

  /**
   * List of prepayments
   */
  prepayments: Prepayment[];

  /**
   * Calculated result
   * - If no prepayments: AmortizationSchedule (base scenario)
   * - If prepayments exist: PrepaymentResult (comparison)
   */
  result: AmortizationSchedule | PrepaymentResult | null;

  /**
   * Validation errors for debt input (keyed by field name)
   */
  errors: ValidationErrors;

  /**
   * Validation errors for prepayments (keyed by prepayment index)
   */
  prepaymentErrors: Record<number, ValidationErrors>;

  /**
   * Whether calculation is in progress
   */
  isCalculating: boolean;

  /**
   * Calculate base amortization schedule
   * Clears any existing prepayments and recalculates
   * 
   * @param input - Debt parameters
   */
  calculateBase: (input: DebtInput) => void;

  /**
   * Add a prepayment and recalculate
   * Validates prepayment before adding
   * 
   * @param prepayment - Prepayment to add
   * @returns True if added successfully, false if validation failed
   */
  addPrepayment: (prepayment: Prepayment) => boolean;

  /**
   * Remove a prepayment by index and recalculate
   * 
   * @param index - Index of prepayment to remove
   */
  removePrepayment: (index: number) => void;

  /**
   * Recalculate with current prepayments
   * Useful after changing prepayment strategy
   */
  recalculate: () => void;

  /**
   * Reset all state (clear input, prepayments, result, errors)
   */
  reset: () => void;

  /**
   * Whether form is valid (no errors)
   */
  isValid: boolean;
}

/**
 * Hook to manage debt calculation state and prepayments
 * 
 * Responsibilities:
 * - Validate debt input and prepayments
 * - Call debt domain services
 * - Manage prepayments list
 * - Recalculate when prepayments change
 * - Manage calculation state (loading, result, errors)
 * 
 * Side effects:
 * - Recalculates automatically when prepayments change
 * 
 * @example
 * const {
 *   debtInput,
 *   prepayments,
 *   result,
 *   calculateBase,
 *   addPrepayment,
 *   removePrepayment
 * } = useDebtSimulator();
 * 
 * // Calculate base scenario
 * calculateBase({
 *   loanAmount: 200000,
 *   annualInterestRate: 5,
 *   termMonths: 360,
 *   paymentFrequency: 'monthly'
 * });
 * 
 * // Add prepayment
 * addPrepayment({
 *   monthNumber: 12,
 *   amount: 10000,
 *   strategy: 'reduce-term'
 * });
 * 
 * // result is now PrepaymentResult with comparison
 * console.log(result.interestSavings); // 15276.68
 */
export function useDebtSimulator(): UseDebtSimulatorReturn;
```

---

## 3. Theme Hooks

### 3.1 useThemeMode

**File**: `src/hooks/useThemeMode.ts`

Hook to manage theme mode (light/dark) with localStorage persistence.

```typescript
/**
 * Hook return type for theme mode
 */
export interface UseThemeModeReturn {
  /**
   * Current theme mode
   */
  mode: ThemeMode;

  /**
   * Toggle between light and dark mode
   */
  toggleTheme: () => void;

  /**
   * Set theme mode explicitly
   * 
   * @param mode - Theme mode to set
   */
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Hook to manage theme mode with localStorage persistence
 * 
 * Responsibilities:
 * - Read theme preference from localStorage on mount
 * - Persist theme preference to localStorage on change
 * - Provide toggle and set functions
 * 
 * Side effects:
 * - Reads from localStorage on mount
 * - Writes to localStorage on theme change
 * 
 * localStorage key: 'finanzas-theme-mode'
 * 
 * @example
 * const { mode, toggleTheme, setTheme } = useThemeMode();
 * 
 * // Toggle theme
 * <button onClick={toggleTheme}>Toggle Theme</button>
 * 
 * // Set theme explicitly
 * setTheme('dark');
 */
export function useThemeMode(): UseThemeModeReturn;
```

---

## 4. UI Interaction Hooks

### 4.1 useResponsiveMenu

**File**: `src/hooks/useResponsiveMenu.ts`

Hook to manage responsive menu state (open/closed on mobile).

```typescript
/**
 * Hook return type for responsive menu
 */
export interface UseResponsiveMenuReturn {
  /**
   * Whether device is mobile (< md breakpoint)
   */
  isMobile: boolean;

  /**
   * Whether mobile menu is open
   */
  isOpen: boolean;

  /**
   * Open mobile menu
   */
  openMenu: () => void;

  /**
   * Close mobile menu
   */
  closeMenu: () => void;

  /**
   * Toggle mobile menu
   */
  toggleMenu: () => void;
}

/**
 * Hook to manage responsive menu state
 * 
 * Responsibilities:
 * - Detect mobile viewport using MUI breakpoints
 * - Manage menu open/closed state
 * - Provide open/close/toggle functions
 * - Auto-close menu when switching to desktop
 * 
 * Side effects:
 * - Uses useMediaQuery to detect viewport size
 * - Auto-closes menu when viewport becomes desktop size
 * 
 * @example
 * const { isMobile, isOpen, toggleMenu, closeMenu } = useResponsiveMenu();
 * 
 * // Toggle menu on mobile
 * {isMobile && (
 *   <>
 *     <IconButton onClick={toggleMenu}>
 *       <MenuIcon />
 *     </IconButton>
 *     <Drawer open={isOpen} onClose={closeMenu}>
 *       {/* Menu items *\/}
 *     </Drawer>
 *   </>
 * )}
 */
export function useResponsiveMenu(): UseResponsiveMenuReturn;
```

---

### 4.2 useFormValidation

**File**: `src/hooks/useFormValidation.ts`

Generic hook for form validation (reusable across features).

```typescript
/**
 * Validation function type
 */
export type ValidationFunction<T> = (values: T) => ValidationErrors;

/**
 * Hook return type for form validation
 */
export interface UseFormValidationReturn<T> {
  /**
   * Current form values
   */
  values: T;

  /**
   * Validation errors (keyed by field name)
   */
  errors: ValidationErrors;

  /**
   * Fields that have been touched (keyed by field name)
   */
  touched: Record<string, boolean>;

  /**
   * Whether form is valid (no errors)
   */
  isValid: boolean;

  /**
   * Update a single field value
   * 
   * @param field - Field name
   * @param value - New value
   */
  setFieldValue: (field: keyof T, value: any) => void;

  /**
   * Mark a field as touched
   * 
   * @param field - Field name
   */
  setFieldTouched: (field: keyof T) => void;

  /**
   * Validate all fields
   * Returns true if valid, false if errors exist
   */
  validate: () => boolean;

  /**
   * Reset form to initial values
   */
  reset: () => void;
}

/**
 * Generic form validation hook
 * 
 * Responsibilities:
 * - Manage form values state
 * - Track which fields have been touched
 * - Run validation on values change
 * - Provide field update functions
 * 
 * @param initialValues - Initial form values
 * @param validationFn - Function to validate form values
 * 
 * @example
 * const { values, errors, setFieldValue, validate } = useFormValidation(
 *   { initialAmount: 0, monthlyContribution: 0 },
 *   validateInvestmentInput
 * );
 * 
 * // Update field
 * setFieldValue('initialAmount', 10000);
 * 
 * // Validate before submit
 * if (validate()) {
 *   onSubmit(values);
 * }
 */
export function useFormValidation<T>(
  initialValues: T,
  validationFn: ValidationFunction<T>
): UseFormValidationReturn<T>;
```

---

### 4.3 useLocalStorage

**File**: `src/hooks/useLocalStorage.ts`

Hook for managing localStorage state (generic, reusable).

```typescript
/**
 * Hook return type for localStorage
 */
export interface UseLocalStorageReturn<T> {
  /**
   * Current stored value
   */
  value: T;

  /**
   * Update stored value
   * 
   * @param newValue - New value to store
   */
  setValue: (newValue: T) => void;

  /**
   * Remove value from storage
   */
  removeValue: () => void;
}

/**
 * Generic hook for localStorage state management
 * 
 * Responsibilities:
 * - Read value from localStorage on mount
 * - Sync value to localStorage on change
 * - Handle JSON serialization/deserialization
 * - Handle errors gracefully (e.g., quota exceeded)
 * 
 * Side effects:
 * - Reads from localStorage on mount
 * - Writes to localStorage on value change
 * 
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * 
 * @example
 * const { value, setValue } = useLocalStorage<ThemeMode>('theme-mode', 'light');
 * 
 * // Update value (automatically syncs to localStorage)
 * setValue('dark');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T>;
```

---

## 5. Utility Hooks

### 5.1 useDebounce

**File**: `src/hooks/useDebounce.ts`

Hook to debounce a value (useful for expensive calculations).

```typescript
/**
 * Debounce a value
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * // debouncedSearchTerm only updates 500ms after user stops typing
 * useEffect(() => {
 *   // Perform search with debouncedSearchTerm
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number): T;
```

---

### 5.2 usePrevious

**File**: `src/hooks/usePrevious.ts`

Hook to get previous value of a state/prop.

```typescript
/**
 * Get previous value of a state or prop
 * 
 * @param value - Current value
 * @returns Previous value (from last render)
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * // prevCount is the value of count from the previous render
 * console.log(`Count changed from ${prevCount} to ${count}`);
 */
export function usePrevious<T>(value: T): T | undefined;
```

---

## 6. Hook Dependencies & Relationships

```
useInvestmentSimulator
    ├── uses: useState (form state, result state)
    ├── uses: validateInvestmentInput (validation service)
    └── uses: calculateInvestmentProjection (domain service)

useDebtSimulator
    ├── uses: useState (form state, prepayments, result state)
    ├── uses: useEffect (recalculate on prepayment changes)
    ├── uses: validateDebtInput (validation service)
    ├── uses: calculateAmortizationSchedule (domain service)
    └── uses: applyPrepayments (domain service)

useThemeMode
    ├── uses: useLocalStorage (persist theme)
    └── uses: useState (theme state)

useResponsiveMenu
    ├── uses: useMediaQuery (detect mobile)
    ├── uses: useState (menu open state)
    └── uses: useEffect (auto-close on desktop)

useFormValidation
    ├── uses: useState (values, errors, touched)
    └── uses: useEffect (validate on values change)

useLocalStorage
    ├── uses: useState (stored value)
    └── uses: useEffect (sync to localStorage)

useDebounce
    ├── uses: useState (debounced value)
    └── uses: useEffect (debounce timer)

usePrevious
    └── uses: useRef (store previous value)
```

---

## 7. Testing Examples

### Example: Testing useInvestmentSimulator

```typescript
// tests/unit/hooks/useInvestmentSimulator.test.ts
import { renderHook, act } from '@testing-library/react';
import { useInvestmentSimulator } from '@/features/investment/useInvestmentSimulator';

describe('useInvestmentSimulator', () => {
  it('calculates investment projection correctly', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.calculate({
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7,
        compoundingFrequency: 'monthly'
      });
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.finalValue).toBeCloseTo(44274.58, 2);
    expect(result.current.errors).toEqual({});
  });

  it('validates input and shows errors', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.calculate({
        initialAmount: -100, // Invalid: negative
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7,
        compoundingFrequency: 'monthly'
      });
    });

    expect(result.current.result).toBeNull();
    expect(result.current.errors).toHaveProperty('initialAmount');
    expect(result.current.isValid).toBe(false);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useInvestmentSimulator());

    act(() => {
      result.current.calculate({
        initialAmount: 10000,
        monthlyContribution: 500,
        durationMonths: 60,
        annualInterestRate: 7,
        compoundingFrequency: 'monthly'
      });
    });

    expect(result.current.result).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.input).toBeNull();
    expect(result.current.errors).toEqual({});
  });
});
```

---

## Summary

**Custom hooks provide**:
1. **Investment Calculation**: State management and validation for investment simulator
2. **Debt Calculation**: State management and prepayment handling for debt simulator
3. **Theme Management**: Theme mode switching with localStorage persistence
4. **UI Interactions**: Responsive menu, form validation, localStorage
5. **Utilities**: Debounce, previous value tracking

**All hooks**:
- Have strongly typed return values
- Are documented with JSDoc and examples
- Are testable with React Testing Library
- Handle errors gracefully
- Follow React hooks best practices

**Next**: Create quickstart.md (development setup guide).
