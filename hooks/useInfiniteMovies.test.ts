/**
 * Unit tests for useInfiniteMovies hook
 * Following conventions from .claude/conventions/unit-test-rules.md
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { useInfiniteMovies } from './useInfiniteMovies'

// Mock data
const mockMovies = [
  { id: 1, title: 'Movie 1', poster_path: '/poster1.jpg', overview: 'Overview 1' },
  { id: 2, title: 'Movie 2', poster_path: '/poster2.jpg', overview: 'Overview 2' },
]

const mockMoviesPage2 = [
  { id: 3, title: 'Movie 3', poster_path: '/poster3.jpg', overview: 'Overview 3' },
  { id: 4, title: 'Movie 4', poster_path: '/poster4.jpg', overview: 'Overview 4' },
]

const mockApiResponse = {
  results: mockMovies,
  page: 1,
  total_pages: 3,
  total_results: 60,
}

const mockApiResponsePage2 = {
  results: mockMoviesPage2,
  page: 2,
  total_pages: 3,
  total_results: 60,
}

const mockApiResponseLastPage = {
  results: mockMoviesPage2,
  page: 3,
  total_pages: 3,
  total_results: 60,
}

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const mockIntersectionObserver = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = vi.fn()

  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  }))
  global.IntersectionObserver = mockIntersectionObserver
})

describe('useInfiniteMovies', () => {
  describe('initial fetch', () => {
    it('should fetch movies successfully when API returns valid data', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.movies).toEqual(mockMovies)
      expect(result.current.hasMore).toBe(true)
      expect(result.current.error).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith('/api/movies?category=popular&page=1')
    })

    it('should set isLoading to true during initial fetch', async () => {
      // Arrange
      ;(global.fetch as Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => mockApiResponse,
                }),
              100
            )
          )
      )

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isLoadingMore).toBe(false)
    })

    it('should handle error when API request fails', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch movies')
      expect(result.current.movies).toEqual([])
    })

    it('should handle network error when fetch throws', async () => {
      // Arrange
      ;(global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'))

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.movies).toEqual([])
    })
  })

  describe('loadMore', () => {
    it('should load more movies when loadMore is called', async () => {
      // Arrange
      ;(global.fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponsePage2,
        })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.loadMore()
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false)
      })

      expect(result.current.movies).toEqual([...mockMovies, ...mockMoviesPage2])
      expect(global.fetch).toHaveBeenCalledWith('/api/movies?category=popular&page=2')
    })

    it('should set isLoadingMore to true when loading more', async () => {
      // Arrange
      ;(global.fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: true,
                    json: async () => mockApiResponsePage2,
                  }),
                100
              )
            )
        )

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.loadMore()
      })

      // Assert
      expect(result.current.isLoadingMore).toBe(true)
      expect(result.current.isLoading).toBe(false)
    })

    it('should not load more when hasMore is false', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponseLastPage,
      })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const fetchCallCount = (global.fetch as Mock).mock.calls.length

      act(() => {
        result.current.loadMore()
      })

      // Assert
      expect(result.current.hasMore).toBe(false)
      expect((global.fetch as Mock).mock.calls.length).toBe(fetchCallCount)
    })
  })

  describe('category change', () => {
    it('should reset and fetch new movies when category changes', async () => {
      // Arrange
      ;(global.fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockApiResponse,
            results: [{ id: 5, title: 'Top Rated Movie' }],
          }),
        })

      // Act
      const { result, rerender } = renderHook(
        ({ category }) => useInfiniteMovies(category),
        { initialProps: { category: 'popular' } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.movies).toEqual(mockMovies)

      rerender({ category: 'top_rated' })

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.movies).toEqual([{ id: 5, title: 'Top Rated Movie' }])
      expect(global.fetch).toHaveBeenLastCalledWith('/api/movies?category=top_rated&page=1')
    })
  })

  describe('sentinelRef', () => {
    it('should create IntersectionObserver when sentinel element is provided', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })

      const mockElement = document.createElement('div')

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.sentinelRef(mockElement)
      })

      // Assert
      expect(mockIntersectionObserver).toHaveBeenCalled()
      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should disconnect observer when sentinel element is removed', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })

      const mockElement = document.createElement('div')

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.sentinelRef(mockElement)
      })

      act(() => {
        result.current.sentinelRef(null)
      })

      // Assert
      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should trigger loadMore when intersection is observed', async () => {
      // Arrange
      let intersectionCallback: (entries: { isIntersecting: boolean }[]) => void

      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: vi.fn(),
        }
      })

      ;(global.fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponsePage2,
        })

      const mockElement = document.createElement('div')

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.sentinelRef(mockElement)
      })

      act(() => {
        intersectionCallback([{ isIntersecting: true }])
      })

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/movies?category=popular&page=2')
      })
    })
  })

  describe('cleanup', () => {
    it('should disconnect observer on unmount', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })

      const mockElement = document.createElement('div')

      // Act
      const { result, unmount } = renderHook(() => useInfiniteMovies('popular'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.sentinelRef(mockElement)
      })

      unmount()

      // Assert
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle empty results from API', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [],
          page: 1,
          total_pages: 1,
          total_results: 0,
        }),
      })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.movies).toEqual([])
      expect(result.current.hasMore).toBe(false)
    })

    it('should handle undefined results from API', async () => {
      // Arrange
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          page: 1,
          total_pages: 1,
          total_results: 0,
        }),
      })

      // Act
      const { result } = renderHook(() => useInfiniteMovies('popular'))

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.movies).toEqual([])
    })
  })
})
