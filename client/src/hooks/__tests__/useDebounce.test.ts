import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

// Mock timers
jest.useFakeTimers()

describe('useDebounce', () => {
    afterEach(() => {
        jest.clearAllTimers()
    })

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500))
        expect(result.current).toBe('initial')
    })

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 }
            }
        )

        expect(result.current).toBe('initial')

        // Change value
        rerender({ value: 'updated', delay: 500 })
        expect(result.current).toBe('initial') // Should still be initial

        // Fast forward time by 250ms (less than delay)
        act(() => {
            jest.advanceTimersByTime(250)
        })
        expect(result.current).toBe('initial') // Should still be initial

        // Fast forward time by another 250ms (total 500ms)
        act(() => {
            jest.advanceTimersByTime(250)
        })
        expect(result.current).toBe('updated') // Should now be updated
    })

    it('should reset timer on rapid value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 }
            }
        )

        // Change value multiple times rapidly
        rerender({ value: 'change1', delay: 500 })
        act(() => {
            jest.advanceTimersByTime(250)
        })

        rerender({ value: 'change2', delay: 500 })
        act(() => {
            jest.advanceTimersByTime(250)
        })

        rerender({ value: 'final', delay: 500 })
        
        // Should still be initial after 500ms total
        expect(result.current).toBe('initial')

        // After another 500ms, should be the final value
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('final')
    })

    it('should handle different delay values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 1000 }
            }
        )

        rerender({ value: 'updated', delay: 1000 })
        
        // Should not update after 500ms
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('initial')

        // Should update after 1000ms
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('updated')
    })
})
