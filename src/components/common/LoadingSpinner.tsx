/**
 * Loading indicator component
 */

'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Loading message
   * @default 'Loading...'
   */
  message?: string;

  /**
   * Size of spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 'h-6 w-6',
  medium: 'h-10 w-10',
  large: 'h-14 w-14',
};

/**
 * Loading spinner with optional message
 * - Lucide React icon with animation
 * - Centered in container
 * - Accessible (role="status")
 */
export function LoadingSpinner({ message = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-6"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
      {message && <p className="text-sm text-foreground-secondary">{message}</p>}
    </div>
  );
}
