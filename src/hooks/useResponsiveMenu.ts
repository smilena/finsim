/**
 * Hook to manage responsive menu state
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from './useIsMobile';

/**
 * Hook return type for responsive menu
 */
export interface UseResponsiveMenuReturn {
  /**
   * Whether device is mobile (< md breakpoint)
   */
  isMobile: boolean;

  /**
   * Whether mobile menu is open
   */
  isOpen: boolean;

  /**
   * Open mobile menu
   */
  openMenu: () => void;

  /**
   * Close mobile menu
   */
  closeMenu: () => void;

  /**
   * Toggle mobile menu
   */
  toggleMenu: () => void;
}

/**
 * Hook to manage responsive menu state
 * - Detects mobile viewport using custom hook
 * - Manages menu open/closed state
 * - Auto-closes menu when switching to desktop
 */
export function useResponsiveMenu(): UseResponsiveMenuReturn {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return {
    isMobile,
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
