/**
 * Unit tests for useMovies hook
 * Following conventions from .claude/conventions/unit-test-rules.md
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { useMovies } from './useMovies'
import { Movie } from '@/types/movie'

// Mock fetch globally
const mockFetch = vi.fn() as Mock

// Mock data
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Test Movie 1',
    overview: 'A test movie overview',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 100,
    genre_ids: [28, 12],
  },
  {
    id: 2,
    title: 'Test Movie 2',
    overview: 'Another test movie overview',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2024-02-01',
    vote_average: 7.5,
    vote_count: 500,
    popularity: 80,
    genre_ids: [35, 18],
  },
]

const mockMoviesPage2: Movie[] = [
  {
    id: 3,
    title: 'Test Movie 3',
    overview: 'Third test movie overview',
    poster_path: '/poster3.jpg',
    backdrop_path: '/backdrop3.jpg',
    release_date: '2024-03-01',
    vote_average: 9.0,
    vote_count: 2000,
    popularity: 150,
    genre_ids: [16, 10751],
  },
]

const mockResponse = {
  results: mockMovies,
  page: 1,
  total_pages: 3,
  total_results: 60,
}

const mockResponsePage2 = {
  results: mockMoviesPage2,
  page: 2,
  total_pages: 3,
  total_results: 60,
}

const mockResponseLastPage = {
  results: mockMoviesPage2,
  page: 3,
  total_pages: 3,
  total_results: 60,
}

describe('useMovies', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockFetch.mockReset()
    global.fetch = mockFetch
  })

  describe('initial fetch', () => {
    it('should start with loading true when hook is initialized', () => {
      mockFetch.mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading state
      )

      const { result } = renderHook(() => useMovies('popular'))

      expect(result.current.loading).toBe(true)
      expect(result.current.movies).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should fetch movies successfully when API returns valid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.movies).toEqual(mockMovies)
      expect(result.current.error).toBeNull()
      expect(result.current.hasMore).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/movies?category=popular&page=1',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })

    it('should handle error when API request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch movies')
      expect(result.current.movies).toEqual([])
    })

    it('should handle network error when fetch throws', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.movies).toEqual([])
    })
  })

  describe('category changes', () => {
    it('should refetch movies when category changes', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockResponse,
            results: [mockMovies[0]],
          }),
        } as Response)

      const { result, rerender } = renderHook(
        ({ category }) => useMovies(category),
        { initialProps: { category: 'popular' } }
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.movies).toHaveLength(2)

      rerender({ category: 'top_rated' })

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(1)
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(mockFetch).toHaveBeenLastCalledWith(
        '/api/movies?category=top_rated&page=1',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })

    it('should reset movies to empty array when category changes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result, rerender } = renderHook(
        ({ category }) => useMovies(category),
        { initialProps: { category: 'popular' } }
      )

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(2)
      })

      rerender({ category: 'upcoming' })

      // Movies should be cleared when category changes
      expect(result.current.loading).toBe(true)
    })
  })

  describe('loadMore', () => {
    it('should append movies when loadMore is called', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponsePage2,
        } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.movies).toHaveLength(2)

      act(() => {
        result.current.loadMore()
      })

      await waitFor(() => {
        expect(result.current.loadingMore).toBe(false)
      })

      expect(result.current.movies).toHaveLength(3)
      expect(result.current.movies[2]).toEqual(mockMoviesPage2[0])
    })

    it('should set loadingMore to true when loading more movies', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockImplementationOnce(
          () => new Promise(() => {}) // Never resolves
        )

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      act(() => {
        result.current.loadMore()
      })

      expect(result.current.loadingMore).toBe(true)
      expect(result.current.loading).toBe(false)
    })

    it('should not load more when already loading more', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockImplementationOnce(
          () => new Promise(() => {}) // Never resolves
        )

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      act(() => {
        result.current.loadMore()
      })

      act(() => {
        result.current.loadMore()
      })

      // Should only call fetch twice (initial + one loadMore)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should not load more when on last page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseLastPage,
      } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.hasMore).toBe(false)

      act(() => {
        result.current.loadMore()
      })

      // Should only have initial fetch
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('hasMore', () => {
    it('should return true when there are more pages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.hasMore).toBe(true)
    })

    it('should return false when on last page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseLastPage,
      } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.hasMore).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset to first page when reset is called', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponsePage2,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      act(() => {
        result.current.loadMore()
      })

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(3)
      })

      act(() => {
        result.current.reset()
      })

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(2)
      })

      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(mockFetch).toHaveBeenLastCalledWith(
        '/api/movies?category=popular&page=1',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })

    it('should clear movies when reset is called', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)
        .mockImplementationOnce(
          () => new Promise(() => {}) // Never resolves to check cleared state
        )

      const { result } = renderHook(() => useMovies('popular'))

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(2)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.movies).toEqual([])
      expect(result.current.loading).toBe(true)
    })
  })
})
