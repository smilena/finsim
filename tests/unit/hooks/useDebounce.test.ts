/**
 * Unit tests for useDebounce hook
 */

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 350));

    expect(result.current).toBe('initial');
  });

  it('returns debounced value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 350 } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 350 });

    // Before delay: still shows first value
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(result.current).toBe('second');
  });

  it('does not update during rapid changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 100, delay: 350 } }
    );

    expect(result.current).toBe(100);

    rerender({ value: 200, delay: 350 });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 300, delay: 350 });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 400, delay: 350 });
    act(() => jest.advanceTimersByTime(100));

    // Still 100 - no full delay has passed
    expect(result.current).toBe(100);

    act(() => jest.advanceTimersByTime(350));

    // Now shows last value (400)
    expect(result.current).toBe(400);
  });

  it('clears previous timer when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    rerender({ value: 'b', delay: 500 });
    act(() => jest.advanceTimersByTime(250));
    rerender({ value: 'c', delay: 500 });
    act(() => jest.advanceTimersByTime(500));

    expect(result.current).toBe('c');
  });
});
