/**
 * Main application layout wrapper - sidebar + content
 */

'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsiveMenu } from '@/hooks/useResponsiveMenu';
import { AppSidebar } from './AppSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AppLayoutProps {
  /**
   * Page content
   */
  children: ReactNode;
}

/**
 * Main application layout
 * - Desktop: fixed sidebar left, content right
 * - Mobile: hamburger opens sidebar as sheet overlay
 * - Skip link for keyboard accessibility
 * - Gradient background
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useLanguage();
  const { isMobile, isOpen, toggleMenu, closeMenu } = useResponsiveMenu();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#080810] via-[#0f0f1a] to-[#0a0a14]">
      {/* Skip to main content - accessibility for keyboard users */}
      <a
        href="#main-content"
        className={cn(
          'absolute -left-[9999px] top-0 z-[9999] rounded bg-primary p-3 text-primary-foreground no-underline',
          'focus:left-4 focus:top-4'
        )}
      >
        {t('nav.skipToContent')}
      </a>

      {/* Desktop: fixed sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface md:block',
          'w-56'
        )}
        aria-label="Sidebar"
      >
        <AppSidebar />
      </aside>

      {/* Mobile: hamburger header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-surface px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={t('nav.openMenu')}
            aria-expanded={isOpen}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="ml-3 text-lg font-semibold text-foreground">
            {t('nav.appTitle')}
          </h1>
        </header>
      )}

      {/* Mobile: sidebar as sheet overlay */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeMenu()}>
        <SheetContent side="left" className="w-72 border-border bg-surface p-0">
          <AppSidebar onClose={closeMenu} compact />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'flex-1 py-6',
          isMobile ? 'pt-20' : '',
          'md:pl-56'
        )}
      >
        <div className="container mx-auto max-w-6xl px-4">{children}</div>
      </main>
    </div>
  );
}
