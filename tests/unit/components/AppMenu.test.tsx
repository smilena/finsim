/**
 * Unit tests for AppMenu component
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { AppMenu } from '@/components/layout/AppMenu';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import type { MenuItem } from '@/types/common.types';
import { Home } from 'lucide-react';

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return React.forwardRef(({ children, href }: any, ref: any) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { href, ref });
    }
    return <a href={href} ref={ref}>{children}</a>;
  });
});

const theme = createTheme();
const themeModeValue = { mode: 'light' as const, toggleTheme: jest.fn(), setTheme: jest.fn() };

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider value={themeModeValue}>
      <MuiThemeProvider theme={theme}>
        <LanguageProvider>{children}</LanguageProvider>
      </MuiThemeProvider>
    </ThemeModeProvider>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  return render(<AllProviders>{ui}</AllProviders>);
}

const mockMenuItems: MenuItem[] = [
  { label: 'Inicio', path: '/', icon: <Home /> },
  { label: 'Inversión', path: '/investment' },
  { label: 'Deuda', path: '/debt' },
];

describe('AppMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop mode', () => {
    it('renders all menu items as buttons', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={false} onClose={jest.fn()} isMobile={false} />
      );

      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Inversión')).toBeInTheDocument();
      expect(screen.getByText('Deuda')).toBeInTheDocument();
    });

    it('renders navigation with correct structure', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={false} onClose={jest.fn()} isMobile={false} />
      );

      // Verify navigation exists
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders all navigation items', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={false} onClose={jest.fn()} isMobile={false} />
      );

      // Check all items are rendered
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Inversión')).toBeInTheDocument();
      expect(screen.getByText('Deuda')).toBeInTheDocument();
    });
  });

  describe('Mobile mode', () => {
    it('renders sheet when open', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={true} onClose={jest.fn()} isMobile={true} />
      );

      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Inversión')).toBeInTheDocument();
      expect(screen.getByText('Deuda')).toBeInTheDocument();
    });

    it('renders all items in mobile sheet', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={true} onClose={jest.fn()} isMobile={true} />
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      // In mobile, items are rendered as links inside buttons
      expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3);
    });

    it('renders sheet with correct open state', () => {
      const { rerender } = renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={false} onClose={jest.fn()} isMobile={true} />
      );

      // When open, it should be visible
      rerender(
        <AllProviders>
          <AppMenu items={mockMenuItems} currentPath="/" isOpen={true} onClose={jest.fn()} isMobile={true} />
        </AllProviders>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has navigation landmark on desktop', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={false} onClose={jest.fn()} isMobile={false} />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has navigation landmark on mobile', () => {
      renderWithProviders(
        <AppMenu items={mockMenuItems} currentPath="/" isOpen={true} onClose={jest.fn()} isMobile={true} />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
