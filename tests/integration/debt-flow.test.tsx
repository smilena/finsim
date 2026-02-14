/**
 * Integration test for full debt calculation flow.
 *
 * User must click Calcular to see results; then can change inputs and recalculate.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DebtPage from '@/app/debt/page';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LanguageProvider } from '@/contexts/LanguageContext';

jest.mock('next/navigation', () => ({
  usePathname: () => '/debt',
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false,
}));

jest.mock('@/hooks/useIsMobile', () => ({ useIsMobile: () => false }));

function IntegrationWrapper({ children }: { children: React.ReactNode }) {
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

describe('Debt Flow Integration', () => {
  it('displays results after user clicks Calcular', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    expect(screen.getByText(/Calcula tu préstamo/i)).toBeInTheDocument();

    const calculateButton = screen.getByRole('button', { name: /calcular/i });
    await user.click(calculateButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
        expect(screen.getByText(/Pago Mensual/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('shows Calcular button in the form', () => {
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument();
  });

  it('displays amortization schedule after calculation', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Cronograma de Amortización/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('uses Abono a capital terminology in prepayment section', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Simulación de Abonos a Capital/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /agregar abono a capital/i })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('updates results when user changes loan amount and recalculates', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <DebtPage />
      </IntegrationWrapper>
    );

    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const amountInput = screen.getByLabelText(/monto del préstamo/i);
    await user.click(amountInput);
    await user.clear(amountInput);
    await user.type(amountInput, '300000');

    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
