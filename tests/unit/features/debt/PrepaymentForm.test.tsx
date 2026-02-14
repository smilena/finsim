/**
 * Unit tests for PrepaymentForm component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrepaymentForm } from '@/features/debt/PrepaymentForm';
import type { ValidationErrors } from '@/types/common.types';

describe('PrepaymentForm', () => {
  const defaultProps = {
    onAddPrepayment: jest.fn(),
    onClearErrors: jest.fn(),
    errors: {},
    maxMonth: 360,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar todos los campos del formulario', () => {
    render(<PrepaymentForm {...defaultProps} />);

    expect(screen.getByText(/estrategia de abono a capital/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mes del abono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto del abono/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar abono a capital/i })).toBeInTheDocument();
  });

  it('debe permitir seleccionar una estrategia', async () => {
    const user = userEvent.setup();
    render(<PrepaymentForm {...defaultProps} />);

    const reducePaymentRadio = screen.getByRole('radio', { name: /reducir la cuota mensual/i });
    await user.click(reducePaymentRadio);

    expect(reducePaymentRadio).toBeChecked();
  });

  it('debe permitir ingresar mes y monto', async () => {
    const user = userEvent.setup();
    render(<PrepaymentForm {...defaultProps} />);

    const monthInput = screen.getByLabelText(/mes del abono/i);
    const amountInput = screen.getByLabelText(/monto del abono/i);

    await user.clear(monthInput);
    await user.type(monthInput, '24');
    expect(monthInput).toHaveValue(24);

    await user.clear(amountInput);
    await user.type(amountInput, '5000');
    expect(amountInput).toHaveValue(5000);
  });

  it('debe llamar onAddPrepayment con los valores correctos al enviar', async () => {
    const user = userEvent.setup();
    const onAddPrepayment = jest.fn();
    render(<PrepaymentForm {...defaultProps} onAddPrepayment={onAddPrepayment} />);

    // Ingresar mes
    const monthInput = screen.getByLabelText(/mes del abono/i);
    await user.clear(monthInput);
    await user.type(monthInput, '24');

    // Ingresar monto
    const amountInput = screen.getByLabelText(/monto del abono/i);
    await user.clear(amountInput);
    await user.type(amountInput, '5000');

    // Enviar
    const addButton = screen.getByRole('button', { name: /agregar abono a capital/i });
    await user.click(addButton);

    expect(onAddPrepayment).toHaveBeenCalledWith({
      strategy: 'reduce-term',
      monthNumber: 24,
      amount: 5000,
    });
  });

  it('debe limpiar el formulario después de agregar', async () => {
    const user = userEvent.setup();
    const onAddPrepayment = jest.fn();
    render(<PrepaymentForm {...defaultProps} onAddPrepayment={onAddPrepayment} />);

    // Llenar formulario
    const monthInput = screen.getByLabelText(/mes del abono/i);
    await user.clear(monthInput);
    await user.type(monthInput, '24');

    const amountInput = screen.getByLabelText(/monto del abono/i);
    await user.clear(amountInput);
    await user.type(amountInput, '5000');

    // Enviar
    const addButton = screen.getByRole('button', { name: /agregar abono a capital/i });
    await user.click(addButton);

    // Verificar que se limpió (valores por defecto)
    expect(monthInput).toHaveValue(12);
    expect(amountInput).toHaveValue(10000);
  });

  it('debe mostrar errores de validación', () => {
    const errors: ValidationErrors = {
      monthNumber: 'El mes debe estar entre 1 y 360',
      amount: 'El monto debe ser mayor a 0',
    };

    render(<PrepaymentForm {...defaultProps} errors={errors} />);

    // Los errores se muestran en los helperText de NumberInput
    expect(screen.getByText(/el mes debe estar entre 1 y 360/i)).toBeInTheDocument();
    expect(screen.getByText(/el monto debe ser mayor a 0/i)).toBeInTheDocument();
  });

  it('debe llamar onClearErrors al cambiar valores', async () => {
    const user = userEvent.setup();
    const onClearErrors = jest.fn();
    render(<PrepaymentForm {...defaultProps} onClearErrors={onClearErrors} />);

    const monthInput = screen.getByLabelText(/mes del abono/i);
    await user.clear(monthInput);
    await user.type(monthInput, '24');

    expect(onClearErrors).toHaveBeenCalled();
  });

  it('debe validar el mes máximo', () => {
    render(<PrepaymentForm {...defaultProps} maxMonth={120} />);

    const monthInput = screen.getByLabelText(/mes del abono/i);
    expect(monthInput).toHaveAttribute('max', '120');
  });

  it('debe mostrar ambas opciones de estrategia', () => {
    render(<PrepaymentForm {...defaultProps} />);

    expect(screen.getByRole('radio', { name: /reducir el plazo del préstamo/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /reducir la cuota mensual/i })).toBeInTheDocument();
  });
});
