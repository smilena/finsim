/**
 * E2E tests for responsive design across viewports
 */

import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

test.describe('Responsive Design', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}x${viewport.height}): home page renders correctly`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=/Simuladores Financieros/i')).toBeVisible();

      if (viewport.width < 768) {
        const menuButton = page.locator('button[aria-label*="menú"]');
        await expect(menuButton).toBeVisible();
      } else {
        await expect(page.locator('a[href="/investment"]')).toBeVisible();
        await expect(page.locator('a[href="/debt"]')).toBeVisible();
      }
    });

    test(`${viewport.name}: investment page renders correctly`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/investment');

      await expect(page.locator('h1')).toContainText(/Inversión/i);
      await expect(page.getByRole('button', { name: /Calcular Proyección/i })).toBeVisible();
    });

    test(`${viewport.name}: debt page renders correctly`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/debt');

      await expect(page.locator('h1')).toContainText(/Deuda/i);
      await expect(page.getByRole('button', { name: /Calcular Amortización/i })).toBeVisible();
    });
  }
});
