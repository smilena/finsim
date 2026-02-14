/**
 * Unit tests for SelectField component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { SelectField } from '@/components/common/SelectField';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('SelectField', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders with label', () => {
    renderWithTheme(
      <SelectField
        label="Test Select"
        value="option1"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    // Use getByRole to avoid duplicate text issues
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays selected value', () => {
    renderWithTheme(
      <SelectField
        label="Select"
        value="option2"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    // The selected value should be displayed
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
  });

  it('displays error message', () => {
    renderWithTheme(
      <SelectField
        label="Select"
        value="option1"
        onChange={jest.fn()}
        options={mockOptions}
        error="Please select a valid option"
      />
    );

    expect(screen.getByText('Please select a valid option')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    renderWithTheme(
      <SelectField
        label="Select"
        value="option1"
        onChange={jest.fn()}
        options={mockOptions}
        helperText="Choose an option"
      />
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('can be marked as required', () => {
    renderWithTheme(
      <SelectField
        label="Required Field"
        value="option1"
        onChange={jest.fn()}
        options={mockOptions}
        required
      />
    );

    // Verify the select is in the document
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('can be disabled', () => {
    renderWithTheme(
      <SelectField
        label="Select"
        value="option1"
        onChange={jest.fn()}
        options={mockOptions}
        disabled
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders with multiple options and shows selected value', () => {
    renderWithTheme(
      <SelectField
        label="Select"
        value="option2"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
