/**
 * Unit tests for useResponsiveMenu hook
 */

import { renderHook, act } from '@testing-library/react';
import { useResponsiveMenu } from '@/hooks/useResponsiveMenu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

// Mock useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

import { useMediaQuery } from '@mui/material';

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('useResponsiveMenu', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with menu closed', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

    expect(result.current.isOpen).toBe(false);
  });

  it('detects mobile viewport', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

    expect(result.current.isMobile).toBe(true);
  });

  it('detects desktop viewport', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

    expect(result.current.isMobile).toBe(false);
  });

  it('opens menu', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closes menu', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

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
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useResponsiveMenu(), { wrapper });

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
    // Start as mobile with menu open
    mockUseMediaQuery.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useResponsiveMenu(), { wrapper });

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.isOpen).toBe(true);

    // Switch to desktop
    mockUseMediaQuery.mockReturnValue(false);
    rerender();

    expect(result.current.isOpen).toBe(false);
  });
});
