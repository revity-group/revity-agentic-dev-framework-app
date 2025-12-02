/**
 * API Route: Quiz Recommendations
 *
 * POST /api/quiz/recommendations
 *
 * Accepts quiz selections and returns personalized movie recommendations
 * using TMDB discover endpoint with strict AND matching logic.
 */

import { NextRequest, NextResponse } from 'next/server'
import { QuizSelections } from '@/types/quiz'
import { validateSelections } from '@/lib/quiz/validation'
import { matchMovies } from '@/lib/quiz/matching'
import { RESULTS_LIMIT } from '@/lib/quiz/constants'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * TMDB Movie response structure
 */
interface TMDBMovieResponse {
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
 * TMDB Discover response structure
 */
interface TMDBDiscoverResponse {
  page: number
  results: TMDBMovieResponse[]
  total_pages: number
  total_results: number
}

/**
 * Build TMDB discover query parameters from quiz selections
 */
function buildTMDBQuery(selections: QuizSelections): URLSearchParams {
  const params = new URLSearchParams()

  // API key
  params.append('api_key', TMDB_API_KEY!)

  // Genres (comma-separated for AND logic)
  // Combine both genre and mood selections
  const allGenres = [...new Set([...selections.genres, ...selections.moods])]
  params.append('with_genres', allGenres.join(','))

  // Era (release date range)
  params.append('primary_release_date.gte', selections.era.gte)
  params.append('primary_release_date.lte', selections.era.lte)

  // Runtime range
  params.append('with_runtime.gte', selections.runtime.gte.toString())
  params.append('with_runtime.lte', selections.runtime.lte.toString())

  // Rating threshold
  params.append('vote_average.gte', selections.rating.toString())

  // Sort by popularity (most popular first)
  params.append('sort_by', 'popularity.desc')

  // Vote count minimum (ensure quality results)
  params.append('vote_count.gte', '100')

  // Page 1 (fetch enough results to filter)
  params.append('page', '1')

  return params
}

/**
 * Fetch movie details including runtime
 * Runtime is not included in discover endpoint, need separate call
 */
async function fetchMovieDetails(
  movieId: number
): Promise<TMDBMovieResponse | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      return null
    }

    const movie = await response.json()
    return movie
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error)
    return null
  }
}

/**
 * POST /api/quiz/recommendations
 *
 * Get personalized movie recommendations based on quiz selections
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const selections: QuizSelections = body

    // Validate selections
    const validation = validateSelections(selections)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: validation.errors[0]?.message || 'Invalid quiz selections',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    // Check TMDB API key
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY not configured')
      return NextResponse.json(
        {
          error: 'Configuration error',
          message: 'Unable to fetch recommendations. Please try again later.',
        },
        { status: 500 }
      )
    }

    // Build TMDB query
    const queryParams = buildTMDBQuery(selections)

    // Fetch from TMDB discover endpoint
    const discoverUrl = `${TMDB_BASE_URL}/discover/movie?${queryParams.toString()}`

    const discoverResponse = await fetch(discoverUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!discoverResponse.ok) {
      console.error(
        'TMDB API error:',
        discoverResponse.status,
        discoverResponse.statusText
      )
      return NextResponse.json(
        {
          error: 'External API error',
          message: 'Unable to fetch recommendations. Please try again later.',
        },
        { status: 500 }
      )
    }

    const discoverData: TMDBDiscoverResponse = await discoverResponse.json()

    // Fetch runtime details for each movie (parallel requests)
    const moviesWithRuntime = await Promise.all(
      discoverData.results.map(async (movie) => {
        const details = await fetchMovieDetails(movie.id)
        return details ? { ...movie, runtime: details.runtime } : movie
      })
    )

    // Apply strict AND matching logic
    const matchedMovies = matchMovies(moviesWithRuntime, selections)

    // Limit results
    const recommendations = matchedMovies.slice(0, RESULTS_LIMIT)
    const totalMatches = matchedMovies.length

    // Return recommendations
    if (recommendations.length === 0) {
      return NextResponse.json({
        recommendations: [],
        totalMatches: 0,
        message: 'No movies match all your preferences',
      })
    }

    return NextResponse.json({
      recommendations,
      totalMatches,
    })
  } catch (error) {
    console.error('Error in quiz recommendations API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Unable to fetch recommendations. Please try again later.',
      },
      { status: 500 }
    )
  }
}
