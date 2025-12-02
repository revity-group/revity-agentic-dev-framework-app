/**
 * Constants for Movie Discovery Quiz
 *
 * Genre mappings, mood mappings, and quiz question configurations
 */

import { QuizQuestion } from '@/types/quiz'

/**
 * TMDB Genre ID to Name mapping
 * Source: https://developer.themoviedb.org/reference/genre-movie-list
 */
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

/**
 * Mood to TMDB Genre ID mapping
 * Maps user-friendly mood labels to TMDB genre IDs
 */
export const MOOD_TO_GENRE: Record<string, number[]> = {
  'action-packed': [28], // Action
  heartwarming: [10749, 18], // Romance, Drama
  'thought-provoking': [18, 878], // Drama, Sci-Fi
  scary: [27, 53], // Horror, Thriller
  funny: [35], // Comedy
  romantic: [10749], // Romance
}

/**
 * Reverse mapping: TMDB Genre ID to Mood label(s)
 */
export const GENRE_TO_MOOD: Record<number, string[]> = {
  28: ['action-packed'],
  10749: ['heartwarming', 'romantic'],
  18: ['heartwarming', 'thought-provoking'],
  878: ['thought-provoking'],
  27: ['scary'],
  53: ['scary'],
  35: ['funny'],
}

/**
 * Quiz questions configuration
 * Defines all 5 questions with their options
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Question 1: Genres
  {
    id: 1,
    text: 'What genres interest you?',
    type: 'multi-select',
    options: [
      { id: 'action', label: 'Action', value: 28 },
      { id: 'comedy', label: 'Comedy', value: 35 },
      { id: 'drama', label: 'Drama', value: 18 },
      { id: 'horror', label: 'Horror', value: 27 },
      { id: 'romance', label: 'Romance', value: 10749 },
      { id: 'sci-fi', label: 'Sci-Fi', value: 878 },
      { id: 'thriller', label: 'Thriller', value: 53 },
      { id: 'adventure', label: 'Adventure', value: 12 },
      { id: 'animation', label: 'Animation', value: 16 },
      { id: 'crime', label: 'Crime', value: 80 },
      { id: 'fantasy', label: 'Fantasy', value: 14 },
      { id: 'mystery', label: 'Mystery', value: 9648 },
    ],
  },

  // Question 2: Mood (movie-watching goals)
  {
    id: 2,
    text: 'What mood are you in?',
    type: 'multi-select',
    options: [
      { id: 'action-packed', label: 'Action-packed', value: 28, icon: 'Zap' },
      {
        id: 'heartwarming',
        label: 'Heartwarming',
        value: [10749, 18],
        icon: 'Heart',
      },
      {
        id: 'thought-provoking',
        label: 'Thought-provoking',
        value: [18, 878],
        icon: 'Brain',
      },
      { id: 'scary', label: 'Scary', value: [27, 53], icon: 'Ghost' },
      { id: 'funny', label: 'Funny', value: 35, icon: 'Laugh' },
      {
        id: 'romantic',
        label: 'Romantic',
        value: 10749,
        icon: 'HeartHandshake',
      },
    ],
  },

  // Question 3: Era
  {
    id: 3,
    text: 'Which era do you prefer?',
    type: 'single-select',
    options: [
      {
        id: '1980s',
        label: '1980s',
        value: { gte: '1980-01-01', lte: '1989-12-31' },
      },
      {
        id: '1990s',
        label: '1990s',
        value: { gte: '1990-01-01', lte: '1999-12-31' },
      },
      {
        id: '2000s',
        label: '2000s',
        value: { gte: '2000-01-01', lte: '2009-12-31' },
      },
      {
        id: '2010s',
        label: '2010s',
        value: { gte: '2010-01-01', lte: '2019-12-31' },
      },
      {
        id: '2020s',
        label: '2020s',
        value: { gte: '2020-01-01', lte: '2029-12-31' },
      },
    ],
  },

  // Question 4: Runtime
  {
    id: 4,
    text: 'How long of a movie do you want?',
    type: 'single-select',
    options: [
      {
        id: 'short',
        label: 'Short (under 90 min)',
        value: { gte: 0, lte: 89 },
      },
      {
        id: 'medium',
        label: 'Medium (90-120 min)',
        value: { gte: 90, lte: 120 },
      },
      {
        id: 'long',
        label: 'Long (over 120 min)',
        value: { gte: 121, lte: 300 },
      },
    ],
  },

  // Question 5: Rating
  {
    id: 5,
    text: 'Minimum rating?',
    type: 'single-select',
    options: [
      { id: 'rating-6', label: '6+ (Good)', value: 6 },
      { id: 'rating-7', label: '7+ (Very Good)', value: 7 },
      { id: 'rating-8', label: '8+ (Excellent)', value: 8 },
      { id: 'rating-9', label: '9+ (Masterpiece)', value: 9 },
    ],
  },
]

/**
 * Cache configuration
 */
export const CACHE_KEY = 'quiz_result'
export const CACHE_VERSION = 'v1'
export const CACHE_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

/**
 * API configuration
 */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
export const RESULTS_LIMIT = 10 // Maximum number of recommendations to return
