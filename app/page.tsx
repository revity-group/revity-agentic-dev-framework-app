'use client'

import { useState } from 'react'
import { Movie } from '@/types/movie'
import { useMovies } from '@/hooks/useMovies'
import MovieCard from '@/components/MovieCard'
import ReviewForm from '@/components/ReviewForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

function MovieSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export default function Home() {
  const [category, setCategory] = useState<MovieCategory>('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const { movies, loading, loadingMore, error, hasMore, loadMoreRef, retry } =
    useMovies(category)

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

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieSkeleton key={i} />
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

            {error && (
              <div className="mt-8 text-center">
                <p className="mb-4 text-red-500">{error}</p>
                <Button onClick={retry} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {loadingMore && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MovieSkeleton key={i} />
                ))}
              </div>
            )}

            {!loadingMore && !error && !hasMore && movies.length > 0 && (
              <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
                You&apos;ve reached the end of the list
              </p>
            )}

            {!loadingMore && !error && hasMore && (
              <div ref={loadMoreRef} className="mt-8 h-10" />
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
