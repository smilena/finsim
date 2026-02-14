/**
 * Unit tests for money formatting utilities
 */

import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  createFormattedValue,
  parseCurrency,
  percentToDecimal,
  decimalToPercent,
} from '@/utils/money';

describe('money utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive amounts correctly', () => {
      expect(formatCurrency(44274.58)).toBe('$44,274.58');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
      expect(formatCurrency(100)).toBe('$100.00');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative amounts correctly', () => {
      expect(formatCurrency(-100.5)).toBe('-$100.50');
    });

    it('formats large numbers with commas', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages with default 2 decimals', () => {
      expect(formatPercentage(7.5)).toBe('7.50%');
      expect(formatPercentage(0)).toBe('0.00%');
      expect(formatPercentage(100)).toBe('100.00%');
    });

    it('formats percentages with custom decimal places', () => {
      expect(formatPercentage(7.5, 0)).toBe('8%');
      expect(formatPercentage(0.123, 3)).toBe('0.123%');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousands separators', () => {
      expect(formatNumber(1234567.89, 2)).toBe('1,234,567.89');
      expect(formatNumber(1000, 0)).toBe('1,000');
    });
  });

  describe('createFormattedValue', () => {
    it('creates formatted value object', () => {
      const result = createFormattedValue(1234.56, formatCurrency);
      expect(result.raw).toBe(1234.56);
      expect(result.formatted).toBe('$1,234.56');
    });
  });

  describe('parseCurrency', () => {
    it('parses currency strings correctly', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56);
      expect(parseCurrency('$100.00')).toBe(100);
      expect(parseCurrency('1234.56')).toBe(1234.56);
    });
  });

  describe('percentToDecimal', () => {
    it('converts percentages to decimals', () => {
      expect(percentToDecimal(7.5)).toBe(0.075);
      expect(percentToDecimal(100)).toBe(1);
      expect(percentToDecimal(0)).toBe(0);
    });
  });

  describe('decimalToPercent', () => {
    it('converts decimals to percentages', () => {
      expect(decimalToPercent(0.075)).toBe(7.5);
      expect(decimalToPercent(1)).toBe(100);
      expect(decimalToPercent(0)).toBe(0);
    });
  });
});
