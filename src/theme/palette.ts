/**
 * Calming color palettes for financial application
 * Conveys trust, stability, and tranquility
 */

import type { PaletteOptions } from '@mui/material/styles';

/**
 * Light theme palette - Invecont vivo (cyan, púrpura, fondos claros)
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0891b2',
    light: '#06b6d4',
    dark: '#0e7490',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7c3aed',
    light: '#8b5cf6',
    dark: '#6d28d9',
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
    main: '#0891b2',
  },
  background: {
    default: '#f0f4ff',
    paper: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
};

/**
 * Dark theme palette - concepto Invecont (índigo, cyan, púrpura)
 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#5dedff',
    light: '#22d3ee',
    dark: '#00c2ff',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9471f8',
    light: '#a78bfa',
    dark: '#876dfd',
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
    main: '#5dedff',
  },
  background: {
    default: '#0a0c2d',
    paper: '#171b36',
  },
  text: {
    primary: '#ffffff',
    secondary: '#e0e0e0',
    disabled: '#a0a0a0',
  },
};
