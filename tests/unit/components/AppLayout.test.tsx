/**
 * Unit tests for AppLayout component
 */

import { render, screen } from '@testing-library/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';

// AppLayout uses useIsMobile for responsive menu
jest.mock('@/hooks/useIsMobile', () => ({ useIsMobile: () => false }));

const theme = createTheme();

const themeModeValue = {
  mode: 'light' as const,
  toggleTheme: () => {},
  setTheme: () => {},
};

describe('AppLayout', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <ThemeModeProvider value={themeModeValue}>{ui}</ThemeModeProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  };

  it('renders children content', () => {
    renderWithTheme(
      <AppLayout>
        <div data-testid="test-content">Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('includes sidebar and main content area', () => {
    renderWithTheme(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText(/sidebar/i)).toBeInTheDocument();
  });

  it('wraps content in main element with proper role', () => {
    renderWithTheme(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    const { container } = renderWithTheme(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
