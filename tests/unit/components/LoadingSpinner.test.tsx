/**
 * Unit tests for LoadingSpinner component
 */

import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Calculating..." />);

    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<LoadingSpinner message="Processing" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Processing');
  });
});
