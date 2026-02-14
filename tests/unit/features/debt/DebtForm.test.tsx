/**
 * Unit tests for DebtForm component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DebtForm } from '@/features/debt/DebtForm';
import type { DebtInput } from '@/domain/debt/debt.types';
import type { ValidationErrors } from '@/types/common.types';

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
    render(<DebtForm {...defaultProps} />);

    expect(screen.getByLabelText(/monto del préstamo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tasa de interés anual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plazo del préstamo/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/frecuencia de pago/i)[0]).toBeInTheDocument();
  });

  it('debe mostrar los valores iniciales', () => {
    render(<DebtForm {...defaultProps} />);

    expect(screen.getByLabelText(/monto del préstamo/i)).toHaveValue(200000);
    expect(screen.getByLabelText(/tasa de interés anual/i)).toHaveValue(5);
    expect(screen.getByLabelText(/plazo del préstamo/i)).toHaveValue(360);
  });

  it('debe llamar onInputChange al cambiar el monto', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const amountInput = screen.getByLabelText(/monto del préstamo/i);
    await user.clear(amountInput);
    await user.type(amountInput, '300000');

    expect(onInputChange).toHaveBeenCalledWith('loanAmount', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la tasa', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const rateInput = screen.getByLabelText(/tasa de interés anual/i);
    await user.clear(rateInput);
    await user.type(rateInput, '6.5');

    expect(onInputChange).toHaveBeenCalledWith('annualInterestRate', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar el plazo', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const termInput = screen.getByLabelText(/plazo del préstamo/i);
    await user.clear(termInput);
    await user.type(termInput, '240');

    expect(onInputChange).toHaveBeenCalledWith('termMonths', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la frecuencia', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<DebtForm {...defaultProps} onInputChange={onInputChange} />);

    const frequencySelects = screen.getAllByLabelText(/frecuencia de pago/i);
    const frequencySelect = frequencySelects[0];
    await user.click(frequencySelect);
    
    const biWeeklyOption = screen.getByRole('option', { name: /quincenal/i });
    await user.click(biWeeklyOption);

    expect(onInputChange).toHaveBeenCalledWith('paymentFrequency', 'bi-weekly');
  });

  it('debe llamar onReset al hacer clic en Limpiar', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    render(<DebtForm {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });

  it('debe mostrar errores de validación', () => {
    const errors: ValidationErrors = {
      loanAmount: 'El monto debe ser mayor a 0',
      annualInterestRate: 'La tasa debe estar entre 0 y 100',
    };

    render(<DebtForm {...defaultProps} errors={errors} />);

    expect(screen.getByText(/el monto debe ser mayor a 0/i)).toBeInTheDocument();
    expect(screen.getByText(/la tasa debe estar entre 0 y 100/i)).toBeInTheDocument();
  });

  it('debe mostrar error general si existe', () => {
    const errors: ValidationErrors = {
      general: 'Error al calcular',
    };

    render(<DebtForm {...defaultProps} errors={errors} />);
    expect(screen.getByText(/error al calcular/i)).toBeInTheDocument();
  });

  it('debe mostrar indicador de carga cuando isCalculating es true', () => {
    render(<DebtForm {...defaultProps} isCalculating={true} />);

    expect(screen.getByText(/calculando/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debe deshabilitar el botón Limpiar cuando está calculando', () => {
    render(<DebtForm {...defaultProps} isCalculating={true} />);

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    expect(resetButton).toBeDisabled();
  });

  it('debe mostrar texto de ayuda con años y meses', () => {
    render(<DebtForm {...defaultProps} />);

    // 360 meses = 30 años y 0 meses
    expect(screen.getByText(/30 años y 0 meses/i)).toBeInTheDocument();
  });

  it('debe calcular correctamente años y meses para 365 meses', () => {
    const inputs: DebtInput = {
      ...defaultInputs,
      termMonths: 365,
    };

    render(<DebtForm {...defaultProps} inputs={inputs} />);

    // 365 meses = 30 años y 5 meses
    expect(screen.getByText(/30 años y 5 meses/i)).toBeInTheDocument();
  });
});
