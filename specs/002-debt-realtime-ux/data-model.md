# Data Model: Debt Simulator Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Define data structures and state; extends 001-financial-simulators

---

## Inheritance from 001

This feature **reuses** the debt domain model from `specs/001-financial-simulators/data-model.md`:

- **DebtInput**: loanAmount, annualInterestRate, termMonths, paymentFrequency
- **Prepayment**: monthNumber, amount, strategy (reduce-term | reduce-payment)
- **AmortizationSchedule**: monthlyPayment, totalPrincipal, totalInterest, schedule, etc.
- **PrepaymentResult**: baseScenario, prepaymentScenario, interestSavings, etc.

No changes to these TypeScript interfaces. Internal code continues to use `Prepayment` and `prepayments`; only **user-facing strings** change to "Abono a capital".

---

## New or Modified State

### 1. useDebtSimulator Hook State

| State | Type | Purpose |
|-------|------|---------|
| `inputs` | `DebtInput` | Current loan parameters (unchanged) |
| `prepayments` | `Prepayment[]` | List of capital payments (unchanged) |
| `results` | `PrepaymentResult \| null` | Calculated results (unchanged) |
| `errors` | `ValidationErrors` | Validation errors (unchanged) |
| `isCalculating` | `boolean` | Loading indicator (unchanged) |
| ~~`calculate`~~ | — | **Removed**; calculation is automatic |
| `updateInput` | `(field, value) => void` | Updates input; triggers debounced recalc |
| `addPrepayment` | `(p: Prepayment) => void` | Adds payment; triggers **immediate** recalc |
| `removePrepayment` | `(index) => void` | Removes payment; triggers **immediate** recalc |
| `reset` | `() => void` | Resets form (unchanged) |

**New internal state** (not exposed):

- Debounced `inputs` (or derived "valid inputs" flag) used as dependency for `useEffect` that runs calculation

### 2. Calculation Trigger Conditions

```
CALCULATE when:
  - debouncedInputs are valid (amount > 0, rate >= 0, term > 0, valid frequency)
  - AND (no validation errors on inputs)
  - AND (prepayments are valid if any, or prepayments.length === 0)

DO NOT CALCULATE when:
  - Validation errors exist
  - Inputs are incomplete (e.g., empty amount)
```

### 3. Terminology Mapping (UI Only)

| Internal Name | User-Facing Label (Spanish) |
|---------------|-----------------------------|
| Prepayment | Abono a capital |
| Prepayments (plural) | Abonos a capital |
| prepayment.strategy | Estrategia de abono a capital |
| "Agregar Prepago" | Agregar abono a capital |
| "Sin prepagos" | Sin abonos a capital |
| "Prepagos Registrados" | Abonos a capital registrados |

---

## Validation Rules (unchanged)

From `@/utils/validation`:

- **DebtInput**: loanAmount > 0, annualInterestRate >= 0, termMonths > 0, paymentFrequency in ['monthly','bi-weekly']
- **Prepayment**: monthNumber in [1, termMonths], amount > 0, amount <= remaining balance at that month

---

## Entity Relationship (unchanged)

```
DebtInput ──► AmortizationSchedule (base scenario)
     │
     └── Prepayment[] ──► PrepaymentResult (base vs. with prepayments)
```
