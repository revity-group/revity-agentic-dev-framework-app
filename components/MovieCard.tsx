'use client'

import { Movie } from '@/types/movie'
import { useState } from 'react'

interface MovieCardProps {
  movie: Movie
  onReview: () => void
}

export default function MovieCard({ movie, onReview }: MovieCardProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [loading, setLoading] = useState(false)

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg'

  const addToWatchlist = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          posterPath: movie.poster_path,
        }),
      })

      if (response.ok) {
        setIsInWatchlist(true)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add to watchlist')
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      alert('Failed to add to watchlist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/500x750?text=No+Image'
          }}
        />
        <div className="absolute right-2 top-2 rounded bg-black bg-opacity-70 px-2 py-1 text-sm font-semibold text-white">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
          {movie.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : 'TBA'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={addToWatchlist}
            disabled={loading || isInWatchlist}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-colors ${
              isInWatchlist
                ? 'cursor-default bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
            }`}
          >
            {isInWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
          </button>
          <button
            onClick={onReview}
            className="flex-1 rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  )
}
