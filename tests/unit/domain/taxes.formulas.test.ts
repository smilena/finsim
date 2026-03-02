/**
 * Unit tests for tax formulas - retención en la fuente y FSP
 */

import {
  calculateRetentionUVT,
  calculateRetentionPesos,
  getMarginalRateForBaseUVT,
  getFSPDeduction,
  getPensionDeduction,
  getHealthDeduction,
  getTransportAllowance,
} from '@/domain/taxes/taxes.formulas';
import { UVT_2026, SMLMV_2026 } from '@/domain/taxes/taxes.constants';

describe('Tax Formulas', () => {
  describe('calculateRetentionUVT', () => {
    it('returns 0 when base <= 95 UVT', () => {
      expect(calculateRetentionUVT(0)).toBe(0);
      expect(calculateRetentionUVT(95)).toBe(0);
      expect(calculateRetentionUVT(50)).toBe(0);
    });

    it('calculates first bracket (95-150 UVT) at 19%', () => {
      // (100 - 95) * 0.19 = 0.95 UVT
      expect(calculateRetentionUVT(100)).toBeCloseTo(0.95, 4);
      // (150 - 95) * 0.19 = 10.45 UVT
      expect(calculateRetentionUVT(150)).toBeCloseTo(10.45, 2);
    });

    it('calculates second bracket (150-360 UVT) at 28%', () => {
      // 10.45 + (200 - 150) * 0.28 = 10.45 + 14 = 24.45 UVT
      expect(calculateRetentionUVT(200)).toBeCloseTo(24.45, 2);
    });

    it('calculates bracket 360-640 UVT at 33% (Art. 383 table)', () => {
      // At 500 UVT: 69.25 + (500 - 360) * 0.33 = 69.25 + 46.2 = 115.45 UVT
      expect(calculateRetentionUVT(500)).toBeCloseTo(115.45, 2);
    });

    it('calculates bracket 2300+ UVT at 39% (Art. 383 table)', () => {
      // At 2500 UVT: 769.75 + (2500 - 2300) * 0.39 = 769.75 + 78 = 847.75 UVT
      expect(calculateRetentionUVT(2500)).toBeCloseTo(847.75, 2);
    });

    it('returns marginal rate 0 below 95 UVT', () => {
      expect(getMarginalRateForBaseUVT(50)).toBe(0);
      expect(getMarginalRateForBaseUVT(95)).toBe(0);
    });

    it('returns marginal rate 0.19 for 95 < base <= 150', () => {
      expect(getMarginalRateForBaseUVT(100)).toBe(0.19);
      expect(getMarginalRateForBaseUVT(150)).toBe(0.19);
    });
  });

  describe('calculateRetentionPesos', () => {
    it('returns 0 when taxable base below 95 UVT', () => {
      const base95UVT = 95 * UVT_2026; // 4,975,530
      expect(calculateRetentionPesos(base95UVT)).toBe(0);
      expect(calculateRetentionPesos(4_000_000)).toBe(0);
    });

    it('converts UVT result to pesos correctly', () => {
      // 100 UVT → 0.95 UVT tax → 0.95 * 52374 ≈ 49,755
      const base100UVT = 100 * UVT_2026;
      const retention = calculateRetentionPesos(base100UVT);
      expect(retention).toBeGreaterThanOrEqual(49750);
      expect(retention).toBeLessThanOrEqual(49760);
    });
  });

  describe('getFSPDeduction', () => {
    const threshold = 4 * SMLMV_2026; // 7,003,620

    it('returns 0 when salary < 4 SMMLV', () => {
      expect(getFSPDeduction(7_000_000)).toBe(0);
      expect(getFSPDeduction(3_500_000)).toBe(0);
    });

    it('applies 1% for salary between 4 and 16 SMMLV', () => {
      const salary = 10_000_000;
      expect(getFSPDeduction(salary)).toBe(100_000); // 1%
    });

    it('applies 2% for salary above 20 SMMLV', () => {
      const salary = 40_000_000; // ~22.8 SMMLV
      expect(getFSPDeduction(salary)).toBe(800_000); // 2%
    });
  });

  describe('getPensionDeduction', () => {
    it('calculates 4% of gross', () => {
      expect(getPensionDeduction(2_000_000)).toBe(80_000);
      expect(getPensionDeduction(10_000_000)).toBe(400_000);
    });
  });

  describe('getHealthDeduction', () => {
    it('calculates 4% of gross', () => {
      expect(getHealthDeduction(2_000_000)).toBe(80_000);
    });
  });

  describe('getTransportAllowance', () => {
    it('returns 0 when salary > 2 SMMLV', () => {
      const twoSMLMV = 2 * SMLMV_2026; // 3,501,810
      expect(getTransportAllowance(twoSMLMV + 1)).toBe(0);
    });
  });
});
