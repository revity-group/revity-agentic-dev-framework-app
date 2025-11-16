'use client'

import { useEffect, useState } from 'react'
import { Movie } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import ReviewForm from '@/components/ReviewForm'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [category])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/movies?category=${category}`)
      const data = await response.json()
      setMovies(data.results || [])
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
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
            <button
              onClick={() => setCategory('popular')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                category === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setCategory('top_rated')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                category === 'top_rated'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setCategory('now_playing')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                category === 'now_playing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Now Playing
            </button>
            <button
              onClick={() => setCategory('upcoming')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                category === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Upcoming
            </button>
          </div>
        </header>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading movies...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onReview={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
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
