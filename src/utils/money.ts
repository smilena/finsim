/**
 * Money formatting utilities
 */

import type { FormattedValue } from '@/types/common.types';

/**
 * Format number as currency (USD)
 *
 * @param amount - Numeric amount
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(44274.58) // => "$44,274.58"
 * formatCurrency(1234567.89) // => "$1,234,567.89"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number as percentage
 *
 * @param value - Percentage value (e.g., 7.5 for 7.5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(7.5) // => "7.50%"
 * formatPercentage(0.123, 3) // => "0.123%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separators
 *
 * @param value - Numeric value
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567.89, 2) // => "1,234,567.89"
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Create formatted value object (raw + formatted string)
 *
 * @param amount - Numeric amount
 * @param formatter - Formatting function
 * @returns Object with raw value and formatted string
 */
export function createFormattedValue(
  amount: number,
  formatter: (value: number) => string
): FormattedValue {
  return {
    raw: amount,
    formatted: formatter(amount),
  };
}

/**
 * Parse currency string to number
 *
 * @param value - Currency string (e.g., "$1,234.56")
 * @returns Numeric value
 *
 * @example
 * parseCurrency("$1,234.56") // => 1234.56
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned);
}

/**
 * Convert percentage to decimal (7.5% → 0.075)
 */
export function percentToDecimal(percent: number): number {
  return percent / 100;
}

/**
 * Convert decimal to percentage (0.075 → 7.5%)
 */
export function decimalToPercent(decimal: number): number {
  return decimal * 100;
}
