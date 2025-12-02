/**
 * Validation utilities for quiz selections
 *
 * Validates user input before API calls
 */

import { QuizSelections } from '@/types/quiz'

/**
 * Validation error details
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validate quiz selections before submitting to API
 *
 * Requirements:
 * - At least 1 genre selected
 * - At least 1 mood selected
 * - Era has valid date range (gte < lte)
 * - Runtime has valid range (gte < lte, positive values)
 * - Rating is between 0-10
 *
 * @param selections - User's quiz selections
 * @returns Validation result with errors if any
 */
export function validateSelections(
  selections: Partial<QuizSelections>
): ValidationResult {
  const errors: ValidationError[] = []

  // Validate genres
  if (!selections.genres || selections.genres.length === 0) {
    errors.push({
      field: 'genres',
      message: 'At least one genre must be selected',
    })
  }

  // Validate moods
  if (!selections.moods || selections.moods.length === 0) {
    errors.push({
      field: 'moods',
      message: 'At least one mood must be selected',
    })
  }

  // Validate era
  if (!selections.era) {
    errors.push({
      field: 'era',
      message: 'Era must be selected',
    })
  } else {
    // Validate date range
    const start = new Date(selections.era.gte)
    const end = new Date(selections.era.lte)

    if (isNaN(start.getTime())) {
      errors.push({
        field: 'era',
        message: 'Invalid start date format',
      })
    }

    if (isNaN(end.getTime())) {
      errors.push({
        field: 'era',
        message: 'Invalid end date format',
      })
    }

    if (start >= end) {
      errors.push({
        field: 'era',
        message: 'Start date must be before end date',
      })
    }
  }

  // Validate runtime
  if (!selections.runtime) {
    errors.push({
      field: 'runtime',
      message: 'Runtime preference must be selected',
    })
  } else {
    if (selections.runtime.gte < 0) {
      errors.push({
        field: 'runtime',
        message: 'Runtime minimum cannot be negative',
      })
    }

    if (selections.runtime.lte < 0) {
      errors.push({
        field: 'runtime',
        message: 'Runtime maximum cannot be negative',
      })
    }

    if (selections.runtime.gte >= selections.runtime.lte) {
      errors.push({
        field: 'runtime',
        message: 'Runtime minimum must be less than maximum',
      })
    }
  }

  // Validate rating
  if (selections.rating === undefined || selections.rating === null) {
    errors.push({
      field: 'rating',
      message: 'Rating preference must be selected',
    })
  } else {
    if (selections.rating < 0 || selections.rating > 10) {
      errors.push({
        field: 'rating',
        message: 'Rating must be between 0 and 10',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate that at least one selection is made for a question
 * (Used for UI validation before advancing)
 *
 * @param answer - User's answer (can be array or single value)
 * @returns true if at least one selection made
 */
export function hasSelection(answer: any): boolean {
  if (Array.isArray(answer)) {
    return answer.length > 0
  }
  return answer !== null && answer !== undefined
}

/**
 * Check if all 5 questions have been answered
 *
 * @param selections - Partial quiz selections
 * @returns true if all questions answered
 */
export function isQuizComplete(selections: Partial<QuizSelections>): boolean {
  return !!(
    selections.genres &&
    selections.genres.length > 0 &&
    selections.moods &&
    selections.moods.length > 0 &&
    selections.era &&
    selections.runtime &&
    selections.rating !== undefined &&
    selections.rating !== null
  )
}
