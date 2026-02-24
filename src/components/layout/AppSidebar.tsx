/**
 * Sidebar navigation - nav items and footer with language flags + theme toggle
 */

'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useThemeModeContext } from '@/theme/ThemeModeContext';
import { ROUTES } from '@/types/common.types';
import type { MenuItem } from '@/types/common.types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, TrendingUp, CreditCard, LineChart, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { cn } from '@/lib/utils';

export interface AppSidebarProps {
  /**
   * Optional: close callback (e.g. for mobile sheet after navigation)
   */
  onClose?: () => void;

  /**
   * Whether to use compact styling (e.g. inside sheet)
   */
  compact?: boolean;

  /**
   * Whether sidebar is collapsed (icons only)
   */
  collapsed?: boolean;

  /**
   * Callback to toggle sidebar collapse (desktop) or open/close sheet (mobile)
   */
  onToggleCollapse?: () => void;

  /**
   * When provided, logo acts as toggle (calls this on click) instead of linking to home
   */
  onLogoClick?: () => void;
}

export function AppSidebar({
  onClose,
  compact = false,
  collapsed = false,
  onLogoClick,
}: AppSidebarProps) {
  const { t } = useLanguage();
  const { mode, toggleTheme } = useThemeModeContext();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { label: t('nav.home'), path: ROUTES.HOME, icon: <Home className="h-5 w-5 shrink-0" /> },
    { label: t('nav.investment'), path: ROUTES.INVESTMENT, icon: <TrendingUp className="h-5 w-5 shrink-0" /> },
    { label: t('nav.debt'), path: ROUTES.DEBT, icon: <CreditCard className="h-5 w-5 shrink-0" /> },
  ];

  return (
    <div
      className={cn(
        'flex h-full flex-col transition-[width] duration-200',
        compact ? 'w-full' : collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Header: logo + arrow toggle (when onLogoClick provided) */}
      <div
        className={cn(
          'flex min-w-0 items-center border-b border-border',
          collapsed ? 'justify-center gap-1 px-1.5 py-4' : 'justify-between gap-2 px-4 py-5',
          !collapsed && compact && 'px-3 pt-5'
        )}
      >
        {onLogoClick ? (
          <Button
            variant="ghost"
            className={cn(
              'h-auto p-0 text-primary font-semibold hover:bg-transparent',
              collapsed ? 'shrink-0 gap-0 min-w-0' : 'min-w-0 gap-2'
            )}
            aria-label={t('nav.appTitle')}
            onClick={onLogoClick}
          >
            <LineChart className={cn('shrink-0', collapsed ? 'h-6 w-6' : 'h-9 w-9')} />
            {!collapsed && (
              <>
                <Coins className="h-9 w-9 shrink-0" />
                <span className="truncate text-lg tracking-tight">{t('nav.brandName')}</span>
              </>
            )}
          </Button>
        ) : (
          <Link
            href={ROUTES.HOME}
            className={cn(
              'flex min-w-0 items-center text-primary font-semibold',
              collapsed ? 'shrink-0 gap-0' : 'gap-2'
            )}
            aria-label={t('nav.appTitle')}
            onClick={onClose}
          >
            <LineChart className={cn('shrink-0', collapsed ? 'h-6 w-6' : 'h-9 w-9')} />
            {!collapsed && (
              <>
                <Coins className="h-9 w-9 shrink-0" />
                <span className="truncate text-lg tracking-tight">{t('nav.brandName')}</span>
              </>
            )}
          </Link>
        )}
        {onLogoClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogoClick}
            className={cn('shrink-0', collapsed && 'h-6 w-6')}
            aria-label={collapsed && !compact ? t('nav.expandMenu') : t('nav.collapseMenu')}
          >
            {compact ? (
              <ChevronLeft className="h-5 w-5" />
            ) : collapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      {/* Nav links */}
      <nav aria-label="Main navigation" className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    collapsed && !compact && 'justify-center px-2',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground-secondary hover:bg-muted hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  title={collapsed && !compact ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: language flags + theme toggle */}
      <div
        className={cn(
          'border-t border-border px-2 py-4',
          collapsed && !compact && 'flex flex-col items-center gap-2'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2',
            collapsed && !compact && 'flex-col'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <LanguageSelector
            // Full-width only in the mobile sheet/sidebar (compact mode).
            // On desktop, keep it "fit" so it doesn't overflow next to ThemeToggle.
            fullWidth={compact && !collapsed}
            compact={collapsed && !compact}
          />
          {!compact && (
            <>
              <div
                className={cn(
                  'shrink-0 bg-border',
                  collapsed && !compact ? 'h-px w-6' : 'h-6 w-px'
                )}
                aria-hidden
              />
              <ThemeToggle mode={mode} onToggle={toggleTheme} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
