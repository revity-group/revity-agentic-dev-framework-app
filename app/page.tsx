'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import ReviewForm from '@/components/ReviewForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMovies } from '@/hooks/useMovies'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Home() {
  const [category, setCategory] = useState('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set())

  const { movies, loading, loadingMore, error, hasMore, loadMore } =
    useMovies(category)

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loadingMore,
  })

  // Fetch watchlist on mount to restore persisted state
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist')
        if (response.ok) {
          const watchlist = await response.json()
          const ids = new Set<number>(
            watchlist.map((item: { movieId: number }) => item.movieId)
          )
          setWatchlistIds(ids)
        }
      } catch (error) {
        console.error('Failed to fetch watchlist:', error)
      }
    }
    fetchWatchlist()
  }, [])

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

        {error && (
          <div className="rounded-lg bg-red-100 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
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

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {loadingMore && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                You&apos;ve reached the end of the list
              </p>
            )}
          </>
        )}

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
