/**
 * Empty state placeholder component
 */

'use client';

import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Title
   */
  title: string;

  /**
   * Description
   */
  description: string;

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Empty state placeholder
 * - Icon + title + description
 * - Optional action button
 * - Centered layout
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6 bg-surface rounded-lg mt-8">
      <div className="mb-4 flex justify-center">
        {icon ?? <Calculator className="h-12 w-12 text-foreground-secondary" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground-secondary mb-2">{title}</h3>
      <p className={cn('text-sm text-foreground-secondary', action && 'mb-6')}>{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          <Calculator className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
