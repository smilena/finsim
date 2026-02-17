/**
 * Hook that returns chart colors for the current theme (light/dark)
 */

'use client';

import { useThemeModeContext } from '@/theme/ThemeModeContext';
import {
  CHART_COLORS_DARK,
  CHART_COLORS_LIGHT,
  type ChartColors,
} from '@/lib/chart-config';

export function useChartColors(): ChartColors {
  const { mode } = useThemeModeContext();
  return mode === 'dark' ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
}
