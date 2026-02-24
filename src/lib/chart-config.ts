/**
 * Chart colors by theme - contrast-safe for light and dark
 */

export const CHART_COLORS_DARK = {
  debtWithoutPrepayment: '#ff4757',
  debtWithPrepayment: '#00ff88',
  interest: '#facc15',
  principal: '#00d4ff',
  savings: '#00ff88',
  grid: '#2a2a3e',
  text: '#f1f5f9',
  tooltip: {
    background: '#0f0f1a',
    border: '#2a2a3e',
    text: '#f1f5f9',
  },
  investment: '#a855f7',
  returns: '#00d4ff',
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
