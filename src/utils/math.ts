/**
 * Math utility functions
 */

/**
 * Round number to specified decimal places
 * Uses banker's rounding (round half to even)
 *
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 *
 * @example
 * roundToDecimals(44274.5849, 2) // => 44274.58
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Round to cents (2 decimal places)
 *
 * @param amount - Amount to round
 * @returns Amount rounded to cents
 */
export function roundToCents(amount: number): number {
  return roundToDecimals(amount, 2);
}

/**
 * Clamp value between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if two numbers are approximately equal (within epsilon)
 *
 * @param a - First number
 * @param b - Second number
 * @param epsilon - Tolerance (default: 0.01)
 * @returns True if numbers are approximately equal
 */
export function approximatelyEqual(a: number, b: number, epsilon = 0.01): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Check if a number is within a range (inclusive)
 *
 * @param value - Value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Safe division that returns 0 if denominator is 0
 *
 * @param numerator - Numerator
 * @param denominator - Denominator
 * @returns Result of division or 0 if denominator is 0
 */
export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate percentage of total
 *
 * @param part - Part value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function percentageOf(part: number, total: number): number {
  return safeDivide(part, total) * 100;
}
