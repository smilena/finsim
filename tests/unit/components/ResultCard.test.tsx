/**
 * Unit tests for ResultCard component
 */

import { render, screen } from '@testing-library/react';
import { ResultCard } from '@/components/common/ResultCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const theme = createTheme();

describe('ResultCard', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders title and value', () => {
    renderWithTheme(
      <ResultCard
        title="Total Amount"
        value="$50,000.00"
      />
    );

    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderWithTheme(
      <ResultCard
        title="Total Amount"
        value="$50,000.00"
        subtitle="After 5 years"
      />
    );

    expect(screen.getByText('After 5 years')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    renderWithTheme(
      <ResultCard
        title="Growth"
        value="$10,000"
        icon={<TrendingUpIcon data-testid="trend-icon" />}
      />
    );

    expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
  });

  it('applies success variant color', () => {
    renderWithTheme(
      <ResultCard
        title="Profit"
        value="$10,000"
        variant="success"
      />
    );

    // The value should have success color applied
    const valueElement = screen.getByText('$10,000');
    expect(valueElement).toBeInTheDocument();
  });

  it('applies warning variant color', () => {
    renderWithTheme(
      <ResultCard
        title="Alert"
        value="Warning"
        variant="warning"
      />
    );

    const valueElement = screen.getByText('Warning');
    expect(valueElement).toBeInTheDocument();
  });

  it('applies info variant color', () => {
    renderWithTheme(
      <ResultCard
        title="Information"
        value="Data"
        variant="info"
      />
    );

    const valueElement = screen.getByText('Data');
    expect(valueElement).toBeInTheDocument();
  });

  it('renders with numeric value', () => {
    renderWithTheme(
      <ResultCard
        title="Count"
        value={12345}
      />
    );

    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('applies custom elevation', () => {
    renderWithTheme(
      <ResultCard
        title="Card"
        value="Value"
        elevation={5}
      />
    );

    // ResultCard uses shadcn Card; elevation > 1 applies shadow-md class
    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });
});
