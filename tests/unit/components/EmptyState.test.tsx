/**
 * Unit tests for EmptyState component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '@/components/common/EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No results yet"
        description="Enter your data to see results"
      />
    );

    expect(screen.getByText('No results yet')).toBeInTheDocument();
    expect(screen.getByText('Enter your data to see results')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const onClick = jest.fn();

    render(
      <EmptyState
        title="Empty"
        description="Description"
        action={{ label: 'Calculate', onClick }}
      />
    );

    const button = screen.getByRole('button', { name: /calculate/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action when not provided', () => {
    render(
      <EmptyState title="Empty" description="Description" />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
