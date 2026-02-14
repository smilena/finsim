/**
 * Unit tests for AppHeader component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// AppHeader uses useResponsiveMenu -> useIsMobile (window), not MUI useMediaQuery
const mockIsMobile = jest.fn();
jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => mockIsMobile(),
}));

/**
 * Test wrapper - ThemeModeContext + LanguageProvider (Spanish labels)
 */
function TestThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeMode();
  const theme = createTheme({ palette: { mode: themeMode.mode } });

  return (
    <ThemeModeProvider value={themeMode}>
      <MuiThemeProvider theme={theme}>
        <LanguageProvider>{children}</LanguageProvider>
      </MuiThemeProvider>
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
    mockIsMobile.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    expect(screen.getByText('Simuladores Financieros')).toBeInTheDocument();
  });

  it('shows mobile menu button on mobile viewport', () => {
    mockIsMobile.mockReturnValue(true); // Mobile

    renderWithTheme(<AppHeader />);

    const menuButton = screen.getByLabelText(/abrir menú/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('does not show mobile menu button on desktop viewport', () => {
    mockIsMobile.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    const menuButton = screen.queryByLabelText(/abrir menú/i);
    expect(menuButton).not.toBeInTheDocument();
  });

  it('shows navigation links on desktop', () => {
    mockIsMobile.mockReturnValue(false); // Desktop

    renderWithTheme(<AppHeader />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Inversión')).toBeInTheDocument();
    expect(screen.getByText('Deuda')).toBeInTheDocument();
  });

  it('opens mobile menu when button is clicked', () => {
    mockIsMobile.mockReturnValue(true); // Mobile

    renderWithTheme(<AppHeader />);

    const menuButton = screen.getByLabelText(/abrir menú/i);
    fireEvent.click(menuButton);

    // Menu should be rendered (drawer component)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
