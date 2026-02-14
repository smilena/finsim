/**
 * Hook to detect if viewport is mobile size
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if viewport matches mobile breakpoint (< 768px)
 * @returns boolean indicating if viewport is mobile size
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if we're in mobile viewport
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
