/**
 * Chart colors by theme - alineados con la paleta del tema (Invecont)
 */

export const CHART_COLORS_DARK = {
  /** Escenario sin abonos → secondary (púrpura) */
  debtWithoutPrepayment: '#9471f8',
  /** Escenario con abonos → primary (cyan) */
  debtWithPrepayment: '#5dedff',
  /** Interés acumulado sin abonos */
  interest: '#f59e0b',
  principal: '#5dedff',
  /** Ahorro / con abonos */
  savings: '#5dedff',
  grid: 'rgba(93, 237, 255, 0.15)',
  text: '#ffffff',
  tooltip: {
    background: '#171b36',
    border: 'rgba(93, 237, 255, 0.35)',
    text: '#e0e0e0',
  },
  investment: '#9471f8',
  returns: '#5dedff',
} as const;

export const CHART_COLORS_LIGHT = {
  /** Escenario sin abonos → secondary (púrpura) */
  debtWithoutPrepayment: '#7c3aed',
  /** Escenario con abonos → primary (cyan) */
  debtWithPrepayment: '#0891b2',
  /** Interés acumulado sin abonos */
  interest: '#f59e0b',
  principal: '#0891b2',
  /** Ahorro / con abonos */
  savings: '#0891b2',
  grid: 'rgba(8, 145, 178, 0.12)',
  text: '#0f172a',
  tooltip: {
    background: '#ffffff',
    border: 'rgba(8, 145, 178, 0.25)',
    text: '#0f172a',
  },
  investment: '#7c3aed',
  returns: '#0891b2',
} as const;

export type ChartColors = typeof CHART_COLORS_DARK | typeof CHART_COLORS_LIGHT;

/** @deprecated Use useChartColors() or CHART_COLORS_DARK/CHART_COLORS_LIGHT */
export const CHART_COLORS = CHART_COLORS_DARK;

export type ChartColorKey = keyof typeof CHART_COLORS_DARK;
