/**
 * Integration test for theme switching across components
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false,
}));

function ThemeToggleWithContext() {
  const { mode, toggleTheme } = useThemeMode();
  return <ThemeToggle mode={mode} onToggle={toggleTheme} />;
}

function TestThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeMode();
  const theme = createTheme({ palette: { mode: themeMode.mode } });
  return (
    <ThemeModeProvider value={themeMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeModeProvider>
  );
}

describe('Theme Switching Integration', () => {
  it('ThemeToggle displays correct aria-label based on mode', () => {
    render(
      <TestThemeWrapper>
        <ThemeToggleWithContext />
      </TestThemeWrapper>
    );

    const toggle = screen.getByRole('button', { name: /tema oscuro/i });
    expect(toggle).toBeInTheDocument();
  });

  it('ThemeToggle switches label when clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestThemeWrapper>
        <ThemeToggleWithContext />
      </TestThemeWrapper>
    );

    const toggle = screen.getByRole('button', { name: /tema oscuro/i });
    await user.click(toggle);

    expect(screen.getByRole('button', { name: /tema claro/i })).toBeInTheDocument();
  });
});
