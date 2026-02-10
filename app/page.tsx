'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Movie, WatchlistItem } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import ReviewForm from '@/components/ReviewForm'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)
  const isFetchingRef = useRef(false)
  const requestedPageRef = useRef(1)

  const fetchMovies = useCallback(
    async (nextPage: number, options?: { replace?: boolean }) => {
      if (isFetchingRef.current && !options?.replace) {
        return
      }

      const requestId = ++requestIdRef.current
      requestedPageRef.current = nextPage
      isFetchingRef.current = true
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/movies?category=${category}&page=${nextPage}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()

        if (requestId !== requestIdRef.current) {
          return
        }

        const results: Movie[] = Array.isArray(data.results)
          ? data.results
          : []
        const totalPages =
          typeof data.total_pages === 'number' ? data.total_pages : nextPage

        setMovies((prev) =>
          options?.replace ? results : [...prev, ...results]
        )
        setPage(nextPage)
        setHasMore(nextPage < totalPages && results.length > 0)
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return
        }

        console.error('Error fetching movies:', error)
        setError('Unable to load movies right now. Please try again.')
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
          isFetchingRef.current = false
        }
      }
    },
    [category]
  )

  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
    setError(null)
    fetchMovies(1, { replace: true })
  }, [category, fetchMovies])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasMore || loading || error) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMovies(page + 1)
        }
      },
      { rootMargin: '400px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [error, fetchMovies, hasMore, loading, page])

  const handleWatchlistChange = (movieId: number, inWatchlist: boolean) => {
    setWatchlistIds((prev) => {
      const updated = new Set(prev)
      if (inWatchlist) {
        updated.add(movieId)
      } else {
        updated.delete(movieId)
      }
      return updated
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
            Movie Watchlist
          </h1>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Discover, review, and track your favorite movies
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setCategory('popular')}
              variant={category === 'popular' ? 'default' : 'outline'}
            >
              Popular
            </Button>
            <Button
              onClick={() => setCategory('top_rated')}
              variant={category === 'top_rated' ? 'default' : 'outline'}
            >
              Top Rated
            </Button>
            <Button
              onClick={() => setCategory('now_playing')}
              variant={category === 'now_playing' ? 'default' : 'outline'}
            >
              Now Playing
            </Button>
            <Button
              onClick={() => setCategory('upcoming')}
              variant={category === 'upcoming' ? 'default' : 'outline'}
            >
              Upcoming
            </Button>
          </div>
        </header>

        {movies.length === 0 && loading ? (
          <div className="flex justify-center py-16 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
              <span>Loading movies...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={watchlistIds.has(movie.id)}
                onWatchlistChange={handleWatchlistChange}
                onReview={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          {error && (
            <div className="flex flex-col items-center gap-3 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchMovies(requestedPageRef.current)}
                disabled={loading}
              >
                Try again
              </Button>
            </div>
          )}

          {loading && movies.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
              <span>Loading more movies...</span>
            </div>
          )}

          {!hasMore && !loading && !error && movies.length > 0 && (
            <p>No more movies to load.</p>
          )}
        </div>

        <div ref={loadMoreRef} className="h-1" />

        {selectedMovie && (
          <ReviewForm
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>

      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </main>
  )
}
