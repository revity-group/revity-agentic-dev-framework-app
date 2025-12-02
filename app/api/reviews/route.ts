import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { MovieReview } from '@/types/movie'

const DATA_DIR = path.join(process.cwd(), 'data')
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function getReviews(): Promise<MovieReview[]> {
  try {
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveReviews(reviews: MovieReview[]) {
  await ensureDataDir()
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2))
}

export async function GET() {
  try {
    const reviews = await getReviews()
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error reading reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { movieId, movieTitle, userName, email, rating, review } = body

    const errors: Record<string, string> = {}

    if (!movieId) {
      errors.movieId = 'Movie ID is required'
    }

    if (!movieTitle) {
      errors.movieTitle = 'Movie title is required'
    }

    if (!userName) {
      errors.userName = 'User name is required'
    }

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format'
    }

    if (rating === undefined || rating === null) {
      errors.rating = 'Rating is required'
    } else {
      const ratingNum = Number(rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
        errors.rating = 'Rating must be a number between 1 and 10'
      }
    }

    if (!review) {
      errors.review = 'Review is required'
    } else if (typeof review === 'string' && review.length < 10) {
      errors.review = 'Review must be at least 10 characters long'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    const reviews = await getReviews()
    const newReview: MovieReview = {
      id: Date.now().toString(),
      movieId,
      movieTitle,
      userName,
      email,
      rating: Number(rating),
      review,
      createdAt: new Date().toISOString(),
    }

    reviews.push(newReview)
    await saveReviews(reviews)

    return NextResponse.json(
      { message: 'Review submitted successfully', review: newReview },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving review:', error)
    return NextResponse.json(
      { error: 'Failed to save review' },
      { status: 500 }
    )
  }
}
