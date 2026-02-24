/**
 * Application header with navigation
 */

'use client';

import { Button } from '@/components/ui/button';
import { Menu, Home, TrendingUp, CreditCard } from 'lucide-react';
import { AppMenu } from './AppMenu';
import { LanguageSelector } from './LanguageSelector';
import { useResponsiveMenu } from '@/hooks/useResponsiveMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useThemeModeContext } from '@/theme/ThemeModeContext';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '@/types/common.types';
import type { MenuItem } from '@/types/common.types';
import { usePathname } from 'next/navigation';

/**
 * Application header
 * - Desktop: horizontal navigation bar
 * - Mobile: hamburger menu button
 * - Language selector
 */
export function AppHeader() {
  const { t } = useLanguage();
  const { mode, toggleTheme } = useThemeModeContext();
  const { isMobile, isOpen, toggleMenu, closeMenu } = useResponsiveMenu();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { label: t('nav.home'), path: ROUTES.HOME, icon: <Home className="h-4 w-4" /> },
    { label: t('nav.investment'), path: ROUTES.INVESTMENT, icon: <TrendingUp className="h-4 w-4" /> },
    { label: t('nav.debt'), path: ROUTES.DEBT, icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-surface shadow-sm">
        <div className="flex h-16 items-center px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={t('nav.openMenu')}
              aria-expanded={isOpen}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <h1 className="flex-1 min-w-0 text-xl font-semibold text-foreground truncate">
            {t('nav.appTitle')}
          </h1>

          {!isMobile && (
            <div className="flex items-center gap-2">
              <AppMenu items={menuItems} currentPath={pathname} isOpen={false} onClose={() => {}} isMobile={false} />
              <LanguageSelector />
              <ThemeToggle mode={mode} onToggle={toggleTheme} />
            </div>
          )}
          {isMobile && <ThemeToggle mode={mode} onToggle={toggleTheme} />}
        </div>
      </header>

      {isMobile && (
        <AppMenu items={menuItems} currentPath={pathname} isOpen={isOpen} onClose={closeMenu} isMobile={true} />
      )}
    </>
  );
}
