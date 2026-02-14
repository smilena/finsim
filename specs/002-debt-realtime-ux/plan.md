# Implementation Plan: Debt Simulator Real-Time UX and Terminology Improvements

**Branch**: `002-debt-realtime-ux` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-debt-realtime-ux/spec.md`

## Summary

Refactor the Debt Simulator to provide real-time calculation updates instead of a manual "Calculate" flow, replace "prepago" terminology with "Abono a capital" throughout the UI, and verify amortization formulas against industry standards.

**Technical Approach**:
- Remove `calculate` button and trigger results automatically when minimum data (amount, rate, term, frequency) is valid
- Implement debounced real-time recalculation (300–500 ms) for rapid input changes
- Extend `useDebtSimulator` to auto-calculate on input/prepayment changes via `useEffect`
- Replace all user-facing "prepago"/"pago prepago" with "Abono a capital"
- Validate formulas against reference scenarios (standard amortization, reduce-term, reduce-payment)
- Add loading indicator for long-running calculations (e.g., 600 months)

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router, latest stable)  
**Primary Dependencies**:
- **Next.js 14+**: React framework with App Router
- **Material UI (MUI) v5+**: Sole UI component library
- **React 18+**: UI rendering
- **TypeScript 5.x**: Type safety with strict mode enabled

**Storage**: Browser local storage for theme preference only (no backend, no database)  
**Testing**:
- **Jest + React Testing Library**: Unit and integration tests
- **Playwright**: End-to-end tests for critical user flows
- **Coverage target**: 90% minimum (statements, branches, functions, lines)

**Target Platform**: Web browsers (modern Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile (responsive down to 375px)  
**Project Type**: Single-page web application (Next.js App Router with client-side calculations)  
**Performance Goals**:
- First Contentful Paint (FCP) < 3 seconds on 3G
- 60 FPS smooth interactions
- Cumulative Layout Shift (CLS) < 0.1
- Results update within 1 second of last input change (per FR-004)

**Constraints**:
- Client-side only (no backend API)
- No data persistence
- Must work offline after initial load
- Debounce/throttle to avoid excessive recalculations during rapid typing

**Scale/Scope**:
- Enhancement to existing Debt Simulator (src/features/debt/)
- 3 user stories (P1: Real-time, P2: Terminology, P3: Formula verification)
- Target: ~10 files modified, ~5 new test cases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Technology Stack Compliance:**
- [x] Next.js (latest stable) confirmed as framework ✅
- [x] TypeScript with `strict: true` in tsconfig.json ✅
- [x] Material UI (MUI) as sole UI component library ✅
- [x] Next.js best practices for state, routing, data fetching ✅

**Architecture & Code Quality:**
- [x] Clear separation: UI / Domain / Services / Infrastructure ✅
- [x] Business logic isolated from UI components ✅
- [x] All public APIs strongly typed and documented ✅

**Testing Requirements:**
- [x] Jest + React Testing Library configured ✅
- [x] Playwright configured for E2E tests ✅
- [x] 90% code coverage target established ✅
- [x] Test strategy covers unit, integration, and E2E ✅

**UX & Performance:**
- [x] Responsive and mobile-first design confirmed ✅
- [x] Accessibility requirements defined (WCAG AA) ✅
- [x] Performance targets defined (Core Web Vitals) ✅
- [x] Centralized MUI theming planned ✅

**Additional Gates:**
- [x] No complexity introduced without justification ✅
- [x] Definition of Done criteria understood by team ✅

**Overall Constitution Compliance**: ✅ **PASSED** - All gates satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-debt-realtime-ux/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Structure Decision**: Enhancement to existing Next.js web application. All changes are within `src/features/debt/`, `src/domain/debt/`, and related UI pages.

```text
src/
├── app/
│   ├── debt/page.tsx              # Debt page (labels, help text)
│   └── page.tsx                   # Home (hero copy)
├── domain/debt/
│   ├── amortization.formulas.ts   # Amortization formulas (verify)
│   ├── prepayment.formulas.ts     # Prepayment logic (error messages)
│   ├── debt.service.ts            # May extend for multiple prepayments
│   └── debt.types.ts              # Types (internal names unchanged for now)
├── features/debt/
│   ├── useDebtSimulator.ts        # Add auto-calculate, remove calculate()
│   ├── DebtForm.tsx               # Remove "Calcular" button
│   ├── DebtResults.tsx            # Labels
│   ├── PrepaymentForm.tsx         # → Abono a capital labels
│   ├── PrepaymentList.tsx         # → Abonos a capital labels
│   └── ComparisonCard.tsx         # Labels
└── utils/
    └── debounce.ts                # New: debounce utility (if not exists)
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
