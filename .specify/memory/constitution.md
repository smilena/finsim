<!--
  SYNC IMPACT REPORT
  
  Version Change: [TEMPLATE] → 1.0.0
  Type: MAJOR (Initial ratification)
  Date: 2026-02-10
  
  Modified Principles:
  - NEW: I. Technology Stack (Non-Negotiable)
  - NEW: II. Architecture & Code Structure
  - NEW: III. Code Quality Standards
  - NEW: IV. Testing Strategy (Mandatory)
  - NEW: V. User Experience Consistency
  - NEW: VI. Performance Requirements
  - NEW: VII. Maintainability & Scalability
  - NEW: VIII. Definition of Done
  
  Added Sections:
  - Core Principles (8 principles)
  - Testing Requirements
  - Governance
  
  Templates Status:
  ✅ plan-template.md - Validated: Constitution Check section aligns with new principles
  ✅ spec-template.md - Validated: Requirements structure supports tech stack and testing mandates
  ✅ tasks-template.md - Validated: Task categorization supports testing-first approach and coverage goals
  
  Follow-up TODOs: None
-->

# Finanzas Personales Constitution

## Core Principles

### I. Technology Stack (Non-Negotiable)

The application **MUST** be a web application built with **Next.js** (latest stable version).

The application **MUST** be fully responsive and mobile-first.

**TypeScript** is mandatory across the entire codebase with `strict: true` enabled in `tsconfig.json`. No usage of `any` is allowed unless explicitly justified and documented.

**Material UI (MUI)** **MUST** be the only UI component library used. No custom UI frameworks or mixed libraries are allowed.

State management, routing, and data fetching **MUST** follow Next.js recommended best practices (App Router, Server Components, Server Actions, etc.).

**Rationale**: Enforcing a single, modern technology stack ensures consistency, reduces decision fatigue, leverages framework best practices, and enables predictable scaling. TypeScript strict mode catches errors early. MUI provides a comprehensive, accessible, and well-maintained component system that eliminates the need for custom UI solutions.

---

### II. Architecture & Code Structure

Code **MUST** follow a clear, scalable, and domain-oriented structure.

Responsibilities **MUST** be clearly separated:
- UI components (presentation layer)
- Domain logic (business rules)
- Application services (orchestration)
- Infrastructure / integrations (external systems)

Components **MUST** be:
- Small (single responsibility)
- Predictable (no hidden side effects)
- Focused on a single concern

**Business logic MUST NOT live inside UI components.**

All public APIs (functions, hooks, services) **MUST** be strongly typed and explicitly documented with JSDoc or TypeScript comments.

**Rationale**: Clear separation of concerns makes code easier to understand, test, and modify. Keeping business logic out of UI components enables reusability, testability, and prevents tight coupling. Strong typing and documentation reduce cognitive load and onboarding time.

---

### III. Code Quality Standards

Code **MUST** be:
- Readable (self-documenting naming)
- Explicit over implicit (no magic)
- Intention-revealing (clear purpose)

**ESLint and Prettier** **MUST** be enforced with strict rules in CI/CD.

No dead code, commented-out code, or unused exports are allowed.

Naming conventions **MUST** be consistent, descriptive, and intention-revealing across the entire codebase.

All decisions that introduce complexity (patterns, abstractions, workarounds) **MUST** be justified in code comments or documentation.

**Rationale**: High code quality reduces bugs, accelerates onboarding, and minimizes maintenance burden. Automated enforcement prevents style debates and ensures consistency. Explicit intent and documented complexity help future maintainers (including your future self) understand why decisions were made.

---

### IV. Testing Strategy (Mandatory)

#### 4.1 Unit & Integration Testing

**Jest + React Testing Library** **MUST** be used for:
- Unit tests (pure functions, utilities, services)
- Component tests (UI behavior)
- Integration tests (feature flows)

Tests **MUST** focus on behavior, not implementation details (no testing of internal state or private methods).

Mocking **MUST** be minimal and intentional (mock external dependencies, not internal modules).

The test suite **MUST** achieve at least **90% code coverage**:
- Statements
- Branches
- Functions
- Lines

#### 4.2 End-to-End Testing

**Playwright** **MUST** be used for E2E testing.

E2E tests **MUST** cover:
- Critical user flows (authentication, core features)
- Navigation and routing
- Accessibility-related interactions
- Responsive behavior across viewports (mobile, tablet, desktop)

E2E coverage **MUST** meaningfully contribute to the overall 90% coverage goal.

#### 4.3 Testing Principles

Tests **MUST** be:
- Deterministic (same input = same output)
- Repeatable (no flakiness)
- Fast (unit tests < 1s, integration tests < 10s per test)

**No flaky tests are acceptable.** Flaky tests must be fixed or removed immediately.

Tests are considered **first-class citizens** of the codebase (same quality standards as production code).

**Code that is hard to test MUST be refactored.**

**Rationale**: A comprehensive, deterministic test suite is the foundation of confident refactoring, rapid iteration, and continuous deployment. 90% coverage ensures critical paths are protected. Testing behavior (not implementation) makes tests resilient to refactoring. E2E tests validate real user experiences. The "tests are first-class citizens" principle ensures the test suite remains maintainable.

---

### V. User Experience Consistency

UI behavior **MUST** be consistent across the entire application (interactions, feedback, states).

**Material UI theming MUST be centralized** and reusable (single source of truth for colors, typography, spacing).

**Accessibility (a11y) is mandatory**:
- Proper semantic HTML (headings, landmarks, lists)
- Keyboard navigation support (tab order, focus management, shortcuts)
- Screen reader compatibility (ARIA labels, roles, live regions)
- Color contrast compliance (WCAG AA minimum)

Error states, loading states, and empty states **MUST** be explicitly designed and implemented for every user-facing feature.

Visual regressions **MUST** be avoided through consistent component usage and design system adherence.

**Rationale**: Consistent UX builds user trust and reduces learning curve. Centralized theming prevents style drift and simplifies redesigns. Accessibility is a legal and ethical requirement that also improves usability for all users. Explicit state handling prevents confusing or broken experiences.

---

### VI. Performance Requirements

Performance is a **core requirement**, not an afterthought.

The application **MUST**:
- Leverage Next.js rendering strategies appropriately:
  - **SSR** (Server-Side Rendering) for dynamic, personalized content
  - **SSG** (Static Site Generation) for static content
  - **ISR** (Incremental Static Regeneration) for content that updates periodically
- Avoid unnecessary re-renders (memoization, proper dependency arrays, React.memo where appropriate)
- Minimize bundle size (code splitting, tree shaking, dynamic imports)
- Eliminate unused dependencies

Client-side code **MUST** be optimized for:
- Fast initial load (< 3s FCP on 3G)
- Smooth interactions (60 FPS, no janky scrolling)
- Minimal layout shifts (CLS < 0.1)

Performance trade-offs **MUST** be documented when they exist (e.g., "Using client-side filtering for UX responsiveness despite larger initial payload").

**Rationale**: Users abandon slow applications. Next.js provides powerful rendering primitives that must be used correctly. Performance affects SEO, conversion rates, and user satisfaction. Documenting trade-offs ensures intentional decisions rather than accidental degradation.

---

### VII. Maintainability & Scalability

The codebase **MUST** be easy to:
- Understand (clear structure, documentation)
- Extend (add features without major rewrites)
- Refactor (change implementation without breaking contracts)

Breaking changes **MUST** be explicit and well documented (changelog, migration guides).

Patterns and abstractions **MUST** be:
- Reusable (DRY principle)
- Consistent (same problems solved the same way)
- Justified (no premature abstraction)

The system **SHOULD** assume future growth in:
- Features (new domains, integrations)
- Teams (multiple developers working concurrently)
- Complexity (increased business logic, data volume)

**Rationale**: Code is read more often than written. A maintainable codebase reduces time-to-market for new features and reduces bug introduction. Anticipating growth prevents costly rewrites. Consistent patterns reduce cognitive load and enable effective collaboration.

---

### VIII. Definition of Done

A feature is considered **done** only if:

1. **It fully complies with this constitution** (all principles followed)
2. **It includes appropriate tests**:
   - Unit tests for business logic
   - Integration tests for feature flows (if applicable)
   - E2E tests for critical user paths (if applicable)
3. **It does not reduce overall test coverage below 90%**
4. **It maintains UX standards** (accessible, responsive, consistent)
5. **It maintains performance standards** (no regressions in Core Web Vitals)
6. **It introduces no regressions** (all existing tests pass)
7. **It includes documentation** (JSDoc for public APIs, README updates if needed)
8. **It passes code review** (peer-reviewed for quality, architecture, and constitution compliance)

**Rationale**: A clear Definition of Done prevents technical debt accumulation and ensures every shipped feature meets quality standards. This definition serves as a quality gate and shared understanding of "completeness."

---

## Governance

This constitution **supersedes all other practices, conventions, and preferences**.

All code reviews, pull requests, and feature implementations **MUST** verify compliance with this constitution.

### Amendment Process

Amendments to this constitution require:
1. **Documented rationale** (why the change is needed)
2. **Impact analysis** (what will be affected)
3. **Team consensus** (approval from all active contributors)
4. **Migration plan** (how existing code will be updated, if needed)
5. **Version increment** (semantic versioning: MAJOR.MINOR.PATCH)

### Versioning Policy

- **MAJOR** (X.0.0): Backward-incompatible changes (principle removals, redefinitions that invalidate existing code)
- **MINOR** (0.X.0): Backward-compatible additions (new principles, expanded guidance)
- **PATCH** (0.0.X): Clarifications, typo fixes, non-semantic refinements

### Compliance Review

Constitution compliance **MUST** be checked:
- During code review (manual)
- In CI/CD pipeline (automated linting, test coverage, type checking)
- During sprint retrospectives (process improvement)

Violations **MUST** be addressed before merging. If a violation is necessary, it **MUST** be explicitly justified in code comments and documented in the PR description.

### Living Document

This constitution is a **living document**. As the project evolves, the constitution should evolve with it. Regular reviews (quarterly or after major milestones) are recommended to ensure it remains relevant and practical.

---

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
