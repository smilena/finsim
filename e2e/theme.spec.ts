/**
 * E2E tests for theme switching (light/dark)
 */

import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('theme toggle button is visible on all pages', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="tema claro"], button[aria-label*="tema oscuro"]'
    );
    await expect(themeToggle).toBeVisible();

    await page.goto('/investment');
    await expect(themeToggle).toBeVisible();

    await page.goto('/debt');
    await expect(themeToggle).toBeVisible();
  });

  test('switches between light and dark theme', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="tema claro"], button[aria-label*="tema oscuro"]'
    );
    await expect(themeToggle).toBeVisible();

    const body = page.locator('body');
    const initialBg = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    await themeToggle.click();

    const afterToggleBg = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(afterToggleBg).not.toBe(initialBg);
  });

  test('theme persists after page navigation', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator(
      'button[aria-label*="tema claro"], button[aria-label*="tema oscuro"]'
    );

    await themeToggle.click();
    const bodyAfterToggle = await page
      .locator('body')
      .evaluate((el) => window.getComputedStyle(el).backgroundColor);

    await page.goto('/investment');
    const bodyOnInvestment = await page
      .locator('body')
      .evaluate((el) => window.getComputedStyle(el).backgroundColor);

    expect(bodyOnInvestment).toBe(bodyAfterToggle);
  });
});
