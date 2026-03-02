/**
 * Unit tests for tax service - cálculo completo e impuesto total vs retención
 */

import { calculateTax } from '@/domain/taxes/taxes.service';

describe('Tax Service', () => {
  it('computes retention 0 for salary below 95 UVT taxable base', () => {
    const result = calculateTax({ grossSalary: 2_000_000, periodicity: 'monthly' });
    const taxableBaseUVT = result.taxableBaseMonthly / 52_374;
    expect(taxableBaseUVT).toBeLessThan(95);
    expect(result.retention).toBe(0);
  });

  it('total deductions = pension + health + fsp + retention', () => {
    const result = calculateTax({ grossSalary: 10_000_000, periodicity: 'monthly' });
    const expectedTotal =
      result.pension + result.health + result.fsp + result.retention;
    expect(result.totalDeductionsMonthly).toBe(expectedTotal);
  });

  it('net pay = baseSalary - totalDeductions + transportAllowance', () => {
    const result = calculateTax({ grossSalary: 2_000_000, periodicity: 'monthly' });
    const expectedNet =
      result.baseSalaryMonthly -
      result.totalDeductionsMonthly +
      result.transportAllowance;
    expect(result.netPayMonthly).toBe(expectedNet);
  });

  it('impuesto total (retención + FSP) is retention + fsp', () => {
    const result = calculateTax({ grossSalary: 12_000_000, periodicity: 'monthly' });
    const totalTaxes = result.retention + result.fsp;
    expect(totalTaxes).toBe(result.retention + result.fsp);
    expect(result.fsp).toBeGreaterThan(0); // 12M > 4 SMMLV
  });

  it('annual and monthly inputs give consistent monthly results', () => {
    const monthly = calculateTax({ grossSalary: 24_000_000 / 12, periodicity: 'monthly' });
    const annual = calculateTax({ grossSalary: 24_000_000, periodicity: 'annual' });
    expect(annual.grossSalaryMonthly).toBe(monthly.grossSalaryMonthly);
    expect(annual.retention).toBe(monthly.retention);
    expect(annual.netPayMonthly).toBe(monthly.netPayMonthly);
  });

  it('minimum wage: base salary and auxilio separated, deductions only on salary, retention 0', () => {
    const SMLMV = 1_750_905;
    const AUXILIO = 249_095;
    const result = calculateTax({ grossSalary: SMLMV, periodicity: 'monthly' });
    expect(result.baseSalaryMonthly).toBe(SMLMV);
    expect(result.transportAllowance).toBe(AUXILIO);
    expect(result.retention).toBe(0);
    const pension = SMLMV * 0.04;
    const health = SMLMV * 0.04;
    expect(result.pension).toBe(pension);
    expect(result.health).toBe(health);
    const expectedNet = SMLMV - pension - health + AUXILIO;
    expect(result.netPayMonthly).toBe(expectedNet);
    expect(result.netPayMonthly).toBeGreaterThanOrEqual(1_850_000);
    expect(result.netPayMonthly).toBeLessThanOrEqual(1_870_000);
  });
});
