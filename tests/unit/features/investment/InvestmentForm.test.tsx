/**
 * Unit tests for InvestmentForm component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvestmentForm } from '@/features/investment/InvestmentForm';
import type { InvestmentInput } from '@/domain/investment/investment.types';
import type { ValidationErrors } from '@/types/common.types';

describe('InvestmentForm', () => {
  const defaultInputs: InvestmentInput = {
    initialAmount: 10000,
    monthlyContribution: 500,
    durationMonths: 120,
    annualInterestRate: 7,
    compoundingFrequency: 'monthly',
  };

  const defaultProps = {
    inputs: defaultInputs,
    onInputChange: jest.fn(),
    onCalculate: jest.fn(),
    onReset: jest.fn(),
    errors: {},
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar todos los campos del formulario', () => {
    render(<InvestmentForm {...defaultProps} />);

    expect(screen.getByLabelText(/inversión inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aporte mensual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duración \(meses\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tasa de interés anual/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/frecuencia de capitalización/i)[0]).toBeInTheDocument();
  });

  it('debe mostrar los valores iniciales', () => {
    render(<InvestmentForm {...defaultProps} />);

    expect(screen.getByLabelText(/inversión inicial/i)).toHaveValue(10000);
    expect(screen.getByLabelText(/aporte mensual/i)).toHaveValue(500);
    expect(screen.getByLabelText(/duración \(meses\)/i)).toHaveValue(120);
    expect(screen.getByLabelText(/tasa de interés anual/i)).toHaveValue(7);
  });

  it('debe llamar onInputChange al cambiar la inversión inicial', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<InvestmentForm {...defaultProps} onInputChange={onInputChange} />);

    const initialAmountInput = screen.getByLabelText(/inversión inicial/i);
    await user.clear(initialAmountInput);
    await user.type(initialAmountInput, '20000');

    expect(onInputChange).toHaveBeenCalledWith('initialAmount', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar el aporte mensual', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<InvestmentForm {...defaultProps} onInputChange={onInputChange} />);

    const contributionInput = screen.getByLabelText(/aporte mensual/i);
    await user.clear(contributionInput);
    await user.type(contributionInput, '1000');

    expect(onInputChange).toHaveBeenCalledWith('monthlyContribution', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la duración', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<InvestmentForm {...defaultProps} onInputChange={onInputChange} />);

    const durationInput = screen.getByLabelText(/duración \(meses\)/i);
    await user.clear(durationInput);
    await user.type(durationInput, '240');

    expect(onInputChange).toHaveBeenCalledWith('durationMonths', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la tasa de interés', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<InvestmentForm {...defaultProps} onInputChange={onInputChange} />);

    const rateInput = screen.getByLabelText(/tasa de interés anual/i);
    await user.clear(rateInput);
    await user.type(rateInput, '8.5');

    expect(onInputChange).toHaveBeenCalledWith('annualInterestRate', expect.any(Number));
  });

  it('debe llamar onInputChange al cambiar la frecuencia de capitalización', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    render(<InvestmentForm {...defaultProps} onInputChange={onInputChange} />);

    const frequencySelects = screen.getAllByLabelText(/frecuencia de capitalización/i);
    const frequencySelect = frequencySelects[0];
    await user.click(frequencySelect);

    const annualOption = screen.getByRole('option', { name: /anual/i });
    await user.click(annualOption);

    expect(onInputChange).toHaveBeenCalledWith('compoundingFrequency', 'annually');
  });

  it('debe llamar onCalculate al enviar el formulario', async () => {
    const user = userEvent.setup();
    const onCalculate = jest.fn();
    render(<InvestmentForm {...defaultProps} onCalculate={onCalculate} />);

    const calculateButton = screen.getByRole('button', { name: /calcular proyección/i });
    await user.click(calculateButton);

    expect(onCalculate).toHaveBeenCalled();
  });

  it('debe llamar onReset al hacer clic en Limpiar', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    render(<InvestmentForm {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });

  it('debe mostrar errores de validación', () => {
    const errors: ValidationErrors = {
      initialAmount: 'El monto inicial debe ser mayor a 0',
      annualInterestRate: 'La tasa debe estar entre 0 y 100',
    };

    render(<InvestmentForm {...defaultProps} errors={errors} />);

    expect(screen.getByText(/el monto inicial debe ser mayor a 0/i)).toBeInTheDocument();
    expect(screen.getByText(/la tasa debe estar entre 0 y 100/i)).toBeInTheDocument();
  });

  it('debe mostrar error general si existe', () => {
    const errors: ValidationErrors = {
      general: 'Error al calcular la inversión',
    };

    render(<InvestmentForm {...defaultProps} errors={errors} />);
    expect(screen.getByText(/error al calcular la inversión/i)).toBeInTheDocument();
  });

  it('debe mostrar indicador de carga cuando isCalculating es true', () => {
    render(<InvestmentForm {...defaultProps} isCalculating={true} />);

    expect(screen.getByText(/calculando\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debe deshabilitar botones cuando está calculando', () => {
    render(<InvestmentForm {...defaultProps} isCalculating={true} />);

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    const calculateButton = screen.getByRole('button', { name: /calculando\.\.\./i });

    expect(resetButton).toBeDisabled();
    expect(calculateButton).toBeDisabled();
  });

  it('debe mostrar texto de ayuda con años y meses', () => {
    render(<InvestmentForm {...defaultProps} />);

    // 120 meses = 10 años y 0 meses
    expect(screen.getByText(/10 años y 0 meses/i)).toBeInTheDocument();
  });

  it('debe calcular correctamente años y meses para 125 meses', () => {
    const inputs: InvestmentInput = {
      ...defaultInputs,
      durationMonths: 125,
    };

    render(<InvestmentForm {...defaultProps} inputs={inputs} />);

    // 125 meses = 10 años y 5 meses
    expect(screen.getByText(/10 años y 5 meses/i)).toBeInTheDocument();
  });

  it('debe tener todas las opciones de frecuencia de capitalización', async () => {
    const user = userEvent.setup();
    render(<InvestmentForm {...defaultProps} />);

    const frequencySelects = screen.getAllByLabelText(/frecuencia de capitalización/i);
    const frequencySelect = frequencySelects[0];
    await user.click(frequencySelect);

    expect(screen.getByRole('option', { name: /mensual/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /trimestral/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /anual/i })).toBeInTheDocument();
  });
});
