# Component Contracts

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Define React component interfaces (props, behavior, accessibility)

---

## Component Design Principles

All components **MUST**:
1. Use TypeScript with strong typing (no `any`)
2. Be accessible (WCAG AA compliant)
3. Be responsive (mobile-first)
4. Support theme (light/dark)
5. Have clear, single responsibility
6. Document props with JSDoc
7. Export props interface separately for testing

---

## 1. Layout Components

### 1.1 AppLayout

**File**: `src/components/layout/AppLayout.tsx`

Main layout wrapper for all pages.

```typescript
export interface AppLayoutProps {
  /**
   * Page content
   */
  children: React.ReactNode;
}

/**
 * Main application layout
 * - Includes header with navigation and theme toggle
 * - Responsive container
 * - Consistent spacing and max-width
 * 
 * @example
 * <AppLayout>
 *   <YourPageContent />
 * </AppLayout>
 */
export function AppLayout(props: AppLayoutProps): JSX.Element;
```

---

### 1.2 AppHeader

**File**: `src/components/layout/AppHeader.tsx`

Top navigation bar with logo, menu, and theme toggle.

```typescript
export interface AppHeaderProps {
  /**
   * Current theme mode
   */
  currentTheme: ThemeMode;

  /**
   * Callback when theme toggle clicked
   */
  onThemeToggle: () => void;

  /**
   * Whether mobile menu is open
   */
  mobileMenuOpen: boolean;

  /**
   * Callback to toggle mobile menu
   */
  onMobileMenuToggle: () => void;
}

/**
 * Application header with navigation and theme toggle
 * - Desktop: horizontal navigation bar
 * - Mobile: hamburger menu button
 * - Theme toggle button (always visible)
 * 
 * Accessibility:
 * - Navigation landmark with aria-label
 * - Theme toggle with descriptive aria-label
 * - Mobile menu button with aria-expanded
 * 
 * @example
 * <AppHeader
 *   currentTheme="light"
 *   onThemeToggle={handleToggle}
 *   mobileMenuOpen={false}
 *   onMobileMenuToggle={handleMenuToggle}
 * />
 */
export function AppHeader(props: AppHeaderProps): JSX.Element;
```

---

### 1.3 AppMenu

**File**: `src/components/layout/AppMenu.tsx`

Navigation menu (desktop horizontal, mobile drawer).

```typescript
export interface AppMenuProps {
  /**
   * Navigation menu items
   */
  items: MenuItem[];

  /**
   * Current active path
   */
  currentPath: string;

  /**
   * Whether mobile menu is open (only applies on mobile)
   */
  isOpen: boolean;

  /**
   * Callback to close mobile menu
   */
  onClose: () => void;
}

/**
 * Responsive navigation menu
 * - Desktop (>= md breakpoint): Horizontal menu in AppBar
 * - Mobile (< md breakpoint): Drawer sidebar
 * 
 * Accessibility:
 * - Nav element with proper ARIA landmarks
 * - Links with aria-current for active page
 * - Drawer with proper focus management
 * 
 * @example
 * <AppMenu
 *   items={[
 *     { label: 'Home', path: '/', icon: <HomeIcon /> },
 *     { label: 'Investment', path: '/investment', icon: <TrendingUpIcon /> },
 *   ]}
 *   currentPath="/investment"
 *   isOpen={mobileMenuOpen}
 *   onClose={closeMobileMenu}
 * />
 */
export function AppMenu(props: AppMenuProps): JSX.Element;
```

---

## 2. Common Components

### 2.1 NumberInput

**File**: `src/components/common/NumberInput.tsx`

Reusable number input with validation and formatting.

```typescript
export interface NumberInputProps {
  /**
   * Input label
   */
  label: string;

  /**
   * Current value (empty string if no value)
   */
  value: number | '';

  /**
   * Callback when value changes
   * Receives parsed number or empty string
   */
  onChange: (value: number | '') => void;

  /**
   * Minimum allowed value
   */
  min?: number;

  /**
   * Maximum allowed value
   */
  max?: number;

  /**
   * Step increment
   * @default 0.01
   */
  step?: number;

  /**
   * Number of decimal places
   * @default 2
   */
  decimals?: number;

  /**
   * Prefix to display (e.g., "$")
   */
  prefix?: string;

  /**
   * Suffix to display (e.g., "%")
   */
  suffix?: string;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Whether input has error
   */
  error?: boolean;

  /**
   * Whether input is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Number input with validation and formatting
 * - Supports prefix/suffix (currency symbols, percentage signs)
 * - Validates min/max/decimals
 * - Shows error state with helper text
 * - Accessible with proper labels and ARIA
 * 
 * @example
 * <NumberInput
 *   label="Initial Investment"
 *   value={amount}
 *   onChange={setAmount}
 *   min={0}
 *   max={1000000}
 *   prefix="$"
 *   decimals={2}
 *   required
 * />
 */
export function NumberInput(props: NumberInputProps): JSX.Element;
```

---

### 2.2 SelectField

**File**: `src/components/common/SelectField.tsx`

Reusable select dropdown.

```typescript
export interface SelectOption {
  /**
   * Option value
   */
  value: string;

  /**
   * Option label to display
   */
  label: string;
}

export interface SelectFieldProps {
  /**
   * Input label
   */
  label: string;

  /**
   * Current selected value
   */
  value: string;

  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;

  /**
   * Available options
   */
  options: SelectOption[];

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Whether field has error
   */
  error?: boolean;

  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether field is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * Select dropdown field
 * - Material UI Select component
 * - Proper label association
 * - Accessible with keyboard navigation
 * 
 * @example
 * <SelectField
 *   label="Compounding Frequency"
 *   value={frequency}
 *   onChange={setFrequency}
 *   options={[
 *     { value: 'monthly', label: 'Monthly' },
 *     { value: 'quarterly', label: 'Quarterly' },
 *   ]}
 * />
 */
export function SelectField(props: SelectFieldProps): JSX.Element;
```

---

### 2.3 ResultCard

**File**: `src/components/common/ResultCard.tsx`

Display card for calculated results.

```typescript
export interface ResultCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Main value to display
   */
  value: string | number;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Card variant (affects styling)
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'secondary';

  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
}

/**
 * Result display card
 * - Large, prominent value display
 * - Optional subtitle and icon
 * - Color-coded variants (primary for main result, success for savings, etc.)
 * - Responsive typography
 * 
 * @example
 * <ResultCard
 *   title="Final Investment Value"
 *   value="$44,274.58"
 *   subtitle="After 5 years"
 *   variant="primary"
 *   icon={<TrendingUpIcon />}
 * />
 */
export function ResultCard(props: ResultCardProps): JSX.Element;
```

---

### 2.4 SectionContainer

**File**: `src/components/common/SectionContainer.tsx`

Page section wrapper with consistent spacing.

```typescript
export interface SectionContainerProps {
  /**
   * Section title
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Section content
   */
  children: React.ReactNode;

  /**
   * Maximum width
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Section container with title and consistent spacing
 * - Responsive max-width
 * - Consistent vertical spacing
 * - Typography hierarchy (title is h2, subtitle is body)
 * 
 * @example
 * <SectionContainer
 *   title="Investment Calculator"
 *   subtitle="Calculate your future investment value"
 * >
 *   <YourContent />
 * </SectionContainer>
 */
export function SectionContainer(props: SectionContainerProps): JSX.Element;
```

---

## 3. Investment Feature Components

### 3.1 InvestmentForm

**File**: `src/features/investment/InvestmentForm.tsx`

Form for entering investment parameters.

```typescript
export interface InvestmentFormProps {
  /**
   * Callback when form is submitted
   */
  onCalculate: (input: InvestmentInput) => void;

  /**
   * Whether calculation is in progress
   * @default false
   */
  isCalculating?: boolean;

  /**
   * Initial values for form fields
   */
  initialValues?: Partial<InvestmentInput>;
}

/**
 * Investment input form
 * - Fields: initialAmount, monthlyContribution, duration, interestRate, compoundingFrequency
 * - Client-side validation with error messages
 * - Duration can be entered in years (converted to months)
 * - Submit button disabled during calculation
 * - Accessible form with proper labels and error announcements
 * 
 * @example
 * <InvestmentForm
 *   onCalculate={handleCalculate}
 *   isCalculating={isLoading}
 * />
 */
export function InvestmentForm(props: InvestmentFormProps): JSX.Element;
```

---

### 3.2 InvestmentResults

**File**: `src/features/investment/InvestmentResults.tsx`

Display investment calculation results.

```typescript
export interface InvestmentResultsProps {
  /**
   * Calculation result to display
   * Null if no calculation has been performed yet
   */
  result: InvestmentResult | null;

  /**
   * Whether to show empty state
   * @default true
   */
  showEmptyState?: boolean;
}

/**
 * Investment results display
 * - Shows totalInvested, totalInterestEarned, finalValue
 * - Displays breakdown table (period-by-period growth)
 * - Empty state when no result
 * - Uses ResultCard components for key metrics
 * - Breakdown table is responsive (scrollable on mobile)
 * 
 * Accessibility:
 * - Proper table structure with headers
 * - Screen reader friendly number formatting
 * - Clear visual hierarchy
 * 
 * @example
 * <InvestmentResults result={calculatedResult} />
 */
export function InvestmentResults(props: InvestmentResultsProps): JSX.Element;
```

---

### 3.3 InvestmentBreakdownTable

**File**: `src/features/investment/InvestmentBreakdownTable.tsx`

Table showing period-by-period investment growth.

```typescript
export interface InvestmentBreakdownTableProps {
  /**
   * Array of investment periods to display
   */
  breakdown: InvestmentPeriod[];

  /**
   * Show all periods or paginate
   * @default false (show all)
   */
  paginate?: boolean;
}

/**
 * Investment breakdown table
 * - Columns: Period, Total Invested, Interest Earned, Balance
 * - Responsive: horizontal scroll on mobile
 * - Alternating row colors for readability
 * - Currency formatting for all amounts
 * - Optional pagination for long periods
 * 
 * @example
 * <InvestmentBreakdownTable breakdown={result.breakdown} />
 */
export function InvestmentBreakdownTable(
  props: InvestmentBreakdownTableProps
): JSX.Element;
```

---

## 4. Debt Feature Components

### 4.1 DebtForm

**File**: `src/features/debt/DebtForm.tsx`

Form for entering loan parameters.

```typescript
export interface DebtFormProps {
  /**
   * Callback when form is submitted
   */
  onCalculate: (input: DebtInput) => void;

  /**
   * Whether calculation is in progress
   * @default false
   */
  isCalculating?: boolean;

  /**
   * Initial values for form fields
   */
  initialValues?: Partial<DebtInput>;
}

/**
 * Debt input form
 * - Fields: loanAmount, interestRate, term, paymentFrequency
 * - Client-side validation with error messages
 * - Term can be entered in years (converted to months)
 * - Submit button disabled during calculation
 * - Accessible form
 * 
 * @example
 * <DebtForm
 *   onCalculate={handleCalculate}
 *   isCalculating={isLoading}
 * />
 */
export function DebtForm(props: DebtFormProps): JSX.Element;
```

---

### 4.2 PrepaymentForm

**File**: `src/features/debt/PrepaymentForm.tsx`

Form for adding prepayments.

```typescript
export interface PrepaymentFormProps {
  /**
   * Current list of prepayments
   */
  prepayments: Prepayment[];

  /**
   * Callback when prepayment is added
   */
  onAdd: (prepayment: Prepayment) => void;

  /**
   * Callback when prepayment is removed
   */
  onRemove: (index: number) => void;

  /**
   * Maximum allowed month number
   */
  maxMonth: number;

  /**
   * Optional: remaining balance per month for validation
   */
  remainingBalances?: Record<number, number>;
}

/**
 * Prepayment management form
 * - Add prepayment: month, amount, strategy (reduce-payment or reduce-term)
 * - List existing prepayments with remove button
 * - Validates prepayment month and amount
 * - Shows helpful messages (e.g., "Prepayment in month 12 will save X months")
 * - Responsive layout
 * 
 * @example
 * <PrepaymentForm
 *   prepayments={prepayments}
 *   onAdd={handleAddPrepayment}
 *   onRemove={handleRemovePrepayment}
 *   maxMonth={360}
 * />
 */
export function PrepaymentForm(props: PrepaymentFormProps): JSX.Element;
```

---

### 4.3 PrepaymentList

**File**: `src/features/debt/PrepaymentList.tsx`

Display list of prepayments with remove functionality.

```typescript
export interface PrepaymentListProps {
  /**
   * List of prepayments
   */
  prepayments: Prepayment[];

  /**
   * Callback when prepayment is removed
   */
  onRemove: (index: number) => void;

  /**
   * Whether list is empty and should show empty state
   * @default true
   */
  showEmptyState?: boolean;
}

/**
 * List of prepayments with remove buttons
 * - Shows month, amount, strategy for each prepayment
 * - Delete button per prepayment
 * - Empty state when no prepayments
 * - Responsive (stacks on mobile)
 * 
 * @example
 * <PrepaymentList
 *   prepayments={prepayments}
 *   onRemove={handleRemove}
 * />
 */
export function PrepaymentList(props: PrepaymentListProps): JSX.Element;
```

---

### 4.4 DebtResults

**File**: `src/features/debt/DebtResults.tsx`

Display debt calculation results and comparison.

```typescript
export interface DebtResultsProps {
  /**
   * Base scenario (without prepayments) OR prepayment comparison result
   * Null if no calculation performed
   */
  result: AmortizationSchedule | PrepaymentResult | null;

  /**
   * Whether to show empty state
   * @default true
   */
  showEmptyState?: boolean;
}

/**
 * Debt results display
 * - If base scenario only: shows monthly payment, total interest, total paid
 * - If prepayment scenario: shows side-by-side comparison with savings highlighted
 * - Displays amortization schedule table
 * - Uses ResultCard for key metrics
 * - Highlights savings with success variant
 * 
 * Accessibility:
 * - Clear comparison tables
 * - Proper heading structure
 * - Readable number formatting
 * 
 * @example
 * <DebtResults result={prepaymentResult} />
 */
export function DebtResults(props: DebtResultsProps): JSX.Element;
```

---

### 4.5 AmortizationTable

**File**: `src/features/debt/AmortizationTable.tsx`

Table showing loan amortization schedule.

```typescript
export interface AmortizationTableProps {
  /**
   * Amortization schedule to display
   */
  schedule: AmortizationPayment[];

  /**
   * Whether to show only key milestones (e.g., every 12 months)
   * @default false (show all)
   */
  showMilestonesOnly?: boolean;

  /**
   * Whether to enable pagination
   * @default true
   */
  paginate?: boolean;
}

/**
 * Amortization schedule table
 * - Columns: Payment #, Payment Amount, Principal, Interest, Balance
 * - Responsive: horizontal scroll on mobile
 * - Optional milestone view (show every Nth payment)
 * - Optional pagination for long schedules
 * - Currency formatting
 * 
 * @example
 * <AmortizationTable
 *   schedule={result.schedule}
 *   showMilestonesOnly={false}
 *   paginate={true}
 * />
 */
export function AmortizationTable(props: AmortizationTableProps): JSX.Element;
```

---

### 4.6 ComparisonCard

**File**: `src/features/debt/ComparisonCard.tsx`

Side-by-side comparison of base vs. prepayment scenario.

```typescript
export interface ComparisonCardProps {
  /**
   * Base scenario results
   */
  baseScenario: AmortizationSchedule;

  /**
   * Prepayment scenario results
   */
  prepaymentScenario: AmortizationSchedule;

  /**
   * Interest savings amount
   */
  interestSavings: number;

  /**
   * Optional term reduction (months saved)
   */
  termReduction?: number | null;

  /**
   * Optional new monthly payment
   */
  newMonthlyPayment?: number | null;
}

/**
 * Comparison card showing base vs. prepayment scenarios
 * - Side-by-side layout (stacks on mobile)
 * - Highlights savings in green
 * - Shows key metrics: monthly payment, term, total interest
 * - Visual indicators for improvements
 * 
 * @example
 * <ComparisonCard
 *   baseScenario={result.baseScenario}
 *   prepaymentScenario={result.prepaymentScenario}
 *   interestSavings={15276.68}
 *   termReduction={15}
 * />
 */
export function ComparisonCard(props: ComparisonCardProps): JSX.Element;
```

---

## 5. Theme Components

### 5.1 ThemeToggle

**File**: `src/components/layout/ThemeToggle.tsx`

Button to toggle between light and dark themes.

```typescript
export interface ThemeToggleProps {
  /**
   * Current theme mode
   */
  mode: ThemeMode;

  /**
   * Callback when toggle clicked
   */
  onToggle: () => void;
}

/**
 * Theme toggle button
 * - Icon button with sun/moon icon
 * - Descriptive aria-label for accessibility
 * - Smooth icon transition
 * - Works in header, always visible
 * 
 * @example
 * <ThemeToggle mode="light" onToggle={handleToggle} />
 */
export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
```

---

## 6. Loading & Empty States

### 6.1 LoadingSpinner

**File**: `src/components/common/LoadingSpinner.tsx`

Loading indicator.

```typescript
export interface LoadingSpinnerProps {
  /**
   * Loading message
   * @default 'Loading...'
   */
  message?: string;

  /**
   * Size of spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Loading spinner with optional message
 * - Material UI CircularProgress
 * - Centered in container
 * - Accessible (role="status")
 * 
 * @example
 * <LoadingSpinner message="Calculating..." />
 */
export function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element;
```

---

### 6.2 EmptyState

**File**: `src/components/common/EmptyState.tsx`

Empty state placeholder.

```typescript
export interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Title
   */
  title: string;

  /**
   * Description
   */
  description: string;

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state placeholder
 * - Icon + title + description
 * - Optional action button
 * - Centered layout
 * - Friendly, encouraging tone
 * 
 * @example
 * <EmptyState
 *   icon={<CalculateIcon />}
 *   title="No results yet"
 *   description="Enter your investment details and click Calculate to see projections"
 * />
 */
export function EmptyState(props: EmptyStateProps): JSX.Element;
```

---

## Summary

**Components are organized by**:
1. **Layout**: App structure (header, menu, layout)
2. **Common**: Reusable UI elements (inputs, cards, containers)
3. **Investment Feature**: Investment-specific components
4. **Debt Feature**: Debt-specific components
5. **Theme**: Theme-related components
6. **States**: Loading and empty states

**All components**:
- Have strongly typed props
- Are accessible (WCAG AA)
- Are responsive (mobile-first)
- Support light/dark themes
- Are documented with JSDoc and examples

**Next**: Create hook contracts (contracts/hooks.md).
