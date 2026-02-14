/**
 * Light theme configuration
 */

import { createTheme } from '@mui/material/styles';
import { lightPalette } from './palette';
import { typography } from './typography';

export const lightTheme = createTheme({
  palette: lightPalette,
  typography,
});
