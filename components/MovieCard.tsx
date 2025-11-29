'use client'

import { Movie } from '@/types/movie'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MovieCardProps {
  movie: Movie
  isInWatchlist: boolean
  onWatchlistChange: (movieId: number, inWatchlist: boolean) => void
  onReview: () => void
}

export default function MovieCard({
  movie,
  isInWatchlist,
  onWatchlistChange,
  onReview,
}: MovieCardProps) {
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
        onWatchlistChange(movie.id, true)
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
    <Card className="overflow-hidden transition-shadow hover:shadow-xl">
      <div className="relative aspect-[2/3] bg-muted">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/500x750?text=No+Image'
          }}
        />
        <Badge className="absolute right-2 top-2" variant="secondary">
          ⭐ {movie.vote_average.toFixed(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold">{movie.title}</h3>
        <p className="text-sm text-muted-foreground">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : 'TBA'}
        </p>
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Button
          onClick={addToWatchlist}
          disabled={loading || isInWatchlist}
          variant={isInWatchlist ? 'secondary' : 'default'}
          className="flex-1"
        >
          {isInWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
        </Button>
        <Button onClick={onReview} variant="outline" className="flex-1">
          Review
        </Button>
      </CardFooter>
    </Card>
  )
}
