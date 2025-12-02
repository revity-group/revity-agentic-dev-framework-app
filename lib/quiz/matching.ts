/**
 * Matching algorithm for movie recommendations
 *
 * Implements strict AND logic - movies must match ALL selected criteria
 */

import {
  QuizSelections,
  MatchCriteria,
  MovieRecommendation,
} from '@/types/quiz'
import { GENRE_MAP, GENRE_TO_MOOD } from './constants'

/**
 * TMDB Movie response structure
 */
interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  runtime?: number
  overview: string
  genre_ids: number[]
}

/**
 * Generate match criteria labels for a movie
 *
 * @param movie - TMDB movie data
 * @param selections - User's quiz selections
 * @returns MatchCriteria with human-readable labels
 */
export function generateMatchCriteria(
  movie: TMDBMovie,
  selections: QuizSelections
): MatchCriteria {
  // Map genre IDs to names
  const matchedGenres = selections.genres
    .filter((genreId) => movie.genre_ids.includes(genreId))
    .map((genreId) => GENRE_MAP[genreId] || `Unknown (${genreId})`)

  // Map mood selections to labels
  const moodLabels: string[] = []
  selections.moods.forEach((moodGenreId) => {
    if (movie.genre_ids.includes(moodGenreId)) {
      const moods = GENRE_TO_MOOD[moodGenreId] || []
      moods.forEach((mood) => {
        const label = mood
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('-')
        if (!moodLabels.includes(label)) {
          moodLabels.push(label)
        }
      })
    }
  })

  // Determine era label
  const releaseYear = new Date(movie.release_date).getFullYear()
  let eraLabel = 'Unknown'
  if (releaseYear >= 1980 && releaseYear <= 1989) eraLabel = '1980s'
  else if (releaseYear >= 1990 && releaseYear <= 1999) eraLabel = '1990s'
  else if (releaseYear >= 2000 && releaseYear <= 2009) eraLabel = '2000s'
  else if (releaseYear >= 2010 && releaseYear <= 2019) eraLabel = '2010s'
  else if (releaseYear >= 2020 && releaseYear <= 2029) eraLabel = '2020s'

  // Determine runtime label
  const runtime = movie.runtime || 0
  let runtimeLabel = 'Unknown'
  if (runtime < 90) runtimeLabel = 'Short'
  else if (runtime >= 90 && runtime <= 120) runtimeLabel = 'Medium'
  else if (runtime > 120) runtimeLabel = 'Long'

  // Determine rating label
  const rating = movie.vote_average
  let ratingLabel = 'Unknown'
  if (rating >= 9) ratingLabel = 'Masterpiece (9+)'
  else if (rating >= 8) ratingLabel = 'Excellent (8+)'
  else if (rating >= 7) ratingLabel = 'Very Good (7+)'
  else if (rating >= 6) ratingLabel = 'Good (6+)'

  return {
    genres: matchedGenres,
    moods: moodLabels,
    era: eraLabel,
    runtime: runtimeLabel,
    rating: ratingLabel,
  }
}

/**
 * Generate human-readable match explanation
 *
 * @param criteria - Match criteria
 * @returns Explanation string
 */
export function generateMatchExplanation(criteria: MatchCriteria): string {
  const parts: string[] = []

  if (criteria.genres.length > 0) {
    parts.push(criteria.genres.join(' and '))
  }

  if (criteria.era !== 'Unknown') {
    parts.push(`${criteria.era} films`)
  }

  if (parts.length === 0) {
    return 'Matches your preferences'
  }

  return `Based on your love of ${parts.join(' and ')}`
}

/**
 * Check if a movie matches all quiz criteria (strict AND logic)
 *
 * @param movie - TMDB movie data
 * @param selections - User's quiz selections
 * @returns true if movie matches ALL criteria
 */
export function matchesAllCriteria(
  movie: TMDBMovie,
  selections: QuizSelections
): boolean {
  // Check genres (ALL selected genres must be present)
  const hasAllGenres = selections.genres.every((genreId) =>
    movie.genre_ids.includes(genreId)
  )
  if (!hasAllGenres) return false

  // Check moods (ALL selected mood genres must be present)
  const hasAllMoods = selections.moods.every((moodGenreId) =>
    movie.genre_ids.includes(moodGenreId)
  )
  if (!hasAllMoods) return false

  // Check era (release date within range)
  const releaseDate = new Date(movie.release_date)
  const eraStart = new Date(selections.era.gte)
  const eraEnd = new Date(selections.era.lte)
  if (releaseDate < eraStart || releaseDate > eraEnd) return false

  // Check runtime (within range)
  const runtime = movie.runtime || 0
  if (runtime < selections.runtime.gte || runtime > selections.runtime.lte) {
    return false
  }

  // Check rating (meets minimum threshold)
  if (movie.vote_average < selections.rating) return false

  return true
}

/**
 * Filter and transform TMDB movies to recommendations
 *
 * @param movies - Array of TMDB movie responses
 * @param selections - User's quiz selections
 * @returns Array of MovieRecommendation objects
 */
export function matchMovies(
  movies: TMDBMovie[],
  selections: QuizSelections
): MovieRecommendation[] {
  return movies
    .filter((movie) => matchesAllCriteria(movie, selections))
    .map((movie) => {
      const matchCriteria = generateMatchCriteria(movie, selections)
      const matchExplanation = generateMatchExplanation(matchCriteria)

      return {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        runtime: movie.runtime || 0,
        overview: movie.overview,
        genreIds: movie.genre_ids,
        matchExplanation,
        matchCriteria,
      }
    })
}

/**
 * Calculate match score for sorting (optional - for future ranking)
 * Higher score = better match
 *
 * @param movie - TMDB movie data
 * @param selections - User's quiz selections
 * @returns Match score (0-100)
 */
export function calculateMatchScore(
  movie: TMDBMovie,
  selections: QuizSelections
): number {
  let score = 0

  // Genre matches (20 points max)
  const genreMatches = selections.genres.filter((genreId) =>
    movie.genre_ids.includes(genreId)
  ).length
  score += (genreMatches / selections.genres.length) * 20

  // Mood matches (20 points max)
  const moodMatches = selections.moods.filter((moodGenreId) =>
    movie.genre_ids.includes(moodGenreId)
  ).length
  score += (moodMatches / selections.moods.length) * 20

  // Rating bonus (30 points max)
  score += (movie.vote_average / 10) * 30

  // Popularity bonus (30 points max - assuming popularity field exists)
  // This would need the popularity field from TMDB
  // score += (movie.popularity / 1000) * 30; // Normalize popularity

  return Math.min(score, 100)
}
