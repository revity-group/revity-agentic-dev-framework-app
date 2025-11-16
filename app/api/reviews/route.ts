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

    if (!movieId || !movieTitle || !userName || !email || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
