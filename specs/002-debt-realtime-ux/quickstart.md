# Quickstart Guide: Debt Simulator Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Development setup and workflow for this feature

---

## Prerequisites

Same as base project. See `specs/001-financial-simulators/quickstart.md` for:
- Node.js 18+, npm 9+, Git
- VS Code extensions (ESLint, Prettier, TypeScript)

---

## Initial Setup

### 1. Checkout Feature Branch

```bash
cd finanzas-personales
git checkout 002-debt-realtime-ux
```

### 2. Install Dependencies (if not already done)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000/debt to test the Debt Simulator.

---

## Feature-Specific Development

### Key Files to Modify

| File | Purpose |
|------|---------|
| `src/hooks/useDebounce.ts` | **New** - debounce utility for inputs |
| `src/features/debt/useDebtSimulator.ts` | Auto-calculate, remove `calculate` |
| `src/features/debt/DebtForm.tsx` | Remove Calculate button, update help text |
| `src/features/debt/PrepaymentForm.tsx` | Terminology: "Abono a capital" |
| `src/features/debt/PrepaymentList.tsx` | Terminology: "Abonos a capital" |
| `src/features/debt/ComparisonCard.tsx` | Terminology |
| `src/features/debt/DebtResults.tsx` | Terminology |
| `src/app/debt/page.tsx` | Page copy and help text |
| `src/app/page.tsx` | Home hero copy |
| `src/app/layout.tsx` | Meta description |
| `src/domain/debt/prepayment.formulas.ts` | Error message terminology |

### Run Tests

```bash
# Unit tests (including debt formulas)
npm run test -- debt

# Coverage
npm run test:coverage

# E2E (after implementation)
npm run test:e2e -- debt
```

### Verify Real-Time Behavior

1. Go to `/debt`
2. Enter loan amount, rate, term (defaults pre-filled)
3. **Expect**: Results appear automatically (no Calculate button)
4. Change amount → results update within ~1 second
5. Add abono a capital → comparison updates immediately
6. Remove abono → reverts to base scenario

---

## Specs Reference

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/](./contracts/)
