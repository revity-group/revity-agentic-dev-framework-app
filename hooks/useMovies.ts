import { useState, useCallback, useEffect } from 'react'
import { Movie } from '@/types/movie'

interface UseMoviesResult {
  movies: Movie[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

export function useMovies(category: string): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const hasMore = page < totalPages

  const fetchMovies = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const response = await fetch(
          `/api/movies?category=${category}&page=${pageNum}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()

        if (append) {
          setMovies((prev) => [...prev, ...(data.results || [])])
        } else {
          setMovies(data.results || [])
        }

        setTotalPages(data.total_pages || 1)
        setPage(pageNum)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch movies'
        setError(errorMessage)
        console.error('Error fetching movies:', err)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [category]
  )

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchMovies(page + 1, true)
    }
  }, [fetchMovies, loadingMore, hasMore, page])

  const reset = useCallback(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
    setError(null)
  }, [])

  useEffect(() => {
    reset()
    fetchMovies(1, false)
  }, [category, fetchMovies, reset])

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reset,
  }
}
