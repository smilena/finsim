/**
 * Dark theme configuration
 */

import { createTheme } from '@mui/material/styles';
import { darkPalette } from './palette';
import { typography } from './typography';

export const darkTheme = createTheme({
  palette: darkPalette,
  typography,
});
