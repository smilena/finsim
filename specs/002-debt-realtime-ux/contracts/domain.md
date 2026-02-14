# Domain Contracts: Debt Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Domain contract changes (error messages only)

---

## 1. Prepayment Formulas

**File**: `src/domain/debt/prepayment.formulas.ts`

### validatePrepayment Error Messages

| Current | New |
|---------|-----|
| "El mes del prepago debe estar dentro del plazo del préstamo" | "El mes del abono a capital debe estar dentro del plazo del préstamo" |
| "El prepago no puede exceder el saldo restante ($X)" | "El abono a capital no puede exceder el saldo restante ($X)" |
| "El monto del prepago debe ser positivo" | "El monto del abono a capital debe ser positivo" |

---

## 2. Other Domain Modules

- **amortization.formulas.ts**: No changes
- **debt.service.ts**: No changes (internal logic)
- **debt.types.ts**: No changes (Prepayment, etc. remain as-is)

---

## 3. Formula Verification (Tests)

Add unit tests for:

1. **Standard amortization**: $200,000 at 5% for 360 months → monthly payment ≈ $1,073.64
2. **Reduce-term prepayment**: Verify term reduction and interest savings
3. **Reduce-payment prepayment**: Verify new monthly payment and same term
