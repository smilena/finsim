/**
 * Chart colors by theme - contrast-safe for light and dark
 */

export const CHART_COLORS_DARK = {
  debtWithoutPrepayment: '#ef4444',
  debtWithPrepayment: '#10b981',
  interest: '#f59e0b',
  principal: '#06b6d4',
  savings: '#10b981',
  grid: '#1e293b',
  text: '#f1f5f9',
  tooltip: {
    background: '#111827',
    border: '#1e293b',
    text: '#f1f5f9',
  },
  investment: '#6366f1',
  returns: '#06b6d4',
} as const;

export const CHART_COLORS_LIGHT = {
  debtWithoutPrepayment: '#e11d48',
  debtWithPrepayment: '#16a34a',
  interest: '#f59e0b',
  principal: '#0ea5e9',
  savings: '#16a34a',
  grid: '#e5e7eb',
  text: '#0b1220',
  tooltip: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#0b1220',
  },
  investment: '#4f46e5',
  returns: '#0d9488',
} as const;

export type ChartColors = typeof CHART_COLORS_DARK | typeof CHART_COLORS_LIGHT;

/** @deprecated Use useChartColors() or CHART_COLORS_DARK/CHART_COLORS_LIGHT */
export const CHART_COLORS = CHART_COLORS_DARK;

export type ChartColorKey = keyof typeof CHART_COLORS_DARK;
