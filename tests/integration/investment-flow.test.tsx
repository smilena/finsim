/**
 * Integration test for full investment calculation flow
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvestmentPage from '@/app/investment/page';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';

jest.mock('next/navigation', () => ({
  usePathname: () => '/investment',
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false,
}));

function IntegrationWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeMode();
  const theme = createTheme({ palette: { mode: themeMode.mode } });
  return (
    <ThemeModeProvider value={themeMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeModeProvider>
  );
}

describe('Investment Flow Integration', () => {
  it('calculates investment projection when user fills form and clicks calculate', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    expect(screen.getByText(/Simulador de Inversión/i)).toBeInTheDocument();

    const calculateButton = screen.getByRole('button', {
      name: /Calcular Proyección/i,
    });
    await user.click(calculateButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resultados de la Proyección/i)).toBeInTheDocument();
        expect(screen.getByText(/Inversión Total/i)).toBeInTheDocument();
        expect(screen.getByText(/Valor Final/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('shows empty state before calculation', () => {
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    expect(screen.getByText(/Ingresa los datos de tu inversión/i)).toBeInTheDocument();
  });

  it('shows results and breakdown after successful calculation', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    const calculateButton = screen.getByRole('button', {
      name: /Calcular Proyección/i,
    });
    await user.click(calculateButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resultados de la Proyección/i)).toBeInTheDocument();
        expect(screen.getByText(/Intereses Ganados/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
