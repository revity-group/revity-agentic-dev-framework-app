import { useState, useEffect, useCallback, useRef } from 'react'
import { Movie } from '@/types/movie'

interface MovieApiResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

interface UseInfiniteMoviesReturn {
  movies: Movie[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  sentinelRef: (node: HTMLElement | null) => void
}

export function useInfiniteMovies(category: string): UseInfiniteMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const isLoadingRef = useRef(false)

  const hasMore = page < totalPages

  const fetchMovies = useCallback(
    async (pageNum: number, isInitial: boolean) => {
      if (isLoadingRef.current) return

      isLoadingRef.current = true
      if (isInitial) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      setError(null)

      try {
        const response = await fetch(
          `/api/movies?category=${category}&page=${pageNum}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data: MovieApiResponse = await response.json()

        if (isInitial) {
          setMovies(data.results || [])
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])])
        }

        setTotalPages(data.total_pages || 1)
        setPage(pageNum)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies')
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [category]
  )

  // Reset and fetch when category changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
    fetchMovies(1, true)
  }, [category, fetchMovies])

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingRef.current) {
      fetchMovies(page + 1, false)
    }
  }, [hasMore, page, fetchMovies])

  // Intersection Observer callback for sentinel element
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
            loadMore()
          }
        },
        { rootMargin: '100px' }
      )

      observerRef.current.observe(node)
    },
    [hasMore, loadMore]
  )

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
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    sentinelRef,
  }
}
