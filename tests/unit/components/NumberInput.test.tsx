/**
 * Unit tests for NumberInput component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '@/components/common/NumberInput';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('NumberInput', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders with label', () => {
    renderWithTheme(
      <NumberInput label="Test Input" value={100} onChange={jest.fn()} />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('displays current value', () => {
    renderWithTheme(
      <NumberInput label="Amount" value={1234.56} onChange={jest.fn()} />
    );

    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(input.value).toBe('1234.56');
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();

    renderWithTheme(
      <NumberInput label="Amount" value={100} onChange={handleChange} />
    );

    const input = screen.getByLabelText('Amount');
    fireEvent.change(input, { target: { value: '200' } });

    expect(handleChange).toHaveBeenCalledWith(200);
  });

  it('handles empty input', () => {
    const handleChange = jest.fn();

    renderWithTheme(
      <NumberInput label="Amount" value={100} onChange={handleChange} />
    );

    const input = screen.getByLabelText('Amount');
    fireEvent.change(input, { target: { value: '' } });

    // Al vaciar el campo se notifica '' (salvo allowEmptyAsZero que envía 0)
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('displays error message', () => {
    renderWithTheme(
      <NumberInput
        label="Amount"
        value={100}
        onChange={jest.fn()}
        error="Invalid amount"
      />
    );

    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    renderWithTheme(
      <NumberInput
        label="Amount"
        value={100}
        onChange={jest.fn()}
        helperText="Enter a positive number"
      />
    );

    expect(screen.getByText('Enter a positive number')).toBeInTheDocument();
  });

  it('renders with prefix', () => {
    renderWithTheme(
      <NumberInput
        label="Price"
        value={100}
        onChange={jest.fn()}
        prefix="$"
      />
    );

    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders with suffix', () => {
    renderWithTheme(
      <NumberInput
        label="Rate"
        value={7.5}
        onChange={jest.fn()}
        suffix="%"
      />
    );

    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('applies constraints as input attributes', () => {
    renderWithTheme(
      <NumberInput
        label="Amount"
        value={100}
        onChange={jest.fn()}
        constraints={{ min: 0, max: 1000, step: 0.01 }}
      />
    );

    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('1000');
    expect(input.step).toBe('0.01');
  });

  it('can be marked as required', () => {
    renderWithTheme(
      <NumberInput
        label="Amount"
        value={100}
        onChange={jest.fn()}
        required
      />
    );

    // Required is shown via asterisk in label, not native input.required
    expect(screen.getByText(/\*/)).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    renderWithTheme(
      <NumberInput
        label="Amount"
        value={100}
        onChange={jest.fn()}
        disabled
      />
    );

    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
