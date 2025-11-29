import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMovies } from './useMovies'
import { Movie } from '@/types/movie'

// Mock fetch globally
global.fetch = vi.fn()

describe('useMovies', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      overview: 'Test overview 1',
      poster_path: '/test1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      popularity: 50.5,
    },
    {
      id: 2,
      title: 'Test Movie 2',
      overview: 'Test overview 2',
      poster_path: '/test2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2024-02-01',
      vote_average: 7.5,
      vote_count: 80,
      popularity: 45.5,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch movies successfully on initial load', async () => {
    // Arrange
    const mockResponse = {
      results: mockMovies,
      total_pages: 5,
      page: 1,
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    // Assert
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual(mockMovies)
    expect(result.current.hasMore).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error gracefully', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch movies'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    })

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.movies).toEqual([])
  })

  it('should load more movies when loadMore is called', async () => {
    // Arrange
    const page1Response = {
      results: mockMovies,
      total_pages: 2,
      page: 1,
    }

    const page2Movies: Movie[] = [
      {
        id: 3,
        title: 'Test Movie 3',
        overview: 'Test overview 3',
        poster_path: '/test3.jpg',
        backdrop_path: '/backdrop3.jpg',
        release_date: '2024-03-01',
        vote_average: 9.0,
        vote_count: 120,
        popularity: 60.5,
      },
    ]

    const page2Response = {
      results: page2Movies,
      total_pages: 2,
      page: 2,
    }

    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page1Response,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page2Response,
      })

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toHaveLength(2)

    result.current.loadMore()

    // Assert
    await waitFor(() => {
      expect(result.current.loadingMore).toBe(false)
    })

    expect(result.current.movies).toHaveLength(3)
    expect(result.current.movies).toEqual([...mockMovies, ...page2Movies])
    expect(result.current.hasMore).toBe(false)
  })

  it('should not load more when hasMore is false', async () => {
    // Arrange
    const mockResponse = {
      results: mockMovies,
      total_pages: 1,
      page: 1,
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const fetchCallCount = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls.length

    result.current.loadMore()

    // Assert
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      fetchCallCount
    )
    expect(result.current.hasMore).toBe(false)
  })

  it('should reset and fetch movies when category changes', async () => {
    // Arrange
    const popularResponse = {
      results: mockMovies,
      total_pages: 5,
      page: 1,
    }

    const topRatedMovies: Movie[] = [
      {
        id: 10,
        title: 'Top Rated Movie',
        overview: 'Top rated overview',
        poster_path: '/toprated.jpg',
        backdrop_path: '/backdrop_toprated.jpg',
        release_date: '2024-04-01',
        vote_average: 9.5,
        vote_count: 200,
        popularity: 70.5,
      },
    ]

    const topRatedResponse = {
      results: topRatedMovies,
      total_pages: 3,
      page: 1,
    }

    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => popularResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => topRatedResponse,
      })

    // Act
    const { result, rerender } = renderHook(
      ({ category }) => useMovies(category),
      {
        initialProps: { category: 'popular' },
      }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual(mockMovies)

    rerender({ category: 'top_rated' })

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual(topRatedMovies)
  })

  it('should handle network errors correctly', async () => {
    // Arrange
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error')
    )

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.movies).toEqual([])
  })

  it('should return correct hasMore value based on pagination', async () => {
    // Arrange - Test when on last page
    const lastPageResponse = {
      results: mockMovies,
      total_pages: 1,
      page: 1,
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => lastPageResponse,
    })

    // Act
    const { result } = renderHook(() => useMovies('popular'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert - hasMore should be false when on last page
    expect(result.current.hasMore).toBe(false)
    expect(result.current.movies).toHaveLength(2)
  })
})
