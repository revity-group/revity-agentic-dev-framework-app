'use client'

import { useEffect, useState } from 'react'
import { Movie } from '@/types/movie'
import MovieCard from '@/components/MovieCard'
import ReviewForm from '@/components/ReviewForm'
import { QuizContainer } from '@/components/quiz/QuizContainer'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [category, setCategory] = useState('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    fetchMovies()
  }, [category])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`/api/movies?category=${category}`)
      const data = await response.json()
      setMovies(data.results || [])
    } catch (error) {
      console.error('Error fetching movies:', error)
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

  // Handle quiz exit
  const handleExitQuiz = () => {
    setShowQuiz(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {showQuiz ? (
          // Quiz view (replaces main page content)
          <div className="mx-auto max-w-4xl">
            <QuizContainer onExit={handleExitQuiz} />
          </div>
        ) : (
          // Main page view
          <>
            <header className="mb-8">
              <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
                Movie Watchlist
              </h1>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                Discover, review, and track your favorite movies
              </p>

              {/* Find My Movie button */}
              <div className="mb-6 flex justify-center">
                <Button
                  onClick={() => setShowQuiz(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Find My Movie
                </Button>
              </div>

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

            {selectedMovie && (
              <ReviewForm
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
              />
            )}
          </>
        )}
      </div>

      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </main>
  )
}
