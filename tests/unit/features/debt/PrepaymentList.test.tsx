/**
 * Unit tests for PrepaymentList component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PrepaymentList } from '@/features/debt/PrepaymentList';
import type { Prepayment } from '@/domain/debt/debt.types';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('PrepaymentList', () => {
  const mockPrepayments: Prepayment[] = [
    {
      strategy: 'reduce-term',
      monthNumber: 12,
      amount: 5000,
    },
    {
      strategy: 'reduce-payment',
      monthNumber: 24,
      amount: 10000,
    },
  ];

  const defaultProps = {
    prepayments: mockPrepayments,
    onRemovePrepayment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el título con el contador', () => {
    renderWithLanguage(<PrepaymentList {...defaultProps} />);
    expect(screen.getByText(/abonos a capital registrados \(2\)/i)).toBeInTheDocument();
  });

  it('debe mostrar todos los abonos', () => {
    renderWithLanguage(<PrepaymentList {...defaultProps} />);

    expect(screen.getByText(/abono en mes 12: \$5,000/i)).toBeInTheDocument();
    expect(screen.getByText(/reducir plazo/i)).toBeInTheDocument();

    expect(screen.getByText(/abono en mes 24: \$10,000/i)).toBeInTheDocument();
    expect(screen.getByText(/reducir cuota/i)).toBeInTheDocument();
  });

  it('debe llamar onRemovePrepayment al hacer clic en eliminar', async () => {
    const user = userEvent.setup();
    const onRemovePrepayment = jest.fn();
    renderWithLanguage(<PrepaymentList {...defaultProps} onRemovePrepayment={onRemovePrepayment} />);

    const deleteButtons = screen.getAllByLabelText(/eliminar abono/i);
    await user.click(deleteButtons[0]);

    expect(onRemovePrepayment).toHaveBeenCalledWith(0);
  });

  it('no debe mostrar nada cuando no hay abonos', () => {
    const { container } = renderWithLanguage(
      <PrepaymentList prepayments={[]} onRemovePrepayment={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('debe mostrar la estrategia correcta para reduce-term', () => {
    const prepayments: Prepayment[] = [
      {
        strategy: 'reduce-term',
        monthNumber: 6,
        amount: 3000,
      },
    ];

    renderWithLanguage(<PrepaymentList prepayments={prepayments} onRemovePrepayment={jest.fn()} />);
    expect(screen.getByText(/reducir plazo/i)).toBeInTheDocument();
    expect(screen.getByText(/reducir el plazo del préstamo/i)).toBeInTheDocument();
  });

  it('debe mostrar la estrategia correcta para reduce-payment', () => {
    const prepayments: Prepayment[] = [
      {
        strategy: 'reduce-payment',
        monthNumber: 6,
        amount: 3000,
      },
    ];

    renderWithLanguage(<PrepaymentList prepayments={prepayments} onRemovePrepayment={jest.fn()} />);
    expect(screen.getByText(/reducir cuota/i)).toBeInTheDocument();
    expect(screen.getByText(/reducir la cuota mensual/i)).toBeInTheDocument();
  });

  it('debe renderizar múltiples botones de eliminar', () => {
    renderWithLanguage(<PrepaymentList {...defaultProps} />);
    const deleteButtons = screen.getAllByLabelText(/eliminar abono/i);
    expect(deleteButtons).toHaveLength(2);
  });

  it('debe mostrar el monto formateado correctamente', () => {
    const prepayments: Prepayment[] = [
      {
        strategy: 'reduce-term',
        monthNumber: 1,
        amount: 123456.78,
      },
    ];

    renderWithLanguage(<PrepaymentList prepayments={prepayments} onRemovePrepayment={jest.fn()} />);
    expect(screen.getByText(/\$123,456\.78/i)).toBeInTheDocument();
  });
});
