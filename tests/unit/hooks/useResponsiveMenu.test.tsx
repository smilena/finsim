/**
 * Unit tests for useResponsiveMenu hook
 */

import { renderHook, act } from '@testing-library/react';
import { useResponsiveMenu } from '@/hooks/useResponsiveMenu';
// useResponsiveMenu uses useIsMobile (window.innerWidth), not MUI useMediaQuery
const mockIsMobile = jest.fn();
jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => mockIsMobile(),
}));

describe('useResponsiveMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with menu closed', () => {
    mockIsMobile.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMenu());

    expect(result.current.isOpen).toBe(false);
  });

  it('detects mobile viewport', () => {
    mockIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu());

    expect(result.current.isMobile).toBe(true);
  });

  it('detects desktop viewport', () => {
    mockIsMobile.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMenu());

    expect(result.current.isMobile).toBe(false);
  });

  it('opens menu', () => {
    mockIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu());

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closes menu', () => {
    mockIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu());

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeMenu();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggles menu', () => {
    mockIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('auto-closes menu when switching from mobile to desktop', () => {
    mockIsMobile.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useResponsiveMenu());

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);

    mockIsMobile.mockReturnValue(false);
    rerender();

    expect(result.current.isOpen).toBe(false);
  });
});
