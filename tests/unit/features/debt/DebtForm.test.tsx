/**
 * Unit tests for DebtForm component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DebtForm } from '@/features/debt/DebtForm';
import type { DebtInput } from '@/domain/debt/debt.types';
import type { ValidationErrors } from '@/types/common.types';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('DebtForm', () => {
  const defaultInputs: DebtInput = {
    loanAmount: 200000,
    annualInterestRate: 5,
    termMonths: 360,
    paymentFrequency: 'monthly',
  };

  const defaultProps = {
    inputs: defaultInputs,
    onInputChange: jest.fn(),
    onReset: jest.fn(),
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar todos los campos del formulario', () => {
    renderWithLanguage(<DebtForm {...defaultProps} />);

    expect(screen.getByLabelText(/monto del préstamo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tasa de interés anual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plazo del préstamo/i)).toBeInTheDocument();
  });

  it('debe mostrar los valores iniciales', () => {
    renderWithLanguage(<DebtForm {...defaultProps} />);

    expect(screen.getByLabelText(/monto del préstamo/i)).toHaveValue(200000);
    expect(screen.getByLabelText(/tasa de interés anual/i)).toHaveValue(5);
    expect(screen.getByLabelText(/plazo del préstamo/i)).toHaveValue(360);
  });

  it('debe llamar onInputChange al cambiar el monto', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    renderWithLanguage(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const amountInput = screen.getByLabelText(/monto del préstamo/i);
    await user.clear(amountInput);
    await user.type(amountInput, '300000');

    expect(onInputChange).toHaveBeenCalledWith('loanAmount', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la tasa', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    renderWithLanguage(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const rateInput = screen.getByLabelText(/tasa de interés anual/i);
    await user.clear(rateInput);
    await user.type(rateInput, '6.5');

    expect(onInputChange).toHaveBeenCalledWith('annualInterestRate', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar el plazo', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    renderWithLanguage(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const termInput = screen.getByLabelText(/plazo del préstamo/i);
    await user.clear(termInput);
    await user.type(termInput, '240');

    expect(onInputChange).toHaveBeenCalledWith('termMonths', expect.any(Number));
  });

  it('debe llamar onReset al hacer clic en Limpiar', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    renderWithLanguage(<DebtForm {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });

  it('debe mostrar errores de validación', () => {
    const errors: ValidationErrors = {
      loanAmount: 'El monto debe ser mayor a 0',
      annualInterestRate: 'La tasa debe estar entre 0 y 100',
    };

    renderWithLanguage(<DebtForm {...defaultProps} errors={errors} />);

    expect(screen.getByText(/el monto debe ser mayor a 0/i)).toBeInTheDocument();
    expect(screen.getByText(/la tasa debe estar entre 0 y 100/i)).toBeInTheDocument();
  });

  it('debe mostrar error general si existe', () => {
    const errors: ValidationErrors = {
      general: 'Error al calcular',
    };

    renderWithLanguage(<DebtForm {...defaultProps} errors={errors} />);
    expect(screen.getByText(/error al calcular/i)).toBeInTheDocument();
  });

  it('debe mostrar indicador de carga cuando isCalculating es true', () => {
    renderWithLanguage(
      <DebtForm {...defaultProps} onCalculate={jest.fn()} isCalculating={true} />
    );

    expect(screen.getByText(/calculando/i)).toBeInTheDocument();
  });

  it('debe deshabilitar el botón Limpiar cuando está calculando', () => {
    renderWithLanguage(
      <DebtForm {...defaultProps} onCalculate={jest.fn()} isCalculating={true} />
    );

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    expect(resetButton).toBeDisabled();
  });

  it('debe mostrar texto de ayuda con años y meses', () => {
    renderWithLanguage(<DebtForm {...defaultProps} />);

    // 360 meses = 30 años y 0 meses
    expect(screen.getByText(/30 años y 0 meses/i)).toBeInTheDocument();
  });

  it('debe calcular correctamente años y meses para 365 meses', () => {
    const inputs: DebtInput = {
      ...defaultInputs,
      termMonths: 365,
    };

    renderWithLanguage(<DebtForm {...defaultProps} inputs={inputs} />);

    // 365 meses = 30 años y 5 meses
    expect(screen.getByText(/30 años y 5 meses/i)).toBeInTheDocument();
  });
});
