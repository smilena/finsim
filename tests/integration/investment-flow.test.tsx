/**
 * Integration test for full investment calculation flow
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvestmentPage from '@/app/investment/page';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LanguageProvider } from '@/contexts/LanguageContext';

jest.mock('next/navigation', () => ({
  usePathname: () => '/investment',
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

describe('Investment Flow Integration', () => {
  async function fillInvestmentForm(user: ReturnType<typeof userEvent.setup>) {
    const initialInput = screen.getByLabelText(/Inversión Inicial|Initial Investment/i);
    const contributionInput = screen.getByLabelText(/Aporte Mensual|Monthly Contribution/i);
    const durationInput = screen.getByLabelText(/Duración \(meses\)|Duration \(months\)/i);
    const rateInput = screen.getByLabelText(/Tasa de Interés Anual|Annual Interest Rate/i);
    await user.clear(initialInput);
    await user.type(initialInput, '10000');
    await user.clear(contributionInput);
    await user.type(contributionInput, '500');
    await user.clear(durationInput);
    await user.type(durationInput, '60');
    await user.clear(rateInput);
    await user.type(rateInput, '7');
  }

  it('calculates investment projection when user fills form and clicks calculate', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    expect(screen.getAllByRole('heading', { name: /Simulador de Inversión/i }).length).toBeGreaterThan(0);

    await fillInvestmentForm(user);

    const calculateButton = screen.getByRole('button', { name: /calcular/i });
    await user.click(calculateButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Invertido/i)).toBeInTheDocument();
        expect(screen.getByText(/Valor Final/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('shows empty state before calculation', () => {
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    expect(screen.getAllByRole('heading', { name: /Simulador de Inversión/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Proyecta el crecimiento de tu inversión/i).length).toBeGreaterThan(0);
  });

  it('shows results and breakdown after successful calculation', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationWrapper>
        <InvestmentPage />
      </IntegrationWrapper>
    );

    await fillInvestmentForm(user);

    const calculateButton = screen.getByRole('button', { name: /calcular/i });
    await user.click(calculateButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resumen de Resultados/i)).toBeInTheDocument();
        expect(screen.getByText(/Intereses Ganados/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
