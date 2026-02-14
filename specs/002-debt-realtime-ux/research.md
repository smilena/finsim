# Research: Debt Simulator Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Investigate debouncing, real-time validation, and formula verification strategies

---

## 1. Debouncing for Real-Time Input

### Decision

Use a custom `useDebounce` hook to debounce loan inputs (amount, rate, term) with a **300–400 ms** delay before triggering recalculation.

### Rationale

- **FR-004**: Results must update within 1 second of last input change
- Rapid typing in multiple fields could cause excessive recalculations (e.g., 600-month schedule generation)
- 300–400 ms balances responsiveness (feels instant) with CPU efficiency
- Industry standard: 300–500 ms for form inputs that trigger expensive calculations

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| No debounce | Too many recalculations on rapid typing; poor UX on slow devices |
| 500–600 ms debounce | Feels slightly sluggish; spec prefers < 1 s response |
| Throttle instead of debounce | Throttle fires during typing; debounce waits until user pauses, which is preferable for validation + calculation |
| Lodash debounce | Adds dependency; native `useEffect` + `setTimeout` is sufficient; project prefers minimal deps |

### Implementation Notes

- Create `src/hooks/useDebounce.ts` (generic `useDebounce<T>(value: T, delay: number): T`)
- Apply debounce to `inputs` (or derived validation state) before triggering calculation in `useDebtSimulator`
- Capital payments (add/remove/modify) trigger **immediate** recalculation (no debounce), since they are discrete actions, not continuous typing

---

## 2. When to Trigger Calculation

### Decision

Trigger calculation automatically when:

1. **Debounced inputs** are valid (amount > 0, rate ≥ 0, term > 0, valid frequency)
2. **Prepayments** change (add, remove, or modify)

### Rationale

- FR-001: Display results when minimum data is valid, without a Calculate button
- FR-002, FR-003: Update on any change to loan params or capital payments

### Implementation

- Use `useEffect` in `useDebtSimulator` with dependencies on debounced inputs and prepayments
- If validation fails, do not calculate; show validation errors instead
- If calculation throws (e.g., invalid prepayment), show error state

---

## 3. Validation During Real-Time Updates

### Decision

- Validate on blur and before calculation; do not block typing with inline errors for every keystroke
- Show validation errors when user leaves a field (blur) or when calculation is attempted with invalid data
- Invalid data during typing: show errors only for fields that have been touched/blurred

### Rationale

- Spec edge case: "Does the system show validation errors without breaking the UI?" — Yes, gracefully
- Avoid aggressive inline validation that interrupts typing (e.g., "Invalid" while user types "200")

### Implementation

- Reuse existing `validateDebtInput` and `validatePrepaymentInput` from `@/utils/validation`
- Do not run calculation if `Object.keys(validationErrors).length > 0`

---

## 4. Loading Indicator for Long Calculations

### Decision

Show a loading indicator (e.g., `LoadingSpinner` or disabled state) when calculation is in progress, especially for scenarios with 300+ months or multiple prepayments.

### Rationale

- FR-008: Provide clear feedback when calculation may take longer
- Spec edge case: "Is a loading indicator shown?" for 600 months — Yes

### Implementation

- Use existing `isCalculating` state in `useDebtSimulator`
- Set `isCalculating = true` at start of calculation, `false` at end
- Calculations are synchronous but wrapped in `setTimeout(0)` or `requestAnimationFrame` to allow UI to render loading state first
- For very long schedules (e.g., 600 months), consider `setTimeout` with small delay to yield to main thread

---

## 5. Amortization Formula Verification

### Decision

Verify formulas against known reference scenarios. The existing implementation already uses the standard formula **M = P[r(1+r)^n]/[(1+r)^n-1]**.

### Rationale

- FR-006, FR-007: Formulas must be consistent with industry standards
- SC-003: Pass validation against at least 3 reference scenarios

### Reference Scenarios

| Scenario | Parameters | Expected (approx) | Source |
|----------|------------|-------------------|--------|
| Standard 30-year | $200,000 at 5% for 360 months | Monthly payment ≈ $1,073.64 | Common amortization calculators |
| Reduce-term prepayment | $10,000 in month 12, reduce-term | Term reduction, interest savings | Compare with Bankrate / NerdWallet |
| Reduce-payment prepayment | $10,000 in month 12, reduce-payment | New lower payment, same term | Compare with reference |

### Implementation

- Add unit tests in `amortization.formulas.test.ts` and `prepayment.formulas.test.ts` with known inputs/outputs
- Tolerance: round to cents; allow ±$0.01 for cumulative rounding

---

## 6. Multiple Prepayments

### Decision

**Phase 1 (this feature)**: Keep current limitation of handling only the **first** prepayment in `debt.service.ts`. The spec explicitly mentions "add, modify, remove" capital payments — the UI supports multiple entries, but the domain currently processes only the first. Extending to multiple prepayments is a separate enhancement.

**Rationale**: The spec focuses on real-time UX and terminology. Supporting multiple prepayments mathematically requires iterative recalculation (each prepayment affects the schedule for subsequent months). The current implementation already satisfies "add, modify, remove" for a single prepayment with real-time updates. Document this as a known limitation for future work.

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Implement full multi-prepayment now | Increases scope; formulas already support one; iterative logic is non-trivial |
| Restrict UI to one prepayment | Reduces flexibility; spec says "add one or more"; we can show multiple in list but only first affects calculation until enhanced |

---

## 7. Terminology: "Abono a capital"

### Decision

Replace all user-facing instances of "prepago", "pago prepago", "Prepago" with "Abono a capital" (singular) or "Abonos a capital" (plural).

### Rationale

- FR-005, User Story 2: "Abono a capital" is more familiar for Spanish-speaking users

### Locations to Update (from grep)

| File | Current | New |
|------|---------|-----|
| PrepaymentList.tsx | "Prepagos Registrados", "Prepago en mes", "Eliminar prepago" | "Abonos a capital registrados", "Abono en mes", "Eliminar abono" |
| PrepaymentForm.tsx | "Estrategia de Prepago", "Mes del Prepago", "Monto del Prepago", "Agregar Prepago" | "Estrategia de abono a capital", "Mes del abono", "Monto del abono", "Agregar abono a capital" |
| ComparisonCard.tsx | "sin prepagos" | "sin abonos a capital" |
| debt/page.tsx | "prepagos a capital", "prepagos" | "abonos a capital" |
| page.tsx (home) | "prepagos a capital" | "abonos a capital" |
| layout.tsx | "prepagos" | "abonos a capital" |
| DebtResults.tsx | "Sin prepagos" | "Sin abonos a capital" |
| prepayment.formulas.ts | Error messages with "prepago" | "abono a capital" |

**Internal code** (e.g., `Prepayment` type, `prepayments` variable names): Keep as-is to avoid widespread refactors. Only user-facing strings change.
