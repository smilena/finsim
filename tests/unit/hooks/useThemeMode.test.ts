/**
 * Unit tests for useThemeMode hook (theme state in memory, no persistence)
 */

import { renderHook, act } from '@testing-library/react';
import { useThemeMode } from '@/hooks/useThemeMode';

describe('useThemeMode', () => {
  it('initializes with light mode by default', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('light');
  });

  it('toggles from light to dark', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe('dark');
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
  });

  it('setTheme updates mode', () => {
    const { result } = renderHook(() => useThemeMode());

    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.mode).toBe('dark');

    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.mode).toBe('light');
  });
});
