/**
 * Section container with title and consistent spacing
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionContainerProps {
  /**
   * Section title
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Section content
   */
  children: ReactNode;

  /**
   * Maximum width
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

/**
 * Section container with title and consistent spacing
 * - Responsive max-width
 * - Consistent vertical spacing
 * - Typography hierarchy (title is h2, subtitle is body)
 */
export function SectionContainer({
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}: SectionContainerProps) {
  return (
    <div className={cn('mx-auto px-4', maxWidthClasses[maxWidth])}>
      <div className="mb-8">
        <h2 className={cn('text-3xl font-semibold text-foreground', subtitle ? 'mb-2' : 'mb-4')}>
          {title}
        </h2>
        {subtitle && <p className="text-base text-foreground-secondary">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
