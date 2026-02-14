/**
 * Unit tests for useThemeMode hook
 */

import { renderHook, act } from '@testing-library/react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { THEME_STORAGE_KEY } from '@/types/common.types';

describe('useThemeMode', () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: localStorageMock,
    });
  });

  it('initializes with light mode by default', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe('light');
  });

  it('reads saved theme from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    renderHook(() => useThemeMode());

    expect(localStorageMock.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('toggles from light to dark', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });

  it('toggles from dark to light', () => {
    const { result } = renderHook(() => useThemeMode());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.mode).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'light');
  });

  it('setTheme updates mode and persists to localStorage', () => {
    const { result } = renderHook(() => useThemeMode());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.mode).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'light');
  });
});
