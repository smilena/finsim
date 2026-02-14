/**
 * Result card component for displaying calculated results
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export interface ResultCardProps {
  /**
   * Card title/label
   */
  title: string;

  /**
   * Main value to display
   */
  value: string | number;

  /**
   * Optional subtitle or secondary value
   */
  subtitle?: string;

  /**
   * Optional icon
   */
  icon?: ReactNode;

  /**
   * Optional color variant
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'info';

  /**
   * Optional elevation (box shadow)
   * @default 1
   */
  elevation?: number;
}

/**
 * Card for displaying calculation results
 * - Clean typography hierarchy
 * - Optional color variants
 * - Optional icon
 */
export function ResultCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  elevation = 1,
}: ResultCardProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={cn(elevation === 0 && 'shadow-none', elevation > 1 && 'shadow-md')}>
      <CardContent className="pt-6">
        {icon && <div className="flex items-center mb-2">{icon}</div>}
        <p className="text-sm text-foreground-secondary mb-1">{title}</p>
        <h4 className={cn('text-4xl font-semibold', getVariantColor(), subtitle && 'mb-2')}>
          {value}
        </h4>
        {subtitle && <p className="text-sm text-foreground-secondary">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
