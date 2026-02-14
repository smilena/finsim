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
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#059669',
    light: '#34d399',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  success: {
    main: '#059669',
  },
  error: {
    main: '#dc2626',
  },
  warning: {
    main: '#d97706',
  },
  info: {
    main: '#0284c7',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
};

/**
 * Dark theme palette - futuristic neon on dark
 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#00d4ff',
    light: '#22e3ff',
    dark: '#00a8cc',
    contrastText: '#080810',
  },
  secondary: {
    main: '#a855f7',
    light: '#c084fc',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  success: {
    main: '#00ff88',
  },
  error: {
    main: '#ff4757',
  },
  warning: {
    main: '#facc15',
  },
  info: {
    main: '#00d4ff',
  },
  background: {
    default: '#080810',
    paper: '#0f0f1a',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    disabled: '#64748b',
  },
};
