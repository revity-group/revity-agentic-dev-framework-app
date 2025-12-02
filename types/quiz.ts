/**
 * Type definitions for Movie Discovery Quiz feature
 *
 * These types define the data structures for quiz state management,
 * user selections, movie recommendations, and cache persistence.
 */

/**
 * Represents a single answer choice within a quiz question
 */
export interface QuizOption {
  id: string
  label: string
  value: number | number[] | { gte: number | string; lte: number | string }
  icon?: string // Optional Lucide icon name for mood options
}

/**
 * Represents a single question in the 5-question quiz flow
 */
export interface QuizQuestion {
  id: number // 1-5
  text: string
  type: 'multi-select' | 'single-select'
  options: QuizOption[]
}

/**
 * Container for all user answers across the 5 questions
 */
export interface QuizSelections {
  genres: number[] // Selected TMDB genre IDs
  moods: number[] // Selected mood-mapped genre IDs
  era: { gte: string; lte: string } // Date range (ISO format)
  runtime: { gte: number; lte: number } // Minutes range
  rating: number // Minimum rating threshold (0-10)
}

/**
 * Represents a user's current or completed quiz attempt
 */
export interface QuizSession {
  currentStep: number // 1-5
  selections: Partial<QuizSelections> // User's answers (partial until complete)
  isComplete: boolean
  startedAt: Date
  completedAt?: Date
}

/**
 * Detailed breakdown showing which quiz criteria a movie matched
 */
export interface MatchCriteria {
  genres: string[] // Matched genre names
  moods: string[] // Matched mood labels
  era: string // Matched decade label
  runtime: string // Matched runtime category
  rating: string // Matched rating category
}

/**
 * Represents a recommended movie with explanation of match
 */
export interface MovieRecommendation {
  id: number // TMDB movie ID
  title: string
  posterPath: string | null // TMDB poster image path
  releaseDate: string // ISO date (YYYY-MM-DD)
  rating: number // Vote average (0-10)
  runtime: number // Duration in minutes
  overview: string
  genreIds: number[] // TMDB genre IDs
  matchExplanation: string // Human-readable match reason
  matchCriteria: MatchCriteria // Detailed match breakdown
}

/**
 * Represents a cached quiz result for automatic retrieval
 */
export interface SavedResult {
  cacheKey: string
  timestamp: number // Unix timestamp
  expiresAt: number // Unix timestamp
  version: string // Cache schema version
  selections: QuizSelections
  recommendations: MovieRecommendation[]
  totalMatches: number
}

/**
 * Quiz reducer state
 */
export interface QuizState {
  currentStep: number
  selections: Partial<QuizSelections>
  isComplete: boolean
  isLoading: boolean
  error: string | null
  recommendations: MovieRecommendation[]
  totalMatches: number
}

/**
 * Quiz reducer actions
 */
export type QuizAction =
  | { type: 'ANSWER_QUESTION'; payload: { step: number; answer: any } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_RECOMMENDATIONS'
      payload: { recommendations: MovieRecommendation[]; totalMatches: number }
    }
  | { type: 'LOAD_CACHED_RESULTS'; payload: SavedResult }
  | { type: 'RESET_QUIZ' }
  | { type: 'COMPLETE_QUIZ' }
