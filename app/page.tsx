'use client'

import { useEffect, useState } from 'react'
import { Movie, WatchlistItem } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import MovieCardSkeleton from '@/components/MovieCardSkeleton'
import ReviewForm from '@/components/ReviewForm'
import { Button } from '@/components/ui/button'
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
    loading: loading || loadingMore,
  })

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist')
      const data: WatchlistItem[] = await response.json()
      const ids = new Set(data.map((item) => Number(item.movieId)))
      setWatchlistIds(ids)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    }
  }

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

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <MovieCardSkeleton key={`skeleton-${index}`} />
    ))
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
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? renderSkeletons(10)
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={watchlistIds.has(movie.id)}
                  onWatchlistChange={handleWatchlistChange}
                  onReview={() => setSelectedMovie(movie)}
                />
              ))}
          {loadingMore && renderSkeletons(5)}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {!loading && !hasMore && movies.length > 0 && (
          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
            You&apos;ve reached the end of the list
          </p>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
            No movies found
          </p>
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
