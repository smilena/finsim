/**
 * E2E tests for navigation and home page
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation and Home Page', () => {
  test('home page loads with welcome content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Simuladores Financieros/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=/Simuladores Financieros/i')).toBeVisible();
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const investmentLink = page.locator('a[href="/investment"]');
    await expect(investmentLink).toBeVisible();
    await investmentLink.click();

    await expect(page).toHaveURL('/investment');
    await expect(page.locator('h1')).toContainText(/Inversión/i);

    const debtLink = page.locator('a[href="/debt"]');
    await expect(debtLink).toBeVisible();
    await debtLink.click();

    await expect(page).toHaveURL('/debt');
    await expect(page.locator('h1')).toContainText(/Deuda/i);

    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await expect(page).toHaveURL('/');
  });

  test('active page is indicated in navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('/');
    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');

    await page.goto('/investment');
    const investmentLink = page.locator('a[href="/investment"]').first();
    await expect(investmentLink).toHaveAttribute('aria-current', 'page');
  });

  test('responsive menu works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menú"]');
    await expect(menuButton).toBeVisible();

    // Click to open menu
    await menuButton.click();

    // Menu items should be visible
    await expect(page.locator('a[href="/investment"]')).toBeVisible();
    await expect(page.locator('a[href="/debt"]')).toBeVisible();

    // Click a navigation link
    await page.locator('a[href="/investment"]').click();

    // Should navigate to investment page
    await expect(page).toHaveURL('/investment');

    // Menu should auto-close after navigation (mobile behavior)
  });

  test('horizontal menu works on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page.locator('a[href="/investment"]')).toBeVisible();
    await expect(page.locator('a[href="/debt"]')).toBeVisible();

    const menuButton = page.locator('button[aria-label*="menú"]');
    await expect(menuButton).not.toBeVisible();
  });
});
