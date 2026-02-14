/**
 * Unit tests for math utilities
 */

import {
  roundToDecimals,
  roundToCents,
  clamp,
  approximatelyEqual,
  inRange,
  safeDivide,
  percentageOf,
} from '@/utils/math';

describe('math utilities', () => {
  describe('roundToDecimals', () => {
    it('rounds to specified decimal places', () => {
      expect(roundToDecimals(44274.5849, 2)).toBe(44274.58);
      expect(roundToDecimals(1.2345, 2)).toBe(1.23);
      expect(roundToDecimals(1.2355, 2)).toBe(1.24);
    });

    it('rounds to zero decimals', () => {
      expect(roundToDecimals(44274.5849, 0)).toBe(44275);
    });
  });

  describe('roundToCents', () => {
    it('rounds to 2 decimal places', () => {
      expect(roundToCents(44274.5849)).toBe(44274.58);
      expect(roundToCents(100.999)).toBe(101.00);
    });
  });

  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(50, 0, 100)).toBe(50);
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(150, 0, 100)).toBe(100);
    });
  });

  describe('approximatelyEqual', () => {
    it('returns true for approximately equal numbers', () => {
      expect(approximatelyEqual(100.001, 100.002, 0.01)).toBe(true);
      expect(approximatelyEqual(100, 100, 0.01)).toBe(true);
    });

    it('returns false for different numbers', () => {
      expect(approximatelyEqual(100, 110, 0.01)).toBe(false);
    });
  });

  describe('inRange', () => {
    it('checks if value is within range', () => {
      expect(inRange(50, 0, 100)).toBe(true);
      expect(inRange(0, 0, 100)).toBe(true);
      expect(inRange(100, 0, 100)).toBe(true);
      expect(inRange(-1, 0, 100)).toBe(false);
      expect(inRange(101, 0, 100)).toBe(false);
    });
  });

  describe('safeDivide', () => {
    it('divides normally when denominator is non-zero', () => {
      expect(safeDivide(100, 10)).toBe(10);
      expect(safeDivide(7, 2)).toBe(3.5);
    });

    it('returns 0 when denominator is zero', () => {
      expect(safeDivide(100, 0)).toBe(0);
    });
  });

  describe('percentageOf', () => {
    it('calculates percentage correctly', () => {
      expect(percentageOf(50, 100)).toBe(50);
      expect(percentageOf(25, 100)).toBe(25);
      expect(percentageOf(100, 200)).toBe(50);
    });

    it('handles zero total', () => {
      expect(percentageOf(50, 0)).toBe(0);
    });
  });
});
