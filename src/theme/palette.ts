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
