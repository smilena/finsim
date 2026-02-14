# Implementation Plan: Financial Projections and Debt Simulation Application

**Branch**: `001-financial-simulators` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-financial-simulators/spec.md`

## Summary

Build a user-friendly web application for financial projections and debt simulation, focused on clarity, trust, and ease of use. The application provides two main financial calculators:

1. **Investment Profitability Simulator**: Projects investment growth based on initial amount, monthly contributions, duration, interest rate, and compounding frequency
2. **Debt Interest and Prepayment Simulator**: Calculates loan interest and simulates capital prepayments with options to reduce payment or reduce term

**Technical Approach**: 
- Client-side Next.js (App Router) application with TypeScript strict mode
- Layered architecture with clear separation between UI, application orchestration, and domain logic (financial calculations)
- Material UI for consistent, accessible, theme-aware UI components
- Pure functional domain layer for deterministic financial calculations
- Comprehensive testing strategy (Jest + RTL + Playwright) targeting 90% coverage

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router, latest stable)  
**Primary Dependencies**: 
- **Next.js 14+**: React framework with App Router for routing and SSR capabilities
- **Material UI (MUI) v5+**: Component library (sole UI framework)
- **React 18+**: UI rendering
- **TypeScript 5.x**: Type safety with strict mode enabled

**Storage**: Browser local storage for theme preference only (no backend, no database, no user data persistence)  
**Testing**: 
- **Jest + React Testing Library**: Unit and integration tests
- **Playwright**: End-to-end tests for critical user flows
- **Coverage target**: 90% minimum (statements, branches, functions, lines)

**Target Platform**: Web browsers (modern Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices (responsive down to 375px width)  
**Project Type**: Single-page web application (Next.js App Router with client-side rendering for calculations)  
**Performance Goals**: 
- First Contentful Paint (FCP) < 3 seconds on 3G
- 60 FPS smooth interactions
- Cumulative Layout Shift (CLS) < 0.1
- Instant theme switching (< 1 second)
- Calculations complete within 500ms for typical scenarios

**Constraints**: 
- Client-side only (no backend API required for MVP)
- No authentication or user accounts
- No data persistence across sessions (calculations are ephemeral)
- Must work offline after initial load (static generation where possible)
- Bundle size kept minimal (code splitting, tree shaking)
- Supports light and dark themes with immediate switching

**Scale/Scope**: 
- 2 main calculator sections (Investment, Debt)
- 4 prioritized user stories (P1: Navigation, P2: Investment, P3: Debt, P4: Theme)
- ~10-15 UI components
- ~6-8 domain service functions
- Designed for future expansion (additional calculators can be added modularly)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Technology Stack Compliance:**
- [x] Next.js (latest stable) confirmed as framework ✅
- [x] TypeScript with `strict: true` in tsconfig.json ✅
- [x] Material UI (MUI) as sole UI component library ✅
- [x] Next.js best practices for state, routing, data fetching ✅

**Architecture & Code Quality:**
- [x] Clear separation: UI / Domain / Services / Infrastructure ✅
- [x] Business logic isolated from UI components ✅ (domain layer is pure functions, no React imports)
- [x] All public APIs strongly typed and documented ✅

**Testing Requirements:**
- [x] Jest + React Testing Library configured ✅
- [x] Playwright configured for E2E tests ✅
- [x] 90% code coverage target established ✅
- [x] Test strategy covers unit, integration, and E2E ✅

**UX & Performance:**
- [x] Responsive and mobile-first design confirmed ✅ (down to 375px)
- [x] Accessibility requirements defined (WCAG AA) ✅
- [x] Performance targets defined (Core Web Vitals) ✅ (FCP < 3s, CLS < 0.1, 60 FPS)
- [x] Centralized MUI theming planned ✅ (light/dark themes with calming palette)

**Additional Gates:**
- [x] No complexity introduced without justification ✅ (layered architecture justified by testability and maintainability)
- [x] Definition of Done criteria understood by team ✅ (8 criteria defined in spec)

**Overall Constitution Compliance**: ✅ **PASSED** - All gates satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-financial-simulators/
├── plan.md              # This file
├── research.md          # Phase 0 output (libraries, formulas, patterns)
├── data-model.md        # Phase 1 output (entities, types, interfaces)
├── quickstart.md        # Phase 1 output (dev setup, run instructions)
├── contracts/           # Phase 1 output (component/service interfaces)
│   ├── components.md    # UI component contracts
│   ├── domain.md        # Domain service contracts
│   └── hooks.md         # Custom hook contracts
├── checklists/
│   └── requirements.md  # Quality validation checklist (already created)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

**Structure Decision**: Single Next.js web application with layered architecture. The application uses Next.js App Router structure with clear separation between presentation (UI), application logic (hooks/mappers), and domain logic (financial calculations).

```text
src/
├── app/
│   ├── layout.tsx                # Root layout (theme provider, global styles)
│   ├── page.tsx                  # Home / Welcome page (P1)
│   ├── investment/
│   │   └── page.tsx              # Investment simulator page (P2)
│   ├── debt/
│   │   └── page.tsx              # Debt & prepayment simulator page (P3)
│   └── globals.css               # Global CSS (minimal, prefer MUI)
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx         # Top bar + theme toggle (P1, P4)
│   │   ├── AppMenu.tsx           # Responsive navigation menu (P1)
│   │   └── AppLayout.tsx         # Main layout wrapper (P1)
│   │
│   ├── common/
│   │   ├── NumberInput.tsx       # Reusable number input with validation
│   │   ├── SelectField.tsx       # Reusable select dropdown
│   │   ├── ResultCard.tsx        # Card for displaying results
│   │   └── SectionContainer.tsx  # Page section wrapper
│   │
│   └── charts/
│       └── ProjectionChart.tsx   # Optional future visualization
│
├── features/
│   ├── investment/
│   │   ├── InvestmentForm.tsx    # Form for investment inputs (P2)
│   │   ├── InvestmentResults.tsx # Display investment results (P2)
│   │   ├── useInvestmentSimulator.ts  # Hook for investment logic
│   │   └── investment.mapper.ts   # Map domain results to UI format
│   │
│   ├── debt/
│   │   ├── DebtForm.tsx          # Form for debt inputs (P3)
│   │   ├── DebtResults.tsx       # Display debt results (P3)
│   │   ├── PrepaymentForm.tsx    # Form for adding prepayments (P3)
│   │   ├── useDebtSimulator.ts   # Hook for debt logic
│   │   └── debt.mapper.ts        # Map domain results to UI format
│
├── domain/
│   ├── investment/
│   │   ├── investment.types.ts        # Investment entity types
│   │   ├── investment.formulas.ts     # Compound interest formulas
│   │   └── investment.service.ts      # Investment calculation service
│   │
│   ├── debt/
│   │   ├── debt.types.ts              # Debt entity types
│   │   ├── amortization.formulas.ts   # Amortization formulas
│   │   ├── prepayment.formulas.ts     # Prepayment calculation logic
│   │   └── debt.service.ts            # Debt calculation service
│
├── theme/
│   ├── palette.ts                # Calming finance color palette (P4)
│   ├── typography.ts             # Typography configuration
│   ├── lightTheme.ts             # Light theme definition (P4)
│   ├── darkTheme.ts              # Dark theme definition (P4)
│   └── ThemeProvider.tsx         # Theme context provider (P4)
│
├── hooks/
│   ├── useThemeMode.ts           # Hook for theme switching (P4)
│   └── useResponsiveMenu.ts      # Hook for responsive menu behavior (P1)
│
├── utils/
│   ├── money.ts                  # Money formatting & precision helpers
│   ├── validation.ts             # Input validation utilities
│   └── math.ts                   # Math utilities (rounding, etc.)
│
└── types/
    └── common.types.ts           # Shared type definitions

tests/
├── unit/
│   ├── domain/
│   │   ├── investment.formulas.test.ts
│   │   ├── investment.service.test.ts
│   │   ├── amortization.formulas.test.ts
│   │   ├── prepayment.formulas.test.ts
│   │   └── debt.service.test.ts
│   ├── utils/
│   │   ├── money.test.ts
│   │   ├── validation.test.ts
│   │   └── math.test.ts
│   └── hooks/
│       ├── useInvestmentSimulator.test.ts
│       ├── useDebtSimulator.test.ts
│       └── useThemeMode.test.ts
│
├── integration/
│   ├── investment-flow.test.tsx   # Full investment calculation flow
│   ├── debt-flow.test.tsx         # Full debt calculation flow
│   └── theme-switching.test.tsx   # Theme switching across components
│
└── setupTests.ts                  # Jest configuration

e2e/
├── investment.spec.ts             # E2E tests for investment simulator (P2)
├── debt.spec.ts                   # E2E tests for debt simulator (P3)
├── navigation.spec.ts             # E2E tests for navigation (P1)
└── theme.spec.ts                  # E2E tests for theme switching (P4)

Config Files (root):
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript config (strict: true)
├── jest.config.js                 # Jest configuration
├── playwright.config.ts           # Playwright configuration
├── .eslintrc.json                 # ESLint rules (strict)
├── .prettierrc                    # Prettier formatting rules
└── package.json                   # Dependencies and scripts
```

**Key Architectural Decisions**:

1. **Layered Architecture**: Strict separation between UI (`components/`, `features/`), application logic (`hooks/`, mappers), and domain logic (`domain/`)
2. **Domain Layer Purity**: All financial calculations in `domain/` are pure functions with no React dependencies, enabling:
   - Easy unit testing
   - Reusability across different UIs
   - Mathematical correctness validation
3. **Feature-Based Organization**: Each calculator has its own feature folder with form, results, hook, and mapper
4. **Time Normalization**: All time units converted to months internally for consistent calculations
5. **No Global State Library**: React local state + custom hooks sufficient for ephemeral calculations
6. **Theme via Context**: Single `ThemeProvider` wrapping entire app, persisted to localStorage

## Complexity Tracking

> No constitution violations detected. All complexity is justified and aligns with constitution principles.

| Aspect | Justification | Alternative Considered |
|--------|---------------|------------------------|
| Layered architecture (UI/App/Domain separation) | Mandated by constitution. Enables testability, maintainability, and isolation of business logic from UI. | Direct calculation in components - rejected because it violates constitution principle II (business logic must not live in UI components) |
| Pure functional domain layer | Ensures deterministic, testable financial calculations. Critical for accuracy and trust. | Stateful calculation services - rejected because pure functions are easier to test and reason about |
| Custom hooks per feature | Orchestrates validation, domain calls, and result mapping without coupling UI to domain. Follows React best practices. | Direct service calls in components - rejected because it mixes concerns and reduces reusability |
| MUI theming infrastructure | Required by constitution. Centralized theming enables consistent UX and easy theme switching. | Custom CSS solution - rejected because constitution mandates MUI as sole UI library |

---

## Phase 0: Research

**Goal**: Investigate financial formulas, MUI patterns, Next.js App Router best practices, and testing strategies to inform implementation.

### Research Topics

1. **Financial Calculation Formulas**
   - Compound interest formula with configurable compounding frequency
   - Amortization schedule calculation (loan payment breakdown)
   - Impact of capital prepayments on loan balance and schedule
   - Reducing monthly payment vs. reducing loan term strategies
   - Edge cases: 0% interest, very high rates, fractional periods

2. **Material UI (MUI) Patterns**
   - Best practices for theme definition (light/dark)
   - Recommended color palette for financial applications (trust, calmness)
   - Form component patterns (TextField, Select, validation)
   - Responsive layout components (Grid, Container, Stack)
   - Theme switching implementation (useMediaQuery, ThemeProvider)
   - Accessibility features (keyboard navigation, ARIA labels, focus management)

3. **Next.js App Router Architecture**
   - File-based routing with app directory
   - Layout composition (root layout, nested layouts)
   - Client components vs. Server components (when calculations are client-side)
   - Static generation vs. dynamic rendering strategies
   - Best practices for organizing domain logic separate from UI

4. **Testing Strategy**
   - Jest + React Testing Library setup for Next.js App Router
   - Testing pure domain functions (financial formulas)
   - Testing custom hooks (useInvestmentSimulator, useDebtSimulator)
   - Integration testing strategies for multi-component flows
   - Playwright setup for E2E tests (navigation, calculations, theme switching)
   - Achieving 90% coverage: unit tests for domain, integration tests for features, E2E for critical paths

5. **Input Validation & Error Handling**
   - Client-side validation patterns (positive numbers, ranges, dependencies)
   - User-friendly error messages for financial inputs
   - MUI TextField validation integration (error prop, helperText)
   - Preventing invalid calculations (e.g., prepayment > loan balance)

6. **Number Formatting & Precision**
   - Currency formatting (locale-aware, two decimal places)
   - Percentage formatting
   - Rounding strategies for financial calculations (banker's rounding)
   - Displaying large numbers (e.g., $1,000,000.00)

7. **Performance Optimization**
   - Memoization strategies for expensive calculations (useMemo, useCallback)
   - Code splitting strategies for Next.js
   - Bundle size optimization (tree shaking, dynamic imports)
   - Avoiding unnecessary re-renders

**Deliverable**: `research.md` document with:
- Financial formulas with mathematical notation and implementation pseudocode
- MUI component recommendations and code examples
- Next.js App Router patterns and best practices
- Testing strategy with example test structures
- Validation patterns and error handling approaches
- Performance optimization techniques

---

## Phase 1: Design

**Goal**: Define data models, component contracts, and service interfaces to guide implementation.

### 1.1 Data Model

**Deliverable**: `data-model.md` document defining TypeScript types and interfaces for all entities.

**Key Entities** (from spec):

**Investment Projection**
```typescript
// Input data
interface InvestmentInput {
  initialAmount: number;        // Positive number, two decimals
  monthlyContribution: number;  // Positive or zero, two decimals
  durationMonths: number;       // Positive integer (converted from years if needed)
  annualInterestRate: number;   // Percentage (e.g., 7.5 for 7.5%)
  compoundingFrequency: CompoundingFrequency;
}

type CompoundingFrequency = 'monthly' | 'quarterly' | 'annually';

// Calculated results
interface InvestmentResult {
  totalInvested: number;        // Initial + all contributions
  totalInterestEarned: number;  // Interest accumulated
  finalValue: number;           // Total invested + interest
  breakdown: InvestmentPeriod[]; // Period-by-period breakdown
}

interface InvestmentPeriod {
  periodNumber: number;         // 1, 2, 3, ...
  periodEndDate: Date | string; // Or simple month/year representation
  totalInvested: number;        // Cumulative invested to this period
  interestEarned: number;       // Cumulative interest to this period
  balance: number;              // Total value at period end
}
```

**Debt Scenario**
```typescript
// Input data
interface DebtInput {
  loanAmount: number;           // Positive number, two decimals
  annualInterestRate: number;   // Percentage
  termMonths: number;           // Positive integer (converted from years if needed)
  paymentFrequency: PaymentFrequency;
}

type PaymentFrequency = 'monthly' | 'bi-weekly';

// Amortization schedule
interface AmortizationSchedule {
  monthlyPayment: number;       // Fixed payment amount
  totalInterestPaid: number;    // Total interest over life of loan
  totalPaid: number;            // Total amount paid (principal + interest)
  schedule: AmortizationPayment[];
}

interface AmortizationPayment {
  paymentNumber: number;        // 1, 2, 3, ...
  paymentDate: Date | string;   // Or month representation
  paymentAmount: number;        // Usually fixed (except last payment)
  principalPaid: number;        // Portion toward principal
  interestPaid: number;         // Portion toward interest
  remainingBalance: number;     // Balance after this payment
}
```

**Prepayment**
```typescript
interface Prepayment {
  monthNumber: number;          // Which month prepayment occurs (1-based)
  amount: number;               // Prepayment amount (must be <= remaining balance)
  strategy: PrepaymentStrategy;
}

type PrepaymentStrategy = 'reduce-payment' | 'reduce-term';

// Results with prepayments
interface PrepaymentResult {
  baseScenario: AmortizationSchedule;    // Without prepayments
  prepaymentScenario: AmortizationSchedule; // With prepayments applied
  interestSavings: number;                  // Base total interest - prepayment total interest
  termReduction?: number;                   // Months saved (if reduce-term strategy)
  newMonthlyPayment?: number;               // New payment amount (if reduce-payment strategy)
}
```

**Theme Preference**
```typescript
type ThemeMode = 'light' | 'dark';

interface ThemePreference {
  mode: ThemeMode;
  // Persisted to localStorage with key 'theme-preference'
}
```

### 1.2 Service Contracts

**Deliverable**: `contracts/domain.md` document defining domain service interfaces.

**Investment Service**
```typescript
// Pure function: no side effects, deterministic
function calculateInvestmentProjection(
  input: InvestmentInput
): InvestmentResult;

// Helper: calculate compound interest for a period
function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  durationMonths: number
): number;

// Helper: generate period-by-period breakdown
function generateInvestmentBreakdown(
  input: InvestmentInput
): InvestmentPeriod[];
```

**Debt Service**
```typescript
// Pure function: calculate base amortization schedule
function calculateAmortizationSchedule(
  input: DebtInput
): AmortizationSchedule;

// Pure function: calculate monthly payment amount
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number;

// Pure function: apply prepayments and recalculate schedule
function applyPrepayments(
  baseSchedule: AmortizationSchedule,
  prepayments: Prepayment[]
): PrepaymentResult;

// Helper: calculate remaining balance after payment
function calculateRemainingBalance(
  currentBalance: number,
  payment: number,
  monthlyInterestRate: number
): { principal: number; interest: number; balance: number };
```

### 1.3 Component Contracts

**Deliverable**: `contracts/components.md` document defining component props interfaces.

**Layout Components**
```typescript
// AppHeader: Top bar with theme toggle
interface AppHeaderProps {
  onThemeToggle: () => void;
  currentTheme: ThemeMode;
}

// AppMenu: Responsive navigation
interface AppMenuProps {
  items: MenuItem[];
  currentPath: string;
}

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
```

**Common Components**
```typescript
// NumberInput: Reusable validated number input
interface NumberInputProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  prefix?: string; // e.g., '$'
  suffix?: string; // e.g., '%'
}

// ResultCard: Display calculated results
interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'success';
}
```

**Investment Feature Components**
```typescript
// InvestmentForm: Input form for investment parameters
interface InvestmentFormProps {
  onCalculate: (input: InvestmentInput) => void;
  isCalculating?: boolean;
}

// InvestmentResults: Display investment projection results
interface InvestmentResultsProps {
  result: InvestmentResult | null;
  input: InvestmentInput;
}
```

**Debt Feature Components**
```typescript
// DebtForm: Input form for loan parameters
interface DebtFormProps {
  onCalculate: (input: DebtInput) => void;
  isCalculating?: boolean;
}

// PrepaymentForm: Add/manage prepayments
interface PrepaymentFormProps {
  prepayments: Prepayment[];
  onAdd: (prepayment: Prepayment) => void;
  onRemove: (index: number) => void;
  maxMonth: number; // Maximum allowed month (loan term)
}

// DebtResults: Display debt calculation and comparison
interface DebtResultsProps {
  result: PrepaymentResult | AmortizationSchedule | null;
  input: DebtInput;
  prepayments: Prepayment[];
}
```

### 1.4 Custom Hooks Contracts

**Deliverable**: `contracts/hooks.md` document defining hook signatures.

```typescript
// Hook: Orchestrate investment calculation flow
function useInvestmentSimulator(): {
  input: InvestmentInput | null;
  result: InvestmentResult | null;
  errors: Record<string, string>;
  calculate: (input: InvestmentInput) => void;
  reset: () => void;
};

// Hook: Orchestrate debt calculation flow with prepayments
function useDebtSimulator(): {
  debtInput: DebtInput | null;
  prepayments: Prepayment[];
  result: PrepaymentResult | AmortizationSchedule | null;
  errors: Record<string, string>;
  calculateBase: (input: DebtInput) => void;
  addPrepayment: (prepayment: Prepayment) => void;
  removePrepayment: (index: number) => void;
  reset: () => void;
};

// Hook: Theme switching with localStorage persistence
function useThemeMode(): {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

// Hook: Responsive menu behavior
function useResponsiveMenu(): {
  isMobile: boolean;
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};
```

### 1.5 Quickstart Guide

**Deliverable**: `quickstart.md` document with:

**Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager

**Setup Instructions**
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000

# 4. Run tests
npm run test              # Unit + integration tests
npm run test:coverage     # With coverage report
npm run test:e2e          # Playwright E2E tests

# 5. Run linting
npm run lint              # ESLint
npm run format            # Prettier

# 6. Build for production
npm run build
npm run start             # Serve production build
```

**Project Commands**
- `npm run dev`: Start Next.js dev server with hot reload
- `npm run build`: Build production bundle
- `npm run start`: Serve production build locally
- `npm run test`: Run Jest unit/integration tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate coverage report (must hit 90%)
- `npm run test:e2e`: Run Playwright E2E tests
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm run type-check`: Run TypeScript compiler check

**Development Workflow**
1. Start dev server: `npm run dev`
2. Make changes in `src/`
3. Verify types: `npm run type-check`
4. Run tests: `npm run test` (ensure coverage stays above 90%)
5. Run linter: `npm run lint`
6. Commit changes

**Folder Navigation**
- **Domain logic**: `src/domain/` (pure functions, no React)
- **UI components**: `src/components/` (reusable) and `src/features/` (feature-specific)
- **Pages**: `src/app/` (Next.js App Router pages)
- **Tests**: `tests/unit/`, `tests/integration/`, `e2e/`

---

## Next Steps

After completing Phases 0 and 1:

1. Review all deliverables:
   - `research.md`: Formulas, patterns, best practices
   - `data-model.md`: TypeScript types and entities
   - `contracts/domain.md`: Domain service interfaces
   - `contracts/components.md`: Component props interfaces
   - `contracts/hooks.md`: Custom hook signatures
   - `quickstart.md`: Development setup guide

2. Run `/speckit.tasks` to generate detailed task breakdown organized by user story (P1 → P2 → P3 → P4)

3. Begin implementation following prioritized user stories:
   - **P1 (MVP Foundation)**: Navigation and home page
   - **P2 (Core Feature 1)**: Investment simulator
   - **P3 (Core Feature 2)**: Debt simulator with prepayments
   - **P4 (UX Enhancement)**: Theme customization

4. Maintain 90% test coverage throughout implementation

5. Validate against Constitution and Definition of Done before considering feature complete
