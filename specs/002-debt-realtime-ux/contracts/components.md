# Component Contracts: Debt Real-Time UX

**Date**: 2026-02-10  
**Feature**: Debt Simulator Real-Time UX and Terminology Improvements  
**Purpose**: Define component contract changes (terminology, removed Calculate button)

---

## 1. DebtForm

**File**: `src/features/debt/DebtForm.tsx`

### Changes

| Aspect | 001 | 002 |
|--------|-----|-----|
| Calculate button | Present ("Calcular Amortización") | **Removed** |
| `onCalculate` prop | Required | **Removed** |
| Help text | "Haz clic en Calcular Amortización..." | "Los resultados se actualizan en tiempo real cuando los datos son válidos." |

### Props (Updated)

```typescript
export interface DebtFormProps {
  inputs: DebtInput;
  errors: ValidationErrors;
  isCalculating?: boolean;
  onInputChange: (field: keyof DebtInput, value: string | number) => void;
  onReset: () => void;
  // onCalculate REMOVED - no Calculate button
}
```

---

## 2. PrepaymentForm

**File**: `src/features/debt/PrepaymentForm.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "Estrategia de Prepago" | "Estrategia de abono a capital" |
| "Mes del Prepago" | "Mes del abono" |
| "Monto del Prepago" | "Monto del abono" |
| "Agregar Prepago" | "Agregar abono a capital" |

---

## 3. PrepaymentList

**File**: `src/features/debt/PrepaymentList.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "Prepagos Registrados (n)" | "Abonos a capital registrados (n)" |
| "Prepago en mes X: $Y" | "Abono en mes X: $Y" |
| "Eliminar prepago" (aria-label) | "Eliminar abono" |

---

## 4. ComparisonCard

**File**: `src/features/debt/ComparisonCard.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "Interés Total (sin prepagos)" | "Interés Total (sin abonos a capital)" |

---

## 5. DebtResults

**File**: `src/features/debt/DebtResults.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "Sin prepagos" (subtitle) | "Sin abonos a capital" |

---

## 6. Debt Page

**File**: `src/app/debt/page.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "prepagos a capital" | "abonos a capital" |
| "prepagos" | "abonos a capital" |
| "Simulación de Prepagos a Capital" | "Simulación de Abonos a Capital" |
| "Agrega uno o más prepagos" | "Agrega uno o más abonos a capital" |
| Help text referencing "Calcular Amortización" | "Los resultados se actualizan automáticamente cuando ingresas los datos del préstamo." |

---

## 7. Home Page & Layout

**Files**: `src/app/page.tsx`, `src/app/layout.tsx`

### Terminology Changes

| Current | New |
|---------|-----|
| "prepagos a capital" | "abonos a capital" |
| "prepagos" (meta description) | "abonos a capital" |
