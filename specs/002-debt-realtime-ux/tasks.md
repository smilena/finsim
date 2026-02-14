# Tasks: Debt Simulator Real-Time UX and Terminology Improvements

**Input**: Design documents from `/specs/002-debt-realtime-ux/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY per project constitution. All features must include appropriate unit, integration, and E2E tests to maintain 90% code coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths: `src/features/debt/`, `src/domain/debt/`, `src/hooks/`, `src/app/`

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before User Story 1. No user story work can begin until this phase is complete.

- [x] T001 Create `useDebounce` hook in `src/hooks/useDebounce.ts` with generic signature `useDebounce<T>(value: T, delay: number): T` (300–400 ms for debt inputs)
- [x] T002 [P] Unit test for `useDebounce` in `tests/unit/hooks/useDebounce.test.ts` (verify debounced value updates after delay, no updates during rapid changes)

**Checkpoint**: useDebounce ready for use in useDebtSimulator

---

## Phase 2: User Story 1 - Real-Time Calculation Updates (Priority: P1) 🎯 MVP

**Goal**: Results appear automatically when minimum data is valid; any change to loan params or capital payments updates results within 1 second—without any Calculate button.

**Independent Test**: Enter loan parameters in Debt Simulator; verify results appear automatically when valid; change amount/rate/term/add abono; results update within 1 second.

### Tests for User Story 1 (MANDATORY)

- [x] T003 [P] [US1] Update `useDebtSimulator` unit tests for auto-calculate in `tests/unit/hooks/useDebtSimulator.test.tsx` (remove calculate() tests; add auto-calc on valid inputs, debounce behavior, immediate recalc on prepayment add/remove)
- [x] T004 [P] [US1] Update integration test for debt real-time flow in `tests/integration/debt-flow.test.tsx` (verify results appear without button, change inputs triggers update)
- [x] T005 [P] [US1] Update E2E test for debt real-time in `e2e/debt.spec.ts` (no Calculate button, results auto-display, change param updates results)

### Implementation for User Story 1

- [x] T006 [US1] Refactor `useDebtSimulator` to auto-calculate on debounced inputs and prepayments in `src/features/debt/useDebtSimulator.ts` (remove `calculate`; add `useEffect` with useDebounce + `applyPrepayments`; prepayment add/remove triggers immediate recalc)
- [x] T007 [US1] Remove Calculate button and `onCalculate` prop from `DebtForm` in `src/features/debt/DebtForm.tsx` (remove submit button, keep onInputChange and onReset; update help text if needed)
- [x] T008 [US1] Update debt page to remove `onCalculate` and pass only updated props in `src/app/debt/page.tsx`

**Checkpoint**: User Story 1 complete—real-time updates without Calculate button

---

## Phase 3: User Story 2 - Terminology: Abono a Capital (Priority: P2)

**Goal**: All user-facing text uses "Abono a capital" (or "Abonos a capital") instead of "prepago" or "pago prepago".

**Independent Test**: Navigate Debt Simulator; verify all labels, buttons, headers use "Abono a capital" terminology.

### Tests for User Story 2 (MANDATORY)

- [x] T009 [P] [US2] Update component tests for terminology in `tests/unit/components/` or relevant files (PrepaymentForm, PrepaymentList assertions for "Abono a capital" labels)

### Implementation for User Story 2

- [x] T010 [P] [US2] Update PrepaymentForm labels in `src/features/debt/PrepaymentForm.tsx` (Estrategia de abono a capital, Mes del abono, Monto del abono, Agregar abono a capital)
- [x] T011 [P] [US2] Update PrepaymentList labels in `src/features/debt/PrepaymentList.tsx` (Abonos a capital registrados, Abono en mes, Eliminar abono aria-label)
- [x] T012 [P] [US2] Update ComparisonCard label in `src/features/debt/ComparisonCard.tsx` (sin abonos a capital)
- [x] T013 [P] [US2] Update DebtResults subtitle in `src/features/debt/DebtResults.tsx` (Sin abonos a capital)
- [x] T014 [P] [US2] Update debt page copy in `src/app/debt/page.tsx` (prepagos → abonos a capital, Simulación de Abonos a Capital, help text)
- [x] T015 [P] [US2] Update home page and layout in `src/app/page.tsx` and `src/app/layout.tsx` (prepagos → abonos a capital)
- [x] T016 [US2] Update prepayment formula error messages in `src/domain/debt/prepayment.formulas.ts` (prepago → abono a capital in validatePrepayment messages)

**Checkpoint**: User Story 2 complete—zero user-facing "prepago" instances

---

## Phase 4: User Story 3 - Debt Formula Verification (Priority: P3)

**Goal**: Amortization and prepayment formulas produce results consistent with industry-standard calculations.

**Independent Test**: Run unit tests with reference scenarios ($200k at 5% for 360 months ≈ $1,073.64; reduce-term and reduce-payment scenarios).

### Tests for User Story 3 (MANDATORY)

- [x] T017 [P] [US3] Add amortization formula reference tests in `tests/unit/domain/amortization.formulas.test.ts` (standard $200k at 5% for 360 months → monthly payment ≈ $1,073.64; schedule totals consistent; final balance zero)
- [x] T018 [P] [US3] Add prepayment formula reference tests in `tests/unit/domain/prepayment.formulas.test.ts` (reduce-term: verify term reduction and interest savings; reduce-payment: verify new monthly payment and same term)

### Implementation for User Story 3

- [x] T019 [US3] Verify formulas produce correct results per reference scenarios; fix any discrepancies in `src/domain/debt/amortization.formulas.ts` or `src/domain/debt/prepayment.formulas.ts` if needed

**Checkpoint**: User Story 3 complete—formulas validated against reference scenarios

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Verify loading indicator shows during calculation in `src/features/debt/useDebtSimulator.ts` and `src/features/debt/DebtForm.tsx` (isCalculating used; UI feedback for long scenarios)
- [x] T021 Run full test suite and ensure 90% coverage maintained: `npm run test:coverage`
- [x] T022 Run E2E tests: `npm run test:e2e`
- [x] T023 [P] Run quickstart.md validation (verify setup and run instructions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies—can start immediately
- **Phase 2 (US1)**: Depends on Phase 1 (useDebounce)
- **Phase 3 (US2)**: Can run in parallel with US1 after Phase 1; no dependency on US1
- **Phase 4 (US3)**: Can run in parallel with US1/US2 after Phase 1; no dependency on US1/US2
- **Phase 5 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 1 (useDebounce)
- **User Story 2 (P2)**: Independent—can start after Phase 1 ( terminology only)
- **User Story 3 (P3)**: Independent—can start after Phase 1 (formula tests only)

### Within Each User Story

- Tests MUST be written/updated before or alongside implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T004, T005 can run in parallel (within Phase 2)
- T010–T015 can run in parallel (US2 implementation)
- T017, T018 can run in parallel (US3 tests)
- US2 and US3 can be worked on in parallel by different developers after Phase 1

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Update useDebtSimulator unit tests in tests/unit/hooks/useDebtSimulator.test.tsx"
Task: "Update integration test in tests/integration/debt-flow.test.tsx"
Task: "Update E2E test in e2e/debt.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Launch all terminology updates (different files):
Task: "Update PrepaymentForm labels in src/features/debt/PrepaymentForm.tsx"
Task: "Update PrepaymentList labels in src/features/debt/PrepaymentList.tsx"
Task: "Update ComparisonCard in src/features/debt/ComparisonCard.tsx"
Task: "Update DebtResults in src/features/debt/DebtResults.tsx"
Task: "Update debt page in src/app/debt/page.tsx"
Task: "Update home page and layout in src/app/page.tsx, src/app/layout.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (useDebounce)
2. Complete Phase 2: User Story 1 (real-time + remove Calculate button)
3. **STOP and VALIDATE**: Test real-time behavior independently
4. Deploy/demo if ready

### Incremental Delivery

1. Add Phase 1 → Foundation ready
2. Add User Story 1 → Test independently → MVP (real-time UX)
3. Add User Story 2 → Test independently → Terminology complete
4. Add User Story 3 → Test independently → Formulas verified
5. Polish → Full feature complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 together
2. After Phase 1:
   - Developer A: User Story 1 (real-time)
   - Developer B: User Story 2 (terminology)
   - Developer C: User Story 3 (formula verification)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (or update tests to pass after implementation)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
