/**
 * E2E tests for debt simulator
 *
 * Real-time UX: No Calculate button - results appear automatically.
 */

import { test, expect } from '@playwright/test';

test.describe('Debt Simulator', () => {
  test('page loads with form and results appear automatically', async ({ page }) => {
    await page.goto('/debt');

    await expect(page.locator('h1')).toContainText(/Deuda/i);

    await expect(page.locator('text=/Resumen de Resultados/i')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('text=/Pago Mensual/i')).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Calcular Amortización/i })
    ).not.toBeVisible();
  });

  test('displays amortization schedule automatically', async ({ page }) => {
    await page.goto('/debt');

    await expect(page.locator('text=/Cronograma de Amortización/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('shows prepayment section when results load', async ({ page }) => {
    await page.goto('/debt');

    await expect(page.locator('text=/Simulación de Abonos a Capital/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('allows adding prepayment after results load', async ({ page }) => {
    await page.goto('/debt');

    await expect(page.locator('text=/Simulación de Abonos a Capital/i')).toBeVisible({
      timeout: 5000,
    });

    await page.getByRole('button', { name: /Agregar abono a capital/i }).click();

    await expect(page.locator('text=/Comparación|Ahorro/i')).toBeVisible({
      timeout: 3000,
    });
  });
});
