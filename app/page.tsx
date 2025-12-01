'use client'

import { useState } from 'react'
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
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Error loading movies</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
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
                  onReview={() => setSelectedMovie(movie)}
                />
              ))}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* No more movies message */}
            {!hasMore && movies.length > 0 && (
              <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                <p className="text-sm">
                  You've reached the end of the list. No more movies to load.
                </p>
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-10" />
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
