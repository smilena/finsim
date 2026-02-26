/**
 * Colombia 2026 fiscal constants
 * Fuente: Resolución 000238/2025 DIAN, Decreto 1469/2025 (SMLMV), Decreto 1470/2025 (auxilio)
 */

/** Unidad de Valor Tributario (UVT) 2026 - pesos */
export const UVT_2026 = 52_374;

/** Salario Mínimo Legal Mensual Vigente (SMLMV) 2026 - pesos */
export const SMLMV_2026 = 1_750_905;

/** Hasta 2 SMLMV reciben auxilio de transporte */
export const AUXILIO_TRANSPORTE_MAX_SALARY = 2 * SMLMV_2026;

/** Auxilio de transporte 2026 - pesos mensuales */
export const AUXILIO_TRANSPORTE_2026 = 249_095;

/** Aportes obligatorios del trabajador (sobre IBC) */
export const PENSION_RATE = 0.04; // 4%
export const HEALTH_RATE = 0.04;  // 4%

/**
 * Fondo de Solidaridad Pensional (FSP) - Ley 100 de 1993
 * Aplica a quienes devenguen >= 4 SMMLV. Base: IBC (salario, sin auxilio de transporte).
 */
export const FSP_MIN_SMMLV = 4;
export const FSP_THRESHOLD_PESOS = FSP_MIN_SMMLV * SMLMV_2026;

/** Tramos FSP: [límite superior en SMMLV, tasa 0-1] */
export const FSP_BRACKETS: Array<{ limitSMMLV: number; rate: number }> = [
  { limitSMMLV: 16, rate: 0.01 },
  { limitSMMLV: 17, rate: 0.012 },
  { limitSMMLV: 18, rate: 0.014 },
  { limitSMMLV: 19, rate: 0.016 },
  { limitSMMLV: 20, rate: 0.018 },
  { limitSMMLV: Infinity, rate: 0.02 },
];

/** Retención en la fuente inicia a partir de este tope en UVT mensuales (Art. 383 ET) */
export const RETENTION_START_UVT = 95;

/**
 * Tramos de retención en la fuente 2026 (ingresos laborales)
 * Impuesto en UVT = base acumulada en UVT según tabla
 * Cada tramo: [hasta UVT, tarifa marginal 0-1, impuesto acumulado hasta este tramo en UVT]
 */
export interface RetentionBracket {
  /** Límite superior del tramo en UVT */
  limitUVT: number;
  /** Tarifa marginal en este tramo (0.19 = 19%) */
  marginalRate: number;
  /** Impuesto acumulado en UVT al inicio del tramo */
  accumulatedTaxUVT: number;
}

export const RETENTION_BRACKETS_2026: RetentionBracket[] = [
  { limitUVT: 95, marginalRate: 0, accumulatedTaxUVT: 0 },
  { limitUVT: 150, marginalRate: 0.19, accumulatedTaxUVT: 0 },
  { limitUVT: 360, marginalRate: 0.28, accumulatedTaxUVT: 10.45 },
  { limitUVT: 640, marginalRate: 0.33, accumulatedTaxUVT: 69.25 },
  { limitUVT: 945, marginalRate: 0.35, accumulatedTaxUVT: 169.45 },
  { limitUVT: 2300, marginalRate: 0.37, accumulatedTaxUVT: 276.40 },
  { limitUVT: Infinity, marginalRate: 0.39, accumulatedTaxUVT: 1003.90 },
];
