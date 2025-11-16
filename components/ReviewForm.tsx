'use client'

import { Movie } from '@/types/movie'
import { useState, FormEvent } from 'react'

interface ReviewFormProps {
  movie: Movie
  onClose: () => void
}

export default function ReviewForm({ movie, onClose }: ReviewFormProps) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          userName,
          email,
          rating,
          review,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Review: {movie.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Share your thoughts about this movie
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl">✓</div>
              <h3 className="mb-2 text-2xl font-bold text-green-600">
                Review Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your review. It has been saved successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating: {rating}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Review
                  </label>
                  <textarea
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="What did you think about this movie?"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
