/**
 * Responsive navigation menu
 */

'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { MenuItem } from '@/types/common.types';

export interface AppMenuProps {
  /**
   * Navigation menu items
   */
  items: MenuItem[];

  /**
   * Current active path
   */
  currentPath: string;

  /**
   * Whether mobile menu is open (only applies on mobile)
   */
  isOpen: boolean;

  /**
   * Callback to close mobile menu
   */
  onClose: () => void;

  /**
   * Whether this is mobile mode
   */
  isMobile: boolean;
}

/**
 * Responsive navigation menu
 * - Desktop (>= md breakpoint): Horizontal menu in AppBar
 * - Mobile (< md breakpoint): Sheet sidebar
 */
export function AppMenu({ items, currentPath, isOpen, onClose, isMobile }: AppMenuProps) {
  // Desktop horizontal menu
  if (!isMobile) {
    return (
      <nav aria-label="Main navigation" className="flex gap-2">
        {items.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              className={cn(isActive && 'font-bold underline')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Link href={item.path}>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    );
  }

  // Mobile sheet menu
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left">
        <nav aria-label="Main navigation" className="mt-8">
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <li key={item.path}>
                  <Button
                    asChild
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start', isActive && 'font-bold')}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Link href={item.path}>
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
