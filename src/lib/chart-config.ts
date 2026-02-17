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
  debtWithoutPrepayment: '#dc2626',
  debtWithPrepayment: '#059669',
  interest: '#d97706',
  principal: '#0284c7',
  savings: '#059669',
  grid: '#cbd5e1',
  text: '#0f172a',
  tooltip: {
    background: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
  },
  investment: '#7c3aed',
  returns: '#0284c7',
} as const;

export type ChartColors = typeof CHART_COLORS_DARK | typeof CHART_COLORS_LIGHT;

/** @deprecated Use useChartColors() or CHART_COLORS_DARK/CHART_COLORS_LIGHT */
export const CHART_COLORS = CHART_COLORS_DARK;

export type ChartColorKey = keyof typeof CHART_COLORS_DARK;
