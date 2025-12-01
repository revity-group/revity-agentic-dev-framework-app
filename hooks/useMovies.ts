import { useState, useEffect, useCallback, useRef } from 'react'
import { Movie } from '@/types/movie'

interface MoviesResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

interface UseMoviesReturn {
  movies: Movie[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

export function useMovies(category: string): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchMovies = useCallback(
    async (pageNum: number, append: boolean = false) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setError(null)
      }

      try {
        const response = await fetch(
          `/api/movies?category=${category}&page=${pageNum}`,
          { signal: abortControllerRef.current.signal }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data: MoviesResponse = await response.json()

        if (append) {
          setMovies((prev) => [...prev, ...data.results])
        } else {
          setMovies(data.results || [])
        }

        setTotalPages(data.total_pages)
        setPage(data.page)
        setError(null)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [category]
  )

  // Reset and fetch first page when category changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
    fetchMovies(1, false)

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [category, fetchMovies])

  const loadMore = useCallback(() => {
    if (!loadingMore && page < totalPages) {
      fetchMovies(page + 1, true)
    }
  }, [loadingMore, page, totalPages, fetchMovies])

  const reset = useCallback(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
    fetchMovies(1, false)
  }, [fetchMovies])

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    loadMore,
    reset,
  }
}
