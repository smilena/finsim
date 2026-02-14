/**
 * Configuración de colores para gráficas
 * Paleta futurista - neón sobre oscuro, alto contraste
 */

export const CHART_COLORS = {
  // Colores de gráficas
  debtWithoutPrepayment: '#ff4757',
  debtWithPrepayment: '#00ff88',
  interest: '#facc15',
  principal: '#00d4ff',
  savings: '#00ff88',
  
  // Colores de fondo y elementos
  grid: '#2a2a3e',
  text: '#f1f5f9',
  tooltip: {
    background: '#0f0f1a',
    border: '#2a2a3e',
    text: '#f1f5f9',
  },
  
  // Colores de inversión
  investment: '#a855f7',
  returns: '#00d4ff',
} as const;

export type ChartColorKey = keyof typeof CHART_COLORS;
