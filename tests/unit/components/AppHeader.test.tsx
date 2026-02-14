/**
 * Unit tests for AppHeader component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useMediaQuery } from '@mui/material';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock MUI useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

/**
 * Test wrapper - provides ThemeModeContext without AppRouterCacheProvider (which fails in Jest)
 */
function TestThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeMode();
  const theme = createTheme({ palette: { mode: themeMode.mode } });

  return (
    <ThemeModeProvider value={themeMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeModeProvider>
  );
}

describe('AppHeader', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<TestThemeWrapper>{ui}</TestThemeWrapper>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app title', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    expect(screen.getByText('Simuladores Financieros')).toBeInTheDocument();
  });

  it('shows mobile menu button on mobile viewport', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    renderWithTheme(<AppHeader />);

    const menuButton = screen.getByLabelText(/abrir menú/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('does not show mobile menu button on desktop viewport', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    const menuButton = screen.queryByLabelText(/abrir menú/i);
    expect(menuButton).not.toBeInTheDocument();
  });

  it('shows navigation links on desktop', () => {
    mockUseMediaQuery.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Inversión')).toBeInTheDocument();
    expect(screen.getByText('Deuda')).toBeInTheDocument();
  });

  it('opens mobile menu when button is clicked', () => {
    mockUseMediaQuery.mockReturnValue(true); // Mobile

    renderWithTheme(<AppHeader />);

    const menuButton = screen.getByLabelText(/abrir menú/i);
    fireEvent.click(menuButton);

    // Menu should be rendered (drawer component)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
