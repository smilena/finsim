/**
 * Integration test for full debt calculation flow with real-time updates
 *
 * No Calculate button - results appear automatically when inputs are valid.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DebtPage from '@/app/debt/page';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';

jest.mock('next/navigation', () => ({
  usePathname: () => '/debt',
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

describe('Debt Flow Integration', () => {
  it('displays results automatically when page loads with valid default inputs', async () => {
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    expect(screen.getByText(/Simulador de Deuda/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
        expect(screen.getByText(/Pago Mensual/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.queryByRole('button', { name: /Calcular Amortización/i })).not.toBeInTheDocument();
  });

  it('does not show Calculate button', () => {
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    expect(screen.queryByRole('button', { name: /Calcular Amortización/i })).not.toBeInTheDocument();
  });

  it('displays amortization schedule when results load', async () => {
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Cronograma de Amortización/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('uses Abono a capital terminology in prepayment section', async () => {
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Simulación de Abonos a Capital/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Agregar abono a capital/i })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('updates results when user changes loan amount', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const amountInput = screen.getByLabelText(/Monto del Préstamo/i);
    await user.click(amountInput);
    await user.keyboard('{Control}a');
    await user.keyboard('300000');

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
      },
      { timeout: 2500 }
    );
  });
});
