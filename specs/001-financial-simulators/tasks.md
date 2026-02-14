# Tasks: Financial Projections and Debt Simulation Application

**Input**: Design documents from `/specs/001-financial-simulators/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY per project constitution. All features must include appropriate unit, integration, and E2E tests to maintain 90% code coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Next.js App Router: `src/app/` for pages, `src/components/` for UI, `src/domain/` for business logic
- Paths follow plan.md structure

---

## Phase 1: Setup (Project Initialization) ✅ COMPLETED

**Purpose**: Initialize Next.js project, dependencies, and configuration files

- [x] T001 Initialize Next.js 14+ project with TypeScript and App Router in repository root
- [x] T002 [P] Install core dependencies (React 18+, Material UI v5+, @emotion/react, @emotion/styled) in package.json
- [x] T003 [P] Install testing dependencies (Jest, @testing-library/react, @testing-library/jest-dom, @playwright/test) in package.json
- [x] T004 [P] Configure TypeScript with strict mode in tsconfig.json
- [x] T005 [P] Configure ESLint with strict rules in .eslintrc.json
- [x] T006 [P] Configure Prettier formatting rules in .prettierrc
- [x] T007 [P] Configure Jest with 90% coverage thresholds in jest.config.js
- [x] T008 [P] Configure Playwright for E2E tests in playwright.config.ts
- [x] T009 [P] Create test setup file in tests/setupTests.ts
- [x] T010 [P] Configure Next.js settings in next.config.js
- [x] T011 [P] Add npm scripts (dev, build, test, test:coverage, test:e2e, lint, format, type-check) in package.json
- [x] T012 Create project folder structure per plan.md (src/, tests/, e2e/)

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETED

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Common Types & Constants

- [x] T013 [P] Create common types file in src/types/common.types.ts
- [x] T014 [P] Define InvestmentInput, InvestmentResult, InvestmentPeriod types in src/domain/investment/investment.types.ts
- [x] T015 [P] Define DebtInput, AmortizationSchedule, AmortizationPayment, Prepayment, PrepaymentResult types in src/domain/debt/debt.types.ts
- [x] T016 [P] Define ThemeMode, MenuItem, ValidationErrors, FormState types in src/types/common.types.ts
- [x] T017 [P] Define numeric constraints (INPUT_CONSTRAINTS) in src/types/common.types.ts

### Utility Services

- [x] T018 [P] Implement money formatting utilities in src/utils/money.ts
- [x] T019 [P] Implement math utilities (rounding, clamping) in src/utils/math.ts
- [x] T020 [P] Implement validation utilities in src/utils/validation.ts

### Tests for Utilities

- [x] T021 [P] Unit tests for money utilities in tests/unit/utils/money.test.ts
- [x] T022 [P] Unit tests for math utilities in tests/unit/utils/math.test.ts
- [x] T023 [P] Unit tests for validation utilities in tests/unit/utils/validation.test.ts

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Welcome Experience and Navigation (Priority: P1) 🎯 MVP

**Goal**: Provide welcoming home page and responsive navigation across all devices

**Independent Test**: Load application, verify home page displays correctly, test navigation links work, verify menu adapts to mobile/tablet/desktop screen sizes

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **Constitution Requirement: Tests are mandatory to maintain 90% code coverage**

- [x] T024 [P] [US1] E2E test for home page loading and content in e2e/navigation.spec.ts
- [x] T025 [P] [US1] E2E test for navigation links and active page indication in e2e/navigation.spec.ts
- [x] T026 [P] [US1] E2E test for responsive menu behavior (mobile vs desktop) in e2e/navigation.spec.ts
- [x] T027 [P] [US1] Unit tests for useResponsiveMenu hook in tests/unit/hooks/useResponsiveMenu.test.ts

### Implementation for User Story 1

- [x] T028 [P] [US1] Create useResponsiveMenu hook for menu state management in src/hooks/useResponsiveMenu.ts
- [x] T029 [P] [US1] Create AppLayout component in src/components/layout/AppLayout.tsx
- [x] T030 [P] [US1] Create AppHeader component with navigation in src/components/layout/AppHeader.tsx
- [x] T031 [P] [US1] Create AppMenu component (responsive drawer/horizontal) in src/components/layout/AppMenu.tsx
- [x] T032 [P] [US1] Create SectionContainer component for page sections in src/components/common/SectionContainer.tsx
- [x] T033 [US1] Create root layout with AppLayout in src/app/layout.tsx
- [x] T034 [US1] Create home page with welcome content in src/app/page.tsx
- [x] T035 [US1] Add global styles in src/app/globals.css
- [x] T036 [P] [US1] Component test for AppLayout in tests/unit/components/AppLayout.test.tsx
- [x] T037 [P] [US1] Component test for AppHeader in tests/unit/components/AppHeader.test.tsx
- [x] T038 [P] [US1] Component test for AppMenu in tests/unit/components/AppMenu.test.tsx

**Checkpoint**: ✅ User Story 1 COMPLETED - Fully functional and testable independently

---

## Phase 4: User Story 2 - Investment Profitability Projection (Priority: P2)

**Goal**: Enable users to calculate investment growth with compound interest and view period-by-period breakdown

**Independent Test**: Navigate to Investment Simulator, enter valid parameters (e.g., $10,000 initial, $500 monthly, 5 years, 7% rate, monthly compounding), verify calculations are accurate and breakdown displays clearly

### Tests for User Story 2 (MANDATORY) ⚠️

- [x] T039 [P] [US2] Unit tests for investment formulas (FV principal, FV contributions, breakdown) in tests/unit/domain/investment.formulas.test.ts
- [x] T040 [P] [US2] Unit tests for investment service (calculateInvestmentProjection) in tests/unit/domain/investment.service.test.ts
- [x] T041 [P] [US2] Unit tests for useInvestmentSimulator hook in tests/unit/hooks/useInvestmentSimulator.test.tsx
- [x] T042 [P] [US2] Integration test for full investment calculation flow in tests/integration/investment-flow.test.tsx
- [x] T043 [P] [US2] E2E test for investment simulator (enter inputs, calculate, verify results) in e2e/investment.spec.ts

### Domain Layer for User Story 2

- [x] T044 [P] [US2] Implement compound interest formulas (FV principal, FV contributions) in src/domain/investment/investment.formulas.ts
- [x] T045 [P] [US2] Implement investment breakdown generator in src/domain/investment/investment.formulas.ts
- [x] T046 [US2] Implement calculateInvestmentProjection service in src/domain/investment/investment.service.ts

### UI Layer for User Story 2

- [x] T047 [P] [US2] Create NumberInput common component in src/components/common/NumberInput.tsx
- [x] T048 [P] [US2] Create SelectField common component in src/components/common/SelectField.tsx
- [x] T049 [P] [US2] Create ResultCard common component in src/components/common/ResultCard.tsx
- [x] T050 [US2] Create InvestmentForm component in src/features/investment/InvestmentForm.tsx
- [x] T051 [US2] Create InvestmentBreakdownTable component in src/features/investment/InvestmentBreakdownTable.tsx
- [x] T052 [US2] Create InvestmentResults component in src/features/investment/InvestmentResults.tsx
- [x] T053 [P] [US2] Component tests for NumberInput in tests/unit/components/NumberInput.test.tsx
- [x] T054 [P] [US2] Component tests for SelectField in tests/unit/components/SelectField.test.tsx
- [x] T055 [P] [US2] Component tests for ResultCard in tests/unit/components/ResultCard.test.tsx

### Hooks & Orchestration for User Story 2

- [x] T056 [US2] Create investment mapper (domain results to UI format) - Not needed, results are already in appropriate format
- [x] T057 [US2] Create useInvestmentSimulator hook in src/features/investment/useInvestmentSimulator.ts

### Page for User Story 2

- [x] T058 [US2] Create investment simulator page in src/app/investment/page.tsx
- [x] T059 [US2] Add navigation link for Investment in AppMenu (update src/components/layout/AppMenu.tsx)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Debt Interest and Prepayment Analysis (Priority: P3)

**Goal**: Enable users to calculate loan amortization and simulate prepayments with comparison between scenarios

**Independent Test**: Navigate to Debt Simulator, enter valid loan parameters (e.g., $200,000 loan, 5% interest, 30 years, monthly payments), simulate prepayment (e.g., $10,000 in month 12, reduce term), verify calculations and comparison are clear

### Tests for User Story 3 (MANDATORY) ⚠️

- [x] T060 [P] [US3] Unit tests for amortization formulas (monthly payment, payment breakdown, schedule generation) in tests/unit/domain/amortization.formulas.test.ts
- [x] T061 [P] [US3] Unit tests for prepayment formulas (reduce-term, reduce-payment, interest savings) in tests/unit/domain/prepayment.formulas.test.ts
- [x] T062 [P] [US3] Unit tests for debt service (calculateAmortizationSchedule, applyPrepayments) in tests/unit/domain/debt.service.test.ts
- [x] T063 [P] [US3] Unit tests for useDebtSimulator hook in tests/unit/hooks/useDebtSimulator.test.tsx
- [x] T064 [P] [US3] Integration test for full debt calculation flow with prepayments in tests/integration/debt-flow.test.tsx
- [x] T065 [P] [US3] E2E test for debt simulator (enter loan, add prepayment, verify comparison) in e2e/debt.spec.ts

### Domain Layer for User Story 3

- [x] T066 [P] [US3] Implement amortization formulas (monthly payment, payment breakdown) in src/domain/debt/amortization.formulas.ts
- [x] T067 [P] [US3] Implement amortization schedule generator in src/domain/debt/amortization.formulas.ts
- [x] T068 [P] [US3] Implement prepayment formulas (reduce-term strategy) in src/domain/debt/prepayment.formulas.ts
- [x] T069 [P] [US3] Implement prepayment formulas (reduce-payment strategy) in src/domain/debt/prepayment.formulas.ts
- [x] T070 [P] [US3] Implement interest savings calculator in src/domain/debt/prepayment.formulas.ts
- [x] T071 [P] [US3] Implement prepayment validation in src/domain/debt/prepayment.formulas.ts
- [x] T072 [US3] Implement calculateAmortizationSchedule service in src/domain/debt/debt.service.ts
- [x] T073 [US3] Implement applyPrepayments service in src/domain/debt/debt.service.ts

### UI Layer for User Story 3

- [x] T074 [US3] Create DebtForm component in src/features/debt/DebtForm.tsx
- [x] T075 [US3] Create PrepaymentForm component in src/features/debt/PrepaymentForm.tsx
- [x] T076 [US3] Create PrepaymentList component in src/features/debt/PrepaymentList.tsx
- [x] T077 [US3] Create AmortizationTable component in src/features/debt/AmortizationTable.tsx
- [x] T078 [US3] Create ComparisonCard component in src/features/debt/ComparisonCard.tsx
- [x] T079 [US3] Create DebtResults component in src/features/debt/DebtResults.tsx

### Hooks & Orchestration for User Story 3

- [x] T080 [US3] Create debt mapper (domain results to UI format) - Not needed, results are already in appropriate format
- [x] T081 [US3] Create useDebtSimulator hook in src/features/debt/useDebtSimulator.ts

### Page for User Story 3

- [x] T082 [US3] Create debt simulator page in src/app/debt/page.tsx
- [x] T083 [US3] Add navigation link for Debt in AppHeader (update src/components/layout/AppHeader.tsx)

**Checkpoint**: All user stories (1, 2, 3) should now be independently functional

---

## Phase 6: User Story 4 - Theme Customization (Priority: P4)

**Goal**: Enable users to switch between light and dark themes with instant application-wide updates and localStorage persistence

**Independent Test**: Click theme toggle button, verify all pages and components adapt correctly to both light and dark themes with appropriate colors and contrast

### Tests for User Story 4 (MANDATORY) ⚠️

- [x] T084 [P] [US4] Unit tests for useThemeMode hook (toggle, persistence) in tests/unit/hooks/useThemeMode.test.ts
- [x] T085 [P] [US4] Integration test for theme switching across components in tests/integration/theme-switching.test.tsx
- [x] T086 [P] [US4] E2E test for theme toggle and persistence in e2e/theme.spec.ts

### Theme Infrastructure for User Story 4

- [x] T087 [P] [US4] Define calming color palette for light theme in src/theme/palette.ts
- [x] T088 [P] [US4] Define calming color palette for dark theme in src/theme/palette.ts
- [x] T089 [P] [US4] Define typography configuration in src/theme/typography.ts
- [x] T090 [US4] Create lightTheme configuration in src/theme/lightTheme.ts
- [x] T091 [US4] Create darkTheme configuration in src/theme/darkTheme.ts
- [x] T092 [US4] Create useThemeMode hook with localStorage persistence in src/hooks/useThemeMode.ts
- [x] T093 [US4] Create ThemeProvider component in src/theme/ThemeProvider.tsx

### UI Components for User Story 4

- [x] T094 [US4] Create ThemeToggle button component in src/components/layout/ThemeToggle.tsx
- [x] T095 [US4] Integrate ThemeToggle into AppHeader (update src/components/layout/AppHeader.tsx)
- [x] T096 [US4] Wrap root layout with ThemeProvider (update src/app/layout.tsx)

**Checkpoint**: All user stories (1-4) should now be complete with theme support

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [x] T097 [P] Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx
- [x] T098 [P] Create EmptyState component in src/components/common/EmptyState.tsx
- [x] T099 [P] Add loading states to InvestmentForm during calculation (update src/features/investment/InvestmentForm.tsx)
- [x] T100 [P] Add loading states to DebtForm during calculation (update src/features/debt/DebtForm.tsx)
- [x] T101 [P] Add empty states to InvestmentResults (update src/app/investment/page.tsx with EmptyState)
- [x] T102 [P] Add empty states to DebtResults (update src/app/debt/page.tsx with EmptyState)
- [x] T103 [P] Verify accessibility (keyboard nav, ARIA labels, focus management) across all pages
- [x] T104 [P] Test responsive design on mobile (375px), tablet, and desktop viewports
- [x] T105 [P] Test both light and dark themes on all pages
- [x] T106 Run full test suite and ensure 90% coverage maintained
- [x] T107 Run ESLint and fix any linting errors
- [x] T108 Run Prettier and format all code
- [x] T109 Run TypeScript type-check and fix any type errors
- [x] T110 Verify Core Web Vitals targets (FCP < 3s, CLS < 0.1, 60 FPS)
- [x] T111 Create README.md with project overview and setup instructions
- [x] T112 Update quickstart.md if any setup steps changed during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 4 (P4)**: Can start after User Stories 1-3 (needs pages to apply theming to)

### Within Each User Story

- Tests (MANDATORY) MUST be written and FAIL before implementation
- Domain layer (types, formulas, services) before UI layer
- Common components before feature-specific components
- Feature components before hooks
- Hooks before pages
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1-3 can start in parallel (if team capacity allows)
- All tests within a user story marked [P] can run in parallel
- Domain layer tasks within a story marked [P] can run in parallel
- UI components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task T039: "Unit tests for investment formulas in tests/unit/domain/investment.formulas.test.ts"
Task T040: "Unit tests for investment service in tests/unit/domain/investment.service.test.ts"
Task T041: "Unit tests for useInvestmentSimulator hook in tests/unit/hooks/useInvestmentSimulator.test.ts"
Task T042: "Integration test for investment flow in tests/integration/investment-flow.test.tsx"
Task T043: "E2E test for investment simulator in e2e/investment.spec.ts"

# Launch all domain layer tasks for User Story 2 together:
Task T044: "Implement compound interest formulas in src/domain/investment/investment.formulas.ts"
Task T045: "Implement investment breakdown generator in src/domain/investment/investment.formulas.ts"

# Launch all common UI components for User Story 2 together:
Task T047: "Create NumberInput component in src/components/common/NumberInput.tsx"
Task T048: "Create SelectField component in src/components/common/SelectField.tsx"
Task T049: "Create ResultCard component in src/components/common/ResultCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (can start in parallel with US1 if foundations are shared)
   - Developer C: User Story 3 (can start in parallel)
3. Stories complete and integrate independently
4. Developer D (or A/B/C after completion): User Story 4

---

## Task Summary

**Total Tasks**: 112 tasks
- **Phase 1 (Setup)**: 12 tasks
- **Phase 2 (Foundational)**: 11 tasks
- **Phase 3 (User Story 1)**: 15 tasks (5 tests + 10 implementation)
- **Phase 4 (User Story 2)**: 21 tasks (5 tests + 16 implementation)
- **Phase 5 (User Story 3)**: 24 tasks (6 tests + 18 implementation)
- **Phase 6 (User Story 4)**: 13 tasks (3 tests + 10 implementation)
- **Phase 7 (Polish)**: 16 tasks

**Test Tasks**: 19 explicit test tasks (17% of total)
**Parallel Opportunities**: 67 tasks marked [P] (60% parallelizable)

**Independent Test Criteria**:
- **US1**: Load app, verify home page, test navigation, test responsive menu
- **US2**: Enter investment params, calculate, verify results and breakdown accuracy
- **US3**: Enter loan params, add prepayment, verify calculation and comparison
- **US4**: Toggle theme, verify all pages adapt correctly to light/dark modes

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests MUST be written first and FAIL before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Maintain 90% code coverage throughout implementation
- Run `npm run test:coverage` frequently to verify coverage
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
