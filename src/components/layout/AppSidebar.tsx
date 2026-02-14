/**
 * Sidebar navigation - nav items including Ajustes (settings page)
 */

'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { ROUTES } from '@/types/common.types';
import type { MenuItem } from '@/types/common.types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, TrendingUp, CreditCard, Settings, LineChart, Coins } from 'lucide-react';
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
}

export function AppSidebar({ onClose, compact = false }: AppSidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { label: t('nav.home'), path: ROUTES.HOME, icon: <Home className="h-5 w-5" /> },
    { label: t('nav.investment'), path: ROUTES.INVESTMENT, icon: <TrendingUp className="h-5 w-5" /> },
    { label: t('nav.debt'), path: ROUTES.DEBT, icon: <CreditCard className="h-5 w-5" /> },
  ];

  const isSettingsActive = pathname === ROUTES.SETTINGS;

  return (
    <div className={cn('flex h-full flex-col', compact ? 'w-full' : 'w-56')}>
      {/* Header: icon */}
      <div className={cn(
        'flex items-center justify-center border-b border-border',
        compact ? 'px-4 py-4 pr-12 pt-14' : 'px-4 py-5'
      )}>
        <Link href={ROUTES.HOME} className="flex items-center gap-2 text-primary font-semibold" aria-label={t('nav.appTitle')}>
          <LineChart className="h-9 w-9 shrink-0" />
          <Coins className="h-9 w-9 shrink-0" />
          <span className="text-lg tracking-tight">{t('nav.brandName')}</span>
        </Link>
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
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground-secondary hover:bg-muted hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Ajustes al final del sidebar */}
      <div className="border-t border-border px-2 py-4">
        <Link
          href={ROUTES.SETTINGS}
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isSettingsActive
              ? 'bg-primary/15 text-primary'
              : 'text-foreground-secondary hover:bg-muted hover:text-foreground'
          )}
          aria-current={isSettingsActive ? 'page' : undefined}
        >
          <Settings className="h-5 w-5" />
          {t('nav.settings')}
        </Link>
      </div>
    </div>
  );
}
