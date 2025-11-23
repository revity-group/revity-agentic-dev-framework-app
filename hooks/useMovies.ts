import { useState, useEffect, useRef, useCallback } from 'react'
import { Movie } from '@/types/movie'

type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

interface UseMoviesResult {
  movies: Movie[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMoreRef: (node: HTMLDivElement | null) => void
  retry: () => void
}

export function useMovies(category: MovieCategory): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const observerRef = useRef<IntersectionObserver | null>(null)

  const fetchMovies = useCallback(
    async (pageNum: number, isInitial: boolean) => {
      if (isInitial) {
        setLoading(true)
      } else {
        setLoadingMore(true)
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

        if (isInitial) {
          setMovies(data.results || [])
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])])
        }

        setTotalPages(data.total_pages || 1)
        setPage(pageNum)
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError('Failed to load movies. Please try again.')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [category]
  )

  const loadMoreMovies = useCallback(() => {
    if (!loadingMore && page < totalPages) {
      fetchMovies(page + 1, false)
    }
  }, [loadingMore, page, totalPages, fetchMovies])

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          loadMoreMovies()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, loadingMore, page, totalPages, loadMoreMovies]
  )

  const retry = useCallback(() => {
    fetchMovies(page, page === 1)
  }, [fetchMovies, page])

  // Reset and fetch when category changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
    setError(null)
    fetchMovies(1, true)
  }, [category, fetchMovies])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    loadMoreRef,
    retry,
  }
}
