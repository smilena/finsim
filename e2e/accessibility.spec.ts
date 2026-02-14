/**
 * E2E tests for accessibility (keyboard nav, ARIA, skip link)
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('skip link exists and main content has target id', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toContainText(/Saltar al contenido principal/);
    await expect(skipLink).toBeAttached();

    await skipLink.click();
    await expect(page).toHaveURL(/#main-content/);
  });

  test('main content has correct landmark', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('id', 'main-content');
  });

  test('navigation has aria-label', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
  });

  test('theme toggle has descriptive aria-label', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="tema claro"], button[aria-label*="tema oscuro"]'
    );
    await expect(themeToggle.first()).toHaveAttribute(
      'aria-label',
      /tema (claro|oscuro)/
    );
  });

  test('forms have proper labels', async ({ page }) => {
    await page.goto('/investment');

    const calculateButton = page.getByRole('button', {
      name: /Calcular Proyección/i,
    });
    await expect(calculateButton).toBeVisible();

    await page.goto('/debt');
    const amortizeButton = page.getByRole('button', {
      name: /Calcular Amortización/i,
    });
    await expect(amortizeButton).toBeVisible();
  });
});
