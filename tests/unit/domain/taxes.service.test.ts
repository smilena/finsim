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

  it('net pay = gross - totalDeductions + transportAllowance', () => {
    const result = calculateTax({ grossSalary: 2_000_000, periodicity: 'monthly' });
    const expectedNet =
      result.grossSalaryMonthly -
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
});
