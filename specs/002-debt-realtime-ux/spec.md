# Feature Specification: Debt Simulator Real-Time UX and Terminology Improvements

**Feature Branch**: `002-debt-realtime-ux`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: User description: "Revisar las formulas en deuda y mejora la experiencia para que se vea el cambio en tiempo real de los intereses pagados cambiando algún parametro, inclusive los abonos a capital. Cambiar el nombre pago prepago a Abono a capital"

## Clarifications

### Session 2026-02-10

- Q: ¿Cuándo debe mostrarse el primer resultado de amortización? ¿Se elimina el botón Calcular? → A: Eliminar el botón. Los resultados se actualizan en tiempo real cuando están los datos mínimos (monto, tasa, plazo) y también en cada cambio por abono a capital.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-Time Calculation Updates (Priority: P1)

A user is in the Debt Simulator analyzing their loan. There is no "Calculate" button: results appear automatically as soon as the minimum required data is valid (loan amount, interest rate, term, payment frequency). Any change to loan parameters or capital payments (add, modify, remove) triggers an immediate update of total interest paid, monthly payment, and comparison—creating a responsive, exploratory experience.

**Why this priority**: Real-time feedback is the core UX improvement. It transforms the simulator from a batch-oriented tool into an interactive exploration tool, significantly improving user understanding and engagement.

**Independent Test**: Can be fully tested by entering loan parameters in the Debt Simulator and verifying that results appear automatically when minimum data is valid, and that any change (loan amount, rate, term, or capital payment) updates the displayed results within 1 second—without any calculate button.

**Acceptance Scenarios**:

1. **Given** a user has entered the minimum required loan data (amount, rate, term, frequency), **When** all fields are valid, **Then** the system displays amortization results automatically without any calculate button
2. **Given** results are displayed, **When** the user changes the loan amount, **Then** the total interest, monthly payment, and schedule update within 1 second
3. **Given** results are displayed, **When** the user changes the annual interest rate or term, **Then** the displayed values update in real time
4. **Given** results are displayed, **When** the user adds a capital payment (abono a capital), **Then** the interest savings and comparison update immediately
5. **Given** the user has added one or more capital payments, **When** they modify the amount or month of any capital payment, **Then** the comparison and interest savings update in real time
6. **Given** the user removes a capital payment from the list, **When** the change is applied, **Then** the results revert to show the base scenario or remaining capital payments within 1 second

---

### User Story 2 - Terminology: Abono a Capital (Priority: P2)

A user encounters the debt simulator and sees consistent, clear terminology. The term "prepago" or "pago prepago" is replaced throughout the application with "Abono a capital" (capital payment), which is more familiar and intuitive for Spanish-speaking users when discussing extra payments toward loan principal.

**Why this priority**: Terminology affects clarity and trust. Users may not recognize "prepago" but understand "abono a capital" immediately. This is a content/UX change that can be implemented independently.

**Independent Test**: Can be fully tested by navigating through the Debt Simulator and verifying that all user-facing text uses "Abono a capital" (or "Abonos a capital" for plural) instead of "prepago" or "pago prepago"—including labels, buttons, section headers, and help text.

**Acceptance Scenarios**:

1. **Given** a user is on the Debt Simulator page, **When** they view the section for adding extra payments, **Then** the section title and labels use "Abono a capital" (or equivalent plural form)
2. **Given** a user views the form to add an extra payment, **When** they see the submit button, **Then** the button label reads "Agregar Abono a Capital" or similar (not "Agregar Prepago")
3. **Given** a user has added capital payments, **When** they view the list of payments, **Then** the list header and item labels use "Abono a capital" terminology
4. **Given** a user views comparison or results text, **When** extra payments are referenced, **Then** the term "abono a capital" is used consistently

---

### User Story 3 - Debt Formula Verification (Priority: P3)

The debt simulator calculations are reviewed and validated to ensure accuracy. Amortization formulas (monthly payment, principal/interest breakdown, schedule generation) and capital payment impact (reduce-term vs. reduce-payment strategies, interest savings) are verified against industry-standard formulas and known test cases.

**Why this priority**: Trust in financial tools depends on calculation accuracy. Formula verification ensures users receive correct information for decision-making.

**Independent Test**: Can be fully tested by running a suite of known scenarios (e.g., $200,000 at 5% for 30 years) and comparing computed values against reference calculators or published amortization tables, and by verifying capital payment scenarios match expected outcomes.

**Acceptance Scenarios**:

1. **Given** standard loan parameters (amount, rate, term), **When** the system calculates the monthly payment, **Then** the result matches the standard amortization formula M = P[r(1+r)^n]/[(1+r)^n-1] within rounding tolerance
2. **Given** a calculated amortization schedule, **When** the user sums principal and interest across all payments, **Then** the totals are consistent and the final balance is zero
3. **Given** a user adds a capital payment with "reduce term" strategy, **When** results are displayed, **Then** the new schedule maintains the same monthly payment and the term reduction and interest savings are mathematically correct
4. **Given** a user adds a capital payment with "reduce payment" strategy, **When** results are displayed, **Then** the new monthly payment is recalculated correctly and the loan pays off within the original term

---

### Edge Cases

- What happens when a user changes parameters very rapidly (e.g., typing quickly in multiple fields)? Does the system debounce or throttle updates to avoid excessive recalculation?
- What happens when a user enters invalid data during real-time update (e.g., negative loan amount)? Does the system show validation errors without breaking the UI?
- What happens when calculation takes longer than 1 second for a very large loan term (e.g., 600 months)? Is a loading indicator shown?
- How does the system handle removing the last capital payment—does it cleanly revert to base scenario display?
- What happens when a user specifies a capital payment amount that exceeds the remaining balance at that month?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display amortization results automatically when the minimum required loan data (amount, interest rate, term, payment frequency) is valid—without any "Calculate" button
- **FR-002**: System MUST update results in real time when the user changes loan amount, interest rate, or term
- **FR-003**: System MUST update results in real time when the user adds, modifies, or removes a capital payment
- **FR-004**: System MUST display updated results within 1 second of the user's last input change (allowing for debouncing of rapid changes)
- **FR-005**: System MUST replace all user-facing instances of "prepago" and "pago prepago" with "Abono a capital" (or "Abonos a capital" for plural) throughout the Debt Simulator
- **FR-006**: System MUST ensure amortization formulas produce results consistent with industry-standard calculations (monthly payment formula, principal/interest breakdown, schedule generation)
- **FR-007**: System MUST ensure capital payment impact calculations (reduce-term and reduce-payment strategies, interest savings) are mathematically correct
- **FR-008**: System MUST provide clear feedback (e.g., loading indicator or disabled state) when calculation is in progress for scenarios that may take longer

### Key Entities

- **Loan Parameters**: Amount, annual interest rate, term in months, payment frequency
- **Capital Payment (Abono a capital)**: Month number, amount, strategy (reduce term or reduce payment)
- **Amortization Scenario**: Monthly payment, total interest, total principal, schedule of payments
- **Comparison Result**: Base scenario vs. scenario with capital payments, interest savings, term reduction or new payment amount

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see updated debt results within 1 second of changing any parameter (loan amount, rate, term, or capital payment)
- **SC-002**: Zero user-facing instances of "prepago" or "pago prepago" remain; all use "Abono a capital" consistently
- **SC-003**: Debt calculations pass validation against at least 3 reference scenarios (e.g., standard amortization, reduce-term capital payment, reduce-payment capital payment)
- **SC-004**: Users can add, modify, and remove capital payments and see comparison updates in real time without manual recalculation

### Constitution Compliance Criteria

- **SC-TEST**: Feature achieves 90% code coverage (statements, branches, functions, lines)
- **SC-A11Y**: Feature meets WCAG AA accessibility standards (keyboard nav, screen reader, color contrast)
- **SC-PERF**: Feature maintains Core Web Vitals targets (FCP < 3s on 3G, CLS < 0.1, 60 FPS)
- **SC-MOBILE**: Feature is fully responsive and mobile-first across all viewport sizes

## Assumptions

- The existing Debt Simulator already has the core calculation logic; this feature removes the Calculate button, introduces automatic real-time updates when minimum data is valid and on every change (including capital payments), updates terminology, and verifies formula correctness
- Real-time updates can be implemented with debouncing (e.g., 300–500 ms) to avoid excessive recalculations during rapid input
- "Abono a capital" is the preferred term in the target market (Spanish-speaking users); no regional variants are needed for this release
- Formula verification will use publicly available reference calculators or published amortization examples as the source of truth
