/**
 * E2E tests for investment simulator
 */

import { test, expect } from '@playwright/test';

test.describe('Investment Simulator', () => {
  test('page loads with form and empty state', async ({ page }) => {
    await page.goto('/investment');

    await expect(page.locator('h1')).toContainText(/Inversión/i);
    await expect(
      page.getByRole('button', { name: /Calcular Proyección/i })
    ).toBeVisible();
    await expect(page.locator('text=/Ingresa los datos de tu inversión/i')).toBeVisible();
  });

  test('calculates and displays results when submit clicked', async ({ page }) => {
    await page.goto('/investment');

    const calculateButton = page.getByRole('button', {
      name: /Calcular Proyección/i,
    });
    await calculateButton.click();

    await expect(page.locator('text=/Resultados de la Proyección/i')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('text=/Inversión Total/i')).toBeVisible();
    await expect(page.locator('text=/Valor Final/i')).toBeVisible();
  });

  test('shows breakdown table after calculation', async ({ page }) => {
    await page.goto('/investment');

    await page.getByRole('button', { name: /Calcular Proyección/i }).click();

    await expect(page.locator('text=/Resultados de la Proyección/i')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('text=/Mes 1|Año 1/')).toBeVisible({ timeout: 3000 });
  });
});
