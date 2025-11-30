import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { WatchlistItem } from '@/types/movie'

const DATA_DIR = path.join(process.cwd(), 'data')
const WATCHLIST_FILE = path.join(DATA_DIR, 'watchlist.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    const data = await fs.readFile(WATCHLIST_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveWatchlist(watchlist: WatchlistItem[]) {
  await ensureDataDir()
  await fs.writeFile(WATCHLIST_FILE, JSON.stringify(watchlist, null, 2))
}

export async function GET() {
  try {
    const watchlist = await getWatchlist()
    return NextResponse.json(watchlist)
  } catch (error) {
    console.error('Error reading watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { movieId, movieTitle, posterPath } = body

    const errors: Record<string, string> = {}

    if (movieId === undefined || movieId === null) {
      errors.movieId = 'Movie ID is required'
    } else if (typeof movieId !== 'number' || !Number.isInteger(movieId) || movieId <= 0) {
      errors.movieId = 'Movie ID must be a positive integer'
    }

    if (!movieTitle) {
      errors.movieTitle = 'Movie title is required'
    } else if (typeof movieTitle !== 'string' || movieTitle.trim() === '') {
      errors.movieTitle = 'Movie title must be a non-empty string'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    const watchlist = await getWatchlist()

    // Check if already in watchlist
    if (watchlist.some((item) => item.movieId === movieId)) {
      return NextResponse.json(
        { error: 'Movie already in watchlist' },
        { status: 400 }
      )
    }

    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      movieId,
      movieTitle,
      posterPath,
      addedAt: new Date().toISOString(),
    }

    watchlist.push(newItem)
    await saveWatchlist(watchlist)

    return NextResponse.json(
      { message: 'Added to watchlist successfully', item: newItem },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving to watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const movieId = searchParams.get('movieId')

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    const watchlist = await getWatchlist()
    const filtered = watchlist.filter(
      (item) => item.movieId !== Number(movieId)
    )

    await saveWatchlist(filtered)

    return NextResponse.json({ message: 'Removed from watchlist' })
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    )
  }
}
