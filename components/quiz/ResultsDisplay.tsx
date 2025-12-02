'use client'

/**
 * ResultsDisplay Component
 *
 * Displays quiz results with movie recommendations
 * Shows match explanations and criteria tags for each movie
 */

import { MovieRecommendation } from '@/types/quiz'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, Clock } from 'lucide-react'
import { TMDB_IMAGE_BASE_URL } from '@/lib/quiz/constants'
import Image from 'next/image'

interface ResultsDisplayProps {
  recommendations: MovieRecommendation[]
  totalMatches: number
  onRetake: () => void
  onExit: () => void
}

export function ResultsDisplay({
  recommendations,
  totalMatches,
  onRetake,
  onExit,
}: ResultsDisplayProps) {
  // Handle no results case
  if (recommendations.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            No matches found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No movies match all your preferences. Try adjusting your choices.
          </p>
        </div>
        <Button onClick={onRetake} size="lg">
          Retake Quiz
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Your Perfect Movies
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Found {totalMatches} {totalMatches === 1 ? 'movie' : 'movies'}{' '}
          matching your preferences
          {totalMatches > recommendations.length &&
            ` (showing top ${recommendations.length})`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onRetake} variant="outline">
          Retake Quiz
        </Button>
        <Button onClick={onExit}>Back to Home</Button>
      </div>

      {/* Movie Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((movie) => (
          <Card key={movie.id} className="overflow-hidden">
            {/* Movie Poster */}
            {movie.posterPath ? (
              <div className="relative h-[300px] w-full">
                <Image
                  src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No poster available
                </p>
              </div>
            )}

            <CardHeader>
              <CardTitle className="line-clamp-2">{movie.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {movie.matchExplanation}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Movie Details */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
              </div>

              {/* Match Criteria Tags */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Matches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.matchCriteria.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                  {movie.matchCriteria.moods.map((mood) => (
                    <Badge key={mood} variant="secondary">
                      {mood}
                    </Badge>
                  ))}
                  <Badge variant="secondary">{movie.matchCriteria.era}</Badge>
                  <Badge variant="secondary">
                    {movie.matchCriteria.runtime}
                  </Badge>
                  <Badge variant="secondary">
                    {movie.matchCriteria.rating}
                  </Badge>
                </div>
              </div>

              {/* Overview */}
              <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {movie.overview}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={onRetake} variant="outline">
          Retake Quiz
        </Button>
        <Button onClick={onExit}>Back to Home</Button>
      </div>
    </div>
  )
}
