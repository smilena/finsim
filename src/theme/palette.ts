/**
 * Calming color palettes for financial application
 * Conveys trust, stability, and tranquility
 */

import type { PaletteOptions } from '@mui/material/styles';

/**
 * Light theme palette - soft blues and greens
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#4f46e5',
    light: '#818cf8',
    dark: '#4338ca',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#0d9488',
    light: '#2dd4bf',
    dark: '#0f766e',
    contrastText: '#ffffff',
  },
  success: {
    main: '#16a34a',
  },
  error: {
    main: '#e11d48',
  },
  warning: {
    main: '#f59e0b',
  },
  info: {
    main: '#0ea5e9',
  },
  background: {
    default: '#f7f8fc',
    paper: '#ffffff',
  },
  text: {
    primary: '#0b1220',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
};

/**
 * Dark theme palette - estilo SaaS empresarial (inspirado en invecont-site)
 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#0c1222',
  },
  secondary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',
  },
  error: {
    main: '#ef4444',
  },
  warning: {
    main: '#f59e0b',
  },
  info: {
    main: '#06b6d4',
  },
  background: {
    default: '#0c1222',
    paper: '#111827',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    disabled: '#64748b',
  },
};
