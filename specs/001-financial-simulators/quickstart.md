# Quickstart Guide: Financial Simulators

**Date**: 2026-02-10  
**Feature**: Financial Projections and Debt Simulation Application  
**Purpose**: Development setup and workflow instructions

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (LTS recommended)
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **npm**: Version 9.x or higher (comes with Node.js)
  - Check version: `npm --version`

- **Git**: Version 2.x or higher
  - Check version: `git --version`
  - Download: https://git-scm.com/

- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Material Icon Theme (optional)

---

## Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd finanzas-personales

# Checkout the feature branch
git checkout 001-financial-simulators
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# This installs:
# - Next.js 14+
# - React 18+
# - Material UI v5+
# - TypeScript 5.x
# - Jest + React Testing Library
# - Playwright
# - ESLint + Prettier
```

**Expected output:**
```
added 1234 packages in 45s
```

### 3. Verify Installation

```bash
# Check that TypeScript is working
npx tsc --version

# Check that Next.js is working
npm run dev -- --version
```

---

## Project Structure Overview

```
finanzas-personales/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-specific components & hooks
│   ├── domain/             # Business logic (pure functions)
│   ├── theme/              # MUI theme configuration
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
│
├── tests/
│   ├── unit/               # Unit tests (domain, utils, hooks)
│   ├── integration/        # Integration tests (feature flows)
│   └── setupTests.ts       # Jest configuration
│
├── e2e/                    # Playwright E2E tests
│
├── specs/                  # Feature specifications & plans
│   └── 001-financial-simulators/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── contracts/
│       └── quickstart.md   # This file
│
├── public/                 # Static assets
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest configuration
├── playwright.config.ts    # Playwright configuration
└── package.json            # Dependencies and scripts
```

---

## Development Workflow

### Start Development Server

```bash
# Start Next.js development server
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Open your browser:**
- Navigate to http://localhost:3000
- You should see the home page (welcome screen)

**Hot reload:** Changes to files in `src/` automatically refresh the browser.

---

### Available npm Scripts

#### Development
```bash
# Start dev server with hot reload
npm run dev

# Start on a specific port
npm run dev -- -p 3001
```

#### Building
```bash
# Build production bundle
npm run build

# Check build output size
npm run build -- --profile

# Start production server (after build)
npm run start
```

#### Testing
```bash
# Run all unit + integration tests
npm run test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for a specific file
npm run test -- investment.formulas.test.ts

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests in UI mode (with browser)
npm run test:e2e:ui

# Run E2E tests in specific browser
npm run test:e2e -- --project=chromium
```

#### Code Quality
```bash
# Run ESLint (check for code issues)
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix

# Run Prettier (format code)
npm run format

# Check Prettier without formatting
npm run format:check

# Run TypeScript type checking
npm run type-check
```

#### Full Quality Check
```bash
# Run all checks (linting, formatting, type checking, tests)
npm run check-all
```

---

## Key Configuration Files

### tsconfig.json

Ensure `strict` mode is enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### jest.config.js

Coverage thresholds enforced:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
};
```

### .eslintrc.json

Strict linting rules:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

---

## Development Tips

### 1. File Organization

**When creating a new component:**
```bash
# Feature-specific component
src/features/investment/ComponentName.tsx

# Reusable component
src/components/common/ComponentName.tsx
```

**When creating a new domain service:**
```bash
# Pure function, no React imports
src/domain/investment/investment.service.ts
```

**When creating a new hook:**
```bash
# Feature-specific hook
src/features/investment/useInvestmentSimulator.ts

# Reusable hook
src/hooks/useThemeMode.ts
```

---

### 2. Import Paths

Use absolute imports with `@/` alias:

```typescript
// ✅ Good: Absolute import
import { calculateInvestmentProjection } from '@/domain/investment/investment.service';
import { NumberInput } from '@/components/common/NumberInput';

// ❌ Avoid: Relative imports for deep paths
import { calculateInvestmentProjection } from '../../domain/investment/investment.service';
```

---

### 3. Component Template

```typescript
// src/components/common/ExampleComponent.tsx
'use client'; // Add only if using client-side features (useState, useEffect, etc.)

import { type FC } from 'react';

/**
 * Props for ExampleComponent
 */
export interface ExampleComponentProps {
  /**
   * Description of prop
   */
  title: string;

  /**
   * Optional prop with default
   * @default false
   */
  isActive?: boolean;
}

/**
 * ExampleComponent description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * @example
 * <ExampleComponent title="Hello" isActive={true} />
 */
export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  isActive = false
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
```

---

### 4. Test Template

```typescript
// tests/unit/domain/investment.formulas.test.ts
import { calculateFutureValue } from '@/domain/investment/investment.formulas';

describe('calculateFutureValue', () => {
  it('calculates correctly with valid inputs', () => {
    const result = calculateFutureValue(10000, 500, 7, 12, 60);
    expect(result).toBeCloseTo(44274.58, 2);
  });

  it('handles edge case: 0% interest', () => {
    const result = calculateFutureValue(10000, 500, 0, 12, 60);
    expect(result).toBe(40000); // 10000 + 500*60
  });

  it('throws error for negative inputs', () => {
    expect(() => calculateFutureValue(-100, 500, 7, 12, 60)).toThrow();
  });
});
```

---

## Common Tasks

### Task 1: Add a New Page

```bash
# 1. Create page file
touch src/app/new-page/page.tsx
```

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}

export const metadata = {
  title: 'New Page | Financial Simulators',
  description: 'Description for SEO',
};
```

```bash
# 2. Add navigation link in AppMenu
# Edit src/components/layout/AppMenu.tsx
# Add to menu items array
```

---

### Task 2: Add a New Domain Service

```bash
# 1. Create types file
touch src/domain/my-feature/my-feature.types.ts

# 2. Create service file
touch src/domain/my-feature/my-feature.service.ts

# 3. Create test file
touch tests/unit/domain/my-feature.service.test.ts
```

```typescript
// src/domain/my-feature/my-feature.service.ts
import type { MyInput, MyResult } from './my-feature.types';

/**
 * Calculate something
 */
export function calculateSomething(input: MyInput): MyResult {
  // Pure function: no side effects, deterministic
  return {
    // ... result
  };
}
```

```bash
# 4. Write tests and ensure 90% coverage
npm run test -- my-feature.service.test.ts

# 5. Check coverage
npm run test:coverage
```

---

### Task 3: Add a New Component

```bash
# 1. Create component file
touch src/components/common/MyComponent.tsx

# 2. Create test file
touch tests/unit/components/MyComponent.test.tsx
```

```typescript
// tests/unit/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/common/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

### Task 4: Update Theme Colors

```typescript
// src/theme/palette.ts

// 1. Update light theme colors
export const lightPalette = {
  primary: {
    main: '#YOUR_COLOR', // Change this
  },
  // ...
};

// 2. Update dark theme colors
export const darkPalette = {
  primary: {
    main: '#YOUR_COLOR', // Change this
  },
  // ...
};

// 3. Check both themes visually
// - Toggle theme in app
// - Verify all pages look good
```

---

## Debugging

### Debug Next.js Server

```bash
# Start with Node.js inspector
NODE_OPTIONS='--inspect' npm run dev

# Open Chrome DevTools
# Navigate to chrome://inspect
# Click "inspect" on your Node.js process
```

### Debug Tests

```bash
# Run tests with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Or use VS Code debugger
# Add breakpoint in test file
# Run "Jest Debug" configuration
```

### Check Bundle Size

```bash
# Build and analyze bundle
npm run build

# Check .next/static/ for bundle sizes
# Look for large files (> 100KB)

# Optional: Use bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

## Troubleshooting

### Issue: Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors in node_modules

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Issue: Tests failing due to missing types

```bash
# Install missing types
npm install --save-dev @types/jest @types/node

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### Issue: ESLint/Prettier conflicts

```bash
# Disable ESLint formatting rules (Prettier handles formatting)
# Edit .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier" // Add this to disable formatting rules
  ]
}
```

---

## Git Workflow

### Commit Changes

```bash
# Check current status
git status

# Add files
git add src/domain/investment/

# Commit with descriptive message
git commit -m "feat: add investment calculation service

- Implement compound interest formula
- Add period-by-period breakdown generation
- Include tests with 95% coverage"

# Push to feature branch
git push origin 001-financial-simulators
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `perf`: Performance improvements

**Example:**
```
feat: add debt prepayment calculator

- Implement reduce-term strategy
- Implement reduce-payment strategy
- Add validation for prepayment amounts
- Include comparison component
- Add E2E tests for prepayment flows

Closes #42
```

---

## Definition of Done Checklist

Before considering a task complete, ensure:

- [ ] Code follows TypeScript strict mode (no `any`)
- [ ] All components/functions have JSDoc comments
- [ ] Unit tests written for all domain functions
- [ ] Integration tests for feature flows
- [ ] E2E tests for critical user paths
- [ ] Test coverage >= 90% maintained
- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Light and dark themes tested
- [ ] No console errors or warnings
- [ ] Code reviewed (if applicable)
- [ ] Committed with descriptive message

---

## Useful Resources

### Documentation
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **Material UI**: https://mui.com/material-ui/getting-started/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Jest**: https://jestjs.io/docs/getting-started
- **Playwright**: https://playwright.dev/docs/intro

### Tools
- **TypeScript Playground**: https://www.typescriptlang.org/play
- **MUI Palette Generator**: https://mui.com/material-ui/customization/color/
- **React DevTools**: Chrome extension
- **Axe DevTools**: Accessibility testing Chrome extension

### Communities
- **Next.js Discord**: https://nextjs.org/discord
- **React Discord**: https://discord.gg/react
- **MUI Discord**: https://discord.gg/mui

---

## Next Steps

After setup:

1. **Review documentation**:
   - Read `specs/001-financial-simulators/spec.md` (feature requirements)
   - Read `specs/001-financial-simulators/plan.md` (implementation plan)
   - Read `specs/001-financial-simulators/research.md` (technical patterns)
   - Read `specs/001-financial-simulators/data-model.md` (data types)
   - Read contract files in `specs/001-financial-simulators/contracts/` (interfaces)

2. **Begin implementation**:
   - Start with P1 user story (Navigation and home page)
   - Follow task breakdown from `/speckit.tasks` command
   - Implement tests first (TDD) when possible
   - Maintain 90% coverage throughout

3. **Regular checks**:
   - Run `npm run check-all` before committing
   - Review Constitution compliance periodically
   - Test in both light and dark themes
   - Test on mobile viewport regularly

---

## Support

If you encounter issues:

1. Check this quickstart guide
2. Review feature documentation in `specs/001-financial-simulators/`
3. Check Next.js/React/MUI documentation
4. Search GitHub issues
5. Ask team members

---

**Happy coding! 🚀**
