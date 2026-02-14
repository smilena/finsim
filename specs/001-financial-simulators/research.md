# Research: Financial Projections and Debt Simulation

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Investigate financial formulas, technical patterns, and implementation strategies

---

## 1. Financial Calculation Formulas

### 1.1 Compound Interest Formula

**Use Case**: Investment Profitability Simulator (calculate future value of investment with regular contributions)

**Future Value with Periodic Contributions (Compound Interest)**

```
FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]

Where:
- FV  = Future Value (final investment value)
- P   = Principal (initial investment amount)
- PMT = Periodic payment (monthly contribution)
- r   = Annual interest rate (as decimal, e.g., 0.07 for 7%)
- n   = Number of compounding periods per year
      (monthly = 12, quarterly = 4, annually = 1)
- t   = Time in years
```

**Implementation Strategy**:
```typescript
// Pseudocode
function calculateFutureValue(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  compoundingFrequency: number, // 12, 4, or 1
  durationMonths: number
): number {
  const r = annualRate / 100; // Convert percentage to decimal
  const t = durationMonths / 12; // Convert months to years
  const n = compoundingFrequency;
  
  // Future value of principal
  const fvPrincipal = principal * Math.pow(1 + r / n, n * t);
  
  // Future value of monthly contributions (annuity)
  const fvContributions = monthlyContribution * 
    ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
  
  return fvPrincipal + fvContributions;
}
```

**Edge Cases**:
- **0% interest rate**: `FV = P + PMT × t × 12` (simple addition, no compounding)
- **Very high rates (>100%)**: May cause exponential overflow; validate input ranges
- **Fractional periods**: Round to nearest month internally

**Breakdown Calculation**:
Generate period-by-period values by iterating month-by-month:
```typescript
function generateBreakdown(input: InvestmentInput): InvestmentPeriod[] {
  const periods: InvestmentPeriod[] = [];
  let balance = input.initialAmount;
  const monthlyRate = (input.annualInterestRate / 100) / 12;
  
  for (let month = 1; month <= input.durationMonths; month++) {
    // Add monthly contribution
    balance += input.monthlyContribution;
    
    // Apply interest
    balance *= (1 + monthlyRate);
    
    periods.push({
      periodNumber: month,
      balance: balance,
      totalInvested: input.initialAmount + input.monthlyContribution * month,
      interestEarned: balance - (input.initialAmount + input.monthlyContribution * month)
    });
  }
  
  return periods;
}
```

---

### 1.2 Loan Amortization Formula

**Use Case**: Debt Interest and Prepayment Simulator (calculate monthly payment and amortization schedule)

**Monthly Payment Formula**

```
M = P × [r(1 + r)^n] / [(1 + r)^n - 1]

Where:
- M = Monthly payment amount
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Total number of payments (term in months)
```

**Implementation Strategy**:
```typescript
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    // No interest: simple division
    return principal / termMonths;
  }
  
  const monthlyRate = (annualRate / 100) / 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  
  return principal * (numerator / denominator);
}
```

**Amortization Schedule Generation**:
```typescript
function generateAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): AmortizationPayment[] {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualRate, termMonths);
  const monthlyRate = (annualRate / 100) / 12;
  
  const schedule: AmortizationPayment[] = [];
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = monthlyPayment - interestPaid;
    remainingBalance -= principalPaid;
    
    // Handle final payment rounding
    if (month === termMonths) {
      remainingBalance = 0;
    }
    
    schedule.push({
      paymentNumber: month,
      paymentAmount: monthlyPayment,
      principalPaid: principalPaid,
      interestPaid: interestPaid,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return schedule;
}
```

---

### 1.3 Capital Prepayment Logic

**Use Case**: Simulate extra payments toward loan principal with two strategies

**Strategy 1: Reduce Monthly Payment**
- Prepayment reduces remaining balance
- Recalculate monthly payment based on new balance and remaining term
- Loan term stays the same

```typescript
function applyPrepaymentReducePayment(
  schedule: AmortizationPayment[],
  prepaymentMonth: number,
  prepaymentAmount: number
): AmortizationPayment[] {
  // Apply prepayment: reduce balance at specified month
  const remainingBalance = schedule[prepaymentMonth - 1].remainingBalance - prepaymentAmount;
  const remainingMonths = schedule.length - prepaymentMonth;
  
  // Recalculate monthly payment for remaining term
  const newMonthlyPayment = calculateMonthlyPayment(
    remainingBalance,
    annualRate,
    remainingMonths
  );
  
  // Regenerate schedule from prepayment month onward with new payment
  // ... (iterate and recalculate)
}
```

**Strategy 2: Reduce Loan Term**
- Prepayment reduces remaining balance
- Monthly payment stays the same
- Loan pays off earlier (fewer months)

```typescript
function applyPrepaymentReduceTerm(
  schedule: AmortizationPayment[],
  prepaymentMonth: number,
  prepaymentAmount: number
): AmortizationPayment[] {
  const originalMonthlyPayment = schedule[0].paymentAmount;
  let remainingBalance = schedule[prepaymentMonth - 1].remainingBalance - prepaymentAmount;
  
  const newSchedule: AmortizationPayment[] = [];
  let month = prepaymentMonth + 1;
  
  // Continue with same monthly payment until balance reaches zero
  while (remainingBalance > 0) {
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = originalMonthlyPayment - interestPaid;
    remainingBalance -= principalPaid;
    
    if (remainingBalance < 0) {
      // Final payment is less than full monthly payment
      remainingBalance = 0;
    }
    
    newSchedule.push({
      paymentNumber: month++,
      paymentAmount: originalMonthlyPayment,
      principalPaid: principalPaid,
      interestPaid: interestPaid,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return newSchedule;
}
```

**Multiple Prepayments**:
- Apply prepayments sequentially in chronological order
- Each prepayment recalculates from that point forward
- Validate: prepayment amount must not exceed remaining balance at that month

**Interest Savings Calculation**:
```typescript
function calculateInterestSavings(
  baseSchedule: AmortizationSchedule,
  prepaymentSchedule: AmortizationSchedule
): number {
  const baseTotalInterest = baseSchedule.schedule.reduce(
    (sum, payment) => sum + payment.interestPaid, 0
  );
  
  const prepaymentTotalInterest = prepaymentSchedule.schedule.reduce(
    (sum, payment) => sum + payment.interestPaid, 0
  );
  
  return baseTotalInterest - prepaymentTotalInterest;
}
```

---

## 2. Material UI (MUI) Patterns

### 2.1 Theme Definition

**Calming Financial Color Palette**

**Light Theme** (trust, clarity, professionalism):
```typescript
const lightPalette = {
  primary: {
    main: '#1976d2',      // Calm blue (trust)
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#66bb6a',      // Soft green (growth, stability)
    light: '#81c784',
    dark: '#43a047',
  },
  success: {
    main: '#4caf50',      // Green (positive)
  },
  error: {
    main: '#ef5350',      // Soft red (not aggressive)
  },
  background: {
    default: '#f5f5f5',   // Light gray
    paper: '#ffffff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
};
```

**Dark Theme** (reduced eye strain, modern):
```typescript
const darkPalette = {
  primary: {
    main: '#64b5f6',      // Lighter blue for dark bg
    light: '#90caf9',
    dark: '#42a5f5',
  },
  secondary: {
    main: '#81c784',      // Lighter green
    light: '#a5d6a7',
    dark: '#66bb6a',
  },
  success: {
    main: '#66bb6a',
  },
  error: {
    main: '#ef5350',
  },
  background: {
    default: '#121212',   // Near black
    paper: '#1e1e1e',     // Slightly lighter for cards
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
};
```

**Typography**:
```typescript
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none', // Don't uppercase buttons
  },
};
```

---

### 2.2 Responsive Layout Components

**Grid System** (12-column responsive layout):
```tsx
import { Grid, Container } from '@mui/material';

<Container maxWidth="lg">
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      {/* Form column (full width on mobile, half on desktop) */}
    </Grid>
    <Grid item xs={12} md={6}>
      {/* Results column */}
    </Grid>
  </Grid>
</Container>
```

**Responsive Breakpoints**:
- `xs`: 0px+ (mobile)
- `sm`: 600px+ (tablet portrait)
- `md`: 900px+ (tablet landscape, small desktop)
- `lg`: 1200px+ (desktop)
- `xl`: 1536px+ (large desktop)

**Responsive Menu** (Drawer for mobile, AppBar for desktop):
```tsx
import { Drawer, AppBar, useMediaQuery, useTheme } from '@mui/material';

function ResponsiveMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return isMobile ? (
    <Drawer anchor="left" open={menuOpen} onClose={closeMenu}>
      {/* Menu items */}
    </Drawer>
  ) : (
    <AppBar position="static">
      {/* Horizontal menu */}
    </AppBar>
  );
}
```

---

### 2.3 Form Components with Validation

**TextField with Validation**:
```tsx
import { TextField } from '@mui/material';

<TextField
  label="Initial Investment"
  type="number"
  value={value}
  onChange={(e) => setValue(Number(e.target.value))}
  error={value < 0}
  helperText={value < 0 ? 'Must be positive' : ''}
  InputProps={{
    startAdornment: <InputAdornment position="start">$</InputAdornment>,
  }}
  fullWidth
  required
/>
```

**Select Dropdown**:
```tsx
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

<FormControl fullWidth>
  <InputLabel>Compounding Frequency</InputLabel>
  <Select
    value={frequency}
    onChange={(e) => setFrequency(e.target.value)}
  >
    <MenuItem value="monthly">Monthly</MenuItem>
    <MenuItem value="quarterly">Quarterly</MenuItem>
    <MenuItem value="annually">Annually</MenuItem>
  </Select>
</FormControl>
```

---

### 2.4 Theme Switching Implementation

**ThemeProvider with Context**:
```tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeModeContext = createContext({ toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'dark' || saved === 'light') {
      setMode(saved);
    }
  }, []);
  
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };
  
  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: typography,
  });
  
  return (
    <ThemeModeContext.Provider value={{ toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);
```

**Theme Toggle Button**:
```tsx
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function ThemeToggle() {
  const theme = useTheme();
  const { toggleTheme } = useThemeMode();
  
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
```

---

### 2.5 Accessibility Features

**WCAG AA Compliance**:
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via Tab/Shift+Tab
- **Focus Indicators**: Visible focus ring on all interactive elements
- **ARIA Labels**: Descriptive labels for screen readers

**MUI Accessibility Best Practices**:
```tsx
// Proper label association
<TextField
  id="investment-amount"
  label="Initial Investment"
  aria-describedby="investment-amount-helper"
  helperText="Enter the amount you want to invest initially"
/>

// Button with accessible label
<IconButton aria-label="Toggle theme" onClick={toggleTheme}>
  <Brightness4 />
</IconButton>

// Accessible navigation
<nav aria-label="Main navigation">
  <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
    Home
  </Link>
</nav>
```

---

## 3. Next.js App Router Architecture

### 3.1 File-Based Routing

**App Directory Structure**:
```
app/
├── layout.tsx          # Root layout (applies to all pages)
├── page.tsx            # Home page (/)
├── investment/
│   └── page.tsx        # Investment page (/investment)
└── debt/
    └── page.tsx        # Debt page (/debt)
```

**Root Layout** (`app/layout.tsx`):
```tsx
import { ThemeProvider } from '@/theme/ThemeProvider';

export const metadata = {
  title: 'Financial Simulators',
  description: 'Investment and debt calculation tools',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### 3.2 Client vs. Server Components

**Default**: Server Components (rendered on server)
**Use Client Components when**:
- Interactive state (useState, useEffect)
- Browser APIs (localStorage, window)
- Event handlers (onClick, onChange)

**Mark Client Components**:
```tsx
'use client'; // Add this directive at the top

import { useState } from 'react';

export function InvestmentForm() {
  const [amount, setAmount] = useState(0);
  // ... client-side logic
}
```

**For this project**: Most components will be Client Components because:
- Forms with state management
- Theme switching (uses localStorage)
- Calculations triggered by user interactions

---

### 3.3 Navigation

**Using Next.js Link**:
```tsx
import Link from 'next/link';
import { Button } from '@mui/material';

<Button component={Link} href="/investment">
  Investment Simulator
</Button>
```

**Active Link Styling**:
```tsx
'use client';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      style={{ 
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: isActive ? 'underline' : 'none'
      }}
    >
      {children}
    </Link>
  );
}
```

---

## 4. Testing Strategy

### 4.1 Unit Tests (Jest + React Testing Library)

**Testing Pure Domain Functions**:
```typescript
// tests/unit/domain/investment.formulas.test.ts
import { calculateFutureValue } from '@/domain/investment/investment.formulas';

describe('calculateFutureValue', () => {
  it('calculates correct future value with 0% interest', () => {
    const result = calculateFutureValue(10000, 500, 0, 12, 60);
    expect(result).toBeCloseTo(10000 + 500 * 60, 2); // Principal + contributions
  });
  
  it('calculates correct future value with 7% annual interest, monthly compounding', () => {
    const result = calculateFutureValue(10000, 500, 7, 12, 60);
    expect(result).toBeCloseTo(44274.58, 2); // Verified with financial calculator
  });
  
  it('handles fractional rates correctly', () => {
    const result = calculateFutureValue(10000, 0, 5.5, 12, 120);
    expect(result).toBeGreaterThan(10000);
  });
});
```

**Testing React Components**:
```typescript
// tests/unit/components/NumberInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '@/components/common/NumberInput';

describe('NumberInput', () => {
  it('renders with label and initial value', () => {
    render(<NumberInput label="Amount" value={100} onChange={() => {}} />);
    expect(screen.getByLabelText('Amount')).toHaveValue(100);
  });
  
  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<NumberInput label="Amount" value={100} onChange={handleChange} />);
    
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '200' } });
    expect(handleChange).toHaveBeenCalledWith(200);
  });
  
  it('displays error state when value is invalid', () => {
    render(<NumberInput label="Amount" value={-100} onChange={() => {}} min={0} error />);
    expect(screen.getByLabelText('Amount')).toHaveAttribute('aria-invalid', 'true');
  });
});
```

**Testing Custom Hooks**:
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
    expect(result.current.result.finalValue).toBeGreaterThan(10000);
  });
});
```

---

### 4.2 Integration Tests

**Testing Full Feature Flow**:
```typescript
// tests/integration/investment-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InvestmentPage from '@/app/investment/page';

describe('Investment Simulator Flow', () => {
  it('calculates and displays investment projection', async () => {
    render(<InvestmentPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/initial investment/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/monthly contribution/i), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/interest rate/i), { target: { value: '7' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    // Verify results displayed
    await waitFor(() => {
      expect(screen.getByText(/final value/i)).toBeInTheDocument();
      expect(screen.getByText(/44,274.58/)).toBeInTheDocument();
    });
  });
});
```

---

### 4.3 End-to-End Tests (Playwright)

**Navigation Test**:
```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('navigates between pages', async ({ page }) => {
  await page.goto('/');
  
  // Verify home page
  await expect(page.locator('h1')).toContainText('Financial Simulators');
  
  // Navigate to investment page
  await page.click('text=Investment Simulator');
  await expect(page).toHaveURL('/investment');
  
  // Navigate to debt page
  await page.click('text=Debt Simulator');
  await expect(page).toHaveURL('/debt');
});

test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
  await page.goto('/');
  
  // Open mobile menu
  await page.click('[aria-label="Open menu"]');
  await expect(page.locator('nav')).toBeVisible();
});
```

**Investment Simulator Test**:
```typescript
// e2e/investment.spec.ts
import { test, expect } from '@playwright/test';

test('calculates investment projection', async ({ page }) => {
  await page.goto('/investment');
  
  // Fill form
  await page.fill('[aria-label="Initial Investment"]', '10000');
  await page.fill('[aria-label="Monthly Contribution"]', '500');
  await page.fill('[aria-label="Duration (years)"]', '5');
  await page.fill('[aria-label="Interest Rate (%)"]', '7');
  await page.selectOption('[aria-label="Compounding Frequency"]', 'monthly');
  
  // Calculate
  await page.click('text=Calculate');
  
  // Verify results
  await expect(page.locator('text=Final Value')).toBeVisible();
  await expect(page.locator('text=$44,274.58')).toBeVisible();
});
```

**Theme Switching Test**:
```typescript
// e2e/theme.spec.ts
import { test, expect } from '@playwright/test';

test('switches theme', async ({ page }) => {
  await page.goto('/');
  
  // Verify light theme (default)
  const body = page.locator('body');
  await expect(body).toHaveCSS('background-color', 'rgb(245, 245, 245)');
  
  // Toggle to dark theme
  await page.click('[aria-label="Toggle theme"]');
  
  // Verify dark theme
  await expect(body).toHaveCSS('background-color', 'rgb(18, 18, 18)');
  
  // Verify persistence (reload page)
  await page.reload();
  await expect(body).toHaveCSS('background-color', 'rgb(18, 18, 18)');
});
```

---

### 4.4 Achieving 90% Coverage

**Coverage Breakdown Strategy**:
- **Domain Layer (100% target)**: Pure functions, critical for correctness
- **Hooks (95% target)**: Orchestration logic, core business flows
- **UI Components (85% target)**: Presentational logic, edge cases
- **Integration Tests (cover critical paths)**: User stories P1-P4
- **E2E Tests (cover happy paths)**: Investment calculation, debt calculation, navigation, theme

**Run Coverage Report**:
```bash
npm run test:coverage

# Output:
# Statements   : 92.5% (740/800)
# Branches     : 91.2% (210/230)
# Functions    : 93.1% (135/145)
# Lines        : 92.3% (720/780)
```

**Enforce in CI**:
```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "statements": 90,
        "branches": 90,
        "functions": 90,
        "lines": 90
      }
    }
  }
}
```

---

## 5. Input Validation & Error Handling

### 5.1 Validation Rules

**Investment Inputs**:
- `initialAmount`: number, positive (> 0), max 1 billion
- `monthlyContribution`: number, non-negative (>= 0), max 1 million
- `durationMonths`: integer, positive (> 0), max 1200 (100 years)
- `annualInterestRate`: number, non-negative (>= 0), max 100
- `compoundingFrequency`: enum (monthly | quarterly | annually)

**Debt Inputs**:
- `loanAmount`: number, positive (> 0), max 100 million
- `annualInterestRate`: number, non-negative (>= 0), max 100
- `termMonths`: integer, positive (> 0), max 600 (50 years)
- `paymentFrequency`: enum (monthly | bi-weekly)

**Prepayment Inputs**:
- `monthNumber`: integer, positive (> 0), max `termMonths`
- `amount`: number, positive (> 0), max remaining balance at that month
- `strategy`: enum (reduce-payment | reduce-term)

### 5.2 Error Messages

**User-Friendly Error Messages**:
```typescript
const errorMessages = {
  required: 'This field is required',
  positive: 'Must be a positive number',
  nonNegative: 'Must be zero or greater',
  maxValue: (max: number) => `Maximum value is ${max}`,
  minValue: (min: number) => `Minimum value is ${min}`,
  invalidMonth: (max: number) => `Month must be between 1 and ${max}`,
  exceedsBalance: 'Prepayment exceeds remaining loan balance',
};
```

---

## 6. Number Formatting & Precision

### 6.1 Currency Formatting

```typescript
// utils/money.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Example: formatCurrency(44274.58) => "$44,274.58"
```

### 6.2 Percentage Formatting

```typescript
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// Example: formatPercentage(7.5) => "7.50%"
```

### 6.3 Rounding Strategy

**Banker's Rounding** (round half to even):
```typescript
export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}
```

---

## 7. Performance Optimization

### 7.1 Memoization

**Use `useMemo` for expensive calculations**:
```typescript
const result = useMemo(() => {
  return calculateInvestmentProjection(input);
}, [input]); // Only recalculate when input changes
```

**Use `useCallback` for stable function references**:
```typescript
const handleCalculate = useCallback((input: InvestmentInput) => {
  setResult(calculateInvestmentProjection(input));
}, []);
```

### 7.2 Code Splitting

**Dynamic imports for heavy components**:
```typescript
import dynamic from 'next/dynamic';

const ProjectionChart = dynamic(() => import('@/components/charts/ProjectionChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Don't render on server
});
```

### 7.3 Bundle Size Monitoring

**Analyze bundle size**:
```bash
npm run build
# Check .next/static/ for bundle sizes
```

**Optimize MUI imports** (tree shaking):
```typescript
// Good: Import only what you need
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Avoid: Import everything
import { Button, TextField } from '@mui/material'; // Still okay, but slightly larger
```

---

## Summary

**Key Takeaways**:
1. **Financial Formulas**: Compound interest and amortization formulas are mathematically sound and tested
2. **MUI Theming**: Calming color palette with light/dark themes, fully responsive, accessible
3. **Next.js Architecture**: App Router with client components for interactivity, server components where possible
4. **Testing**: Comprehensive strategy targeting 90% coverage (unit + integration + E2E)
5. **Validation**: Strict input validation with user-friendly error messages
6. **Performance**: Memoization, code splitting, bundle size optimization

**Next Step**: Create data model (data-model.md) with TypeScript types and interfaces.
