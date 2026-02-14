/**
 * Unit tests for AppLayout component
 */

import { render, screen } from '@testing-library/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock AppHeader to avoid complex dependencies
jest.mock('@/components/layout/AppHeader', () => ({
  AppHeader: () => <header data-testid="app-header">Header</header>,
}));

const theme = createTheme();

describe('AppLayout', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
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

  it('includes AppHeader component', () => {
    renderWithTheme(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
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
