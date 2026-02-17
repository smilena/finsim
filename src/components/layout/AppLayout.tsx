/**
 * Main application layout wrapper - sidebar + content
 */

'use client';

import { ReactNode, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsiveMenu } from '@/hooks/useResponsiveMenu';
import { useThemeModeContext } from '@/theme/ThemeModeContext';
import { AppSidebar } from './AppSidebar';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
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
 * - Desktop: sidebar visible, logo toggles collapse
 * - Mobile: sidebar hidden, header with hamburger opens sheet
 * - Skip link for keyboard accessibility
 */
const SIDEBAR_WIDTH_EXPANDED = 'w-56';
const SIDEBAR_WIDTH_COLLAPSED = 'w-16';
const MAIN_PL_EXPANDED = 'md:pl-56';
const MAIN_PL_COLLAPSED = 'md:pl-16';

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useLanguage();
  const { isMobile, isOpen, toggleMenu, closeMenu } = useResponsiveMenu();
  const { mode, toggleTheme } = useThemeModeContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen min-w-0 bg-gradient-to-br from-background via-surface to-background">
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

      {/* Desktop: fixed sidebar; hidden on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface transition-[width] duration-200 md:block',
          sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED
        )}
        aria-label="Sidebar"
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
          onLogoClick={() => setSidebarCollapsed((p) => !p)}
        />
      </aside>

      {/* Mobile: header with hamburger to open sidebar sheet */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 min-w-0 items-center gap-1 border-b border-border bg-surface px-2 md:hidden min-[400px]:px-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={t('nav.openMenu')}
            aria-expanded={isOpen}
            className="h-9 w-9 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="min-w-0 flex-1 truncate pl-0.5 text-base font-semibold text-foreground sm:text-lg">
            {t('nav.appTitle')}
          </h1>
          <div className="flex shrink-0 items-center gap-0.5">
            <LanguageSelector />
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
          </div>
        </header>
      )}

      {/* Mobile: full sidebar as sheet overlay when hamburger is clicked */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeMenu()}>
        <SheetContent
          side="left"
          hideCloseButton
          className={cn(
            'border-border bg-surface p-0 transition-[width] duration-200',
            sidebarCollapsed ? 'w-20' : 'w-72'
          )}
        >
          <AppSidebar
            onClose={closeMenu}
            compact
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
            onLogoClick={closeMenu}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'flex-1 min-w-0 py-6 transition-[padding] duration-200',
          isMobile ? 'pt-20 pl-0' : sidebarCollapsed ? MAIN_PL_COLLAPSED : MAIN_PL_EXPANDED
        )}
      >
        <div className="container mx-auto min-w-0 max-w-full overflow-x-hidden px-3 min-[400px]:px-4 sm:max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
