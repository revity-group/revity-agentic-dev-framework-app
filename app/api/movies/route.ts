import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') || 'popular'
  const page = searchParams.get('page') || '1'

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error('Failed to fetch movies from TMDB')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}
