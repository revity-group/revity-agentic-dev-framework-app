/**
 * Unit tests for quiz validation utilities
 *
 * Tests input validation before API calls
 */

import { describe, it, expect } from 'vitest'
import { validateSelections, hasSelection, isQuizComplete } from '../validation'
import { QuizSelections } from '@/types/quiz'

describe('validateSelections', () => {
  it('should validate complete and correct selections', () => {
    // Arrange
    const selections: QuizSelections = {
      genres: [18, 53],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail when genres are missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'genres',
      message: 'At least one genre must be selected',
    })
  })

  it('should fail when genres array is empty', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === 'genres')).toBe(true)
  })

  it('should fail when moods are missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'moods',
      message: 'At least one mood must be selected',
    })
  })

  it('should fail when era is missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === 'era')).toBe(true)
  })

  it('should fail when era start date is after end date', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1999-12-31', lte: '1990-01-01' }, // Invalid range
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'era',
      message: 'Start date must be before end date',
    })
  })

  it('should fail when runtime is missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === 'runtime')).toBe(true)
  })

  it('should fail when runtime minimum is negative', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: -10, lte: 120 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'runtime',
      message: 'Runtime minimum cannot be negative',
    })
  })

  it('should fail when runtime minimum is greater than or equal to maximum', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 120, lte: 90 },
      rating: 8,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'runtime',
      message: 'Runtime minimum must be less than maximum',
    })
  })

  it('should fail when rating is missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === 'rating')).toBe(true)
  })

  it('should fail when rating is below 0', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: -1,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'rating',
      message: 'Rating must be between 0 and 10',
    })
  })

  it('should fail when rating is above 10', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 11,
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'rating',
      message: 'Rating must be between 0 and 10',
    })
  })

  it('should collect multiple validation errors', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      // Missing genres and moods
      era: { gte: '1999-12-31', lte: '1990-01-01' }, // Invalid date range
      runtime: { gte: 120, lte: 90 }, // Invalid runtime range
      rating: 15, // Invalid rating
    }

    // Act
    const result = validateSelections(selections)

    // Assert
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})

describe('hasSelection', () => {
  it('should return true for non-empty array', () => {
    // Arrange
    const answer = [1, 2, 3]

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false for empty array', () => {
    // Arrange
    const answer: any[] = []

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(false)
  })

  it('should return true for non-null object', () => {
    // Arrange
    const answer = { gte: '1990-01-01', lte: '1999-12-31' }

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(true)
  })

  it('should return true for number value', () => {
    // Arrange
    const answer = 8

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false for null', () => {
    // Arrange
    const answer = null

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false for undefined', () => {
    // Arrange
    const answer = undefined

    // Act
    const result = hasSelection(answer)

    // Assert
    expect(result).toBe(false)
  })
})

describe('isQuizComplete', () => {
  it('should return true when all questions are answered', () => {
    // Arrange
    const selections: QuizSelections = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = isQuizComplete(selections)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false when genres are missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = isQuizComplete(selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when any field is missing', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      // Missing moods
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: 8,
    }

    // Act
    const result = isQuizComplete(selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when rating is null', () => {
    // Arrange
    const selections: Partial<QuizSelections> = {
      genres: [18],
      moods: [18],
      era: { gte: '1990-01-01', lte: '1999-12-31' },
      runtime: { gte: 90, lte: 120 },
      rating: null as any,
    }

    // Act
    const result = isQuizComplete(selections)

    // Assert
    expect(result).toBe(false)
  })
})
