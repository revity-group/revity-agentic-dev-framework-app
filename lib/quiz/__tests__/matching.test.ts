/**
 * Unit tests for quiz matching algorithm
 *
 * Tests strict AND logic - movies must match ALL selected criteria
 */

import { describe, it, expect } from 'vitest'
import {
  matchesAllCriteria,
  matchMovies,
  generateMatchCriteria,
  generateMatchExplanation,
} from '../matching'
import { QuizSelections } from '@/types/quiz'

// Mock TMDB movie data
const mockMovie = {
  id: 550,
  title: 'Fight Club',
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  release_date: '1999-10-15',
  vote_average: 8.4,
  runtime: 139,
  overview: 'A ticking-time-bomb insomniac...',
  genre_ids: [18, 53], // Drama, Thriller
}

const mockSelections: QuizSelections = {
  genres: [18, 53], // Drama, Thriller
  moods: [18], // Thought-provoking (Drama)
  era: { gte: '1990-01-01', lte: '1999-12-31' },
  runtime: { gte: 121, lte: 300 },
  rating: 8,
}

describe('matchesAllCriteria - Strict AND Logic', () => {
  it('should return true when movie matches all criteria', () => {
    // Arrange
    const movie = mockMovie
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false when missing one genre', () => {
    // Arrange
    const movie = { ...mockMovie, genre_ids: [18] } // Only Drama, missing Thriller
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when missing mood genre', () => {
    // Arrange
    const movie = { ...mockMovie, genre_ids: [53] } // Only Thriller, missing Drama (mood)
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when release date is outside era range', () => {
    // Arrange
    const movie = { ...mockMovie, release_date: '2000-01-01' } // 2000s, not 1990s
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when runtime is below minimum', () => {
    // Arrange
    const movie = { ...mockMovie, runtime: 90 } // Below 121 min minimum
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when runtime is above maximum', () => {
    // Arrange
    const movie = { ...mockMovie, runtime: 350 } // Above 300 min maximum
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false when rating is below minimum threshold', () => {
    // Arrange
    const movie = { ...mockMovie, vote_average: 7.5 } // Below 8.0 threshold
    const selections = mockSelections

    // Act
    const result = matchesAllCriteria(movie, selections)

    // Assert
    expect(result).toBe(false)
  })
})

describe('matchMovies - Genre Intersection', () => {
  it('should filter movies that have ALL selected genres', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, genre_ids: [18, 53] }, // Has both Drama and Thriller ✓
      { ...mockMovie, id: 2, genre_ids: [18] }, // Only Drama ✗
      { ...mockMovie, id: 3, genre_ids: [18, 53, 28] }, // Has both + Action ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(1)
    expect(result[1].id).toBe(3)
  })

  it('should require ALL mood genres to be present', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, genre_ids: [18, 53] }, // Has Drama (mood) ✓
      { ...mockMovie, id: 2, genre_ids: [53] }, // Missing Drama (mood) ✗
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('should return empty array when no movies match all genres', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, genre_ids: [28] }, // Action only
      { ...mockMovie, id: 2, genre_ids: [35] }, // Comedy only
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(0)
  })
})

describe('matchMovies - Date Range Filtering', () => {
  it('should include movies within era range', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, release_date: '1990-01-01' }, // Start of range ✓
      { ...mockMovie, id: 2, release_date: '1995-06-15' }, // Middle of range ✓
      { ...mockMovie, id: 3, release_date: '1999-12-31' }, // End of range ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(3)
  })

  it('should exclude movies before era start date', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, release_date: '1989-12-31' }, // One day before ✗
      { ...mockMovie, id: 2, release_date: '1990-01-01' }, // Start date ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('should exclude movies after era end date', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, release_date: '1999-12-31' }, // End date ✓
      { ...mockMovie, id: 2, release_date: '2000-01-01' }, // One day after ✗
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })
})

describe('matchMovies - Runtime Range Filtering', () => {
  it('should include movies within runtime range', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, runtime: 121 }, // Minimum ✓
      { ...mockMovie, id: 2, runtime: 200 }, // Middle ✓
      { ...mockMovie, id: 3, runtime: 300 }, // Maximum ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(3)
  })

  it('should exclude movies below minimum runtime', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, runtime: 120 }, // Below minimum ✗
      { ...mockMovie, id: 2, runtime: 121 }, // At minimum ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('should exclude movies above maximum runtime', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, runtime: 300 }, // At maximum ✓
      { ...mockMovie, id: 2, runtime: 301 }, // Above maximum ✗
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })
})

describe('matchMovies - Rating Threshold', () => {
  it('should include movies at or above rating threshold', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, vote_average: 8.0 }, // At threshold ✓
      { ...mockMovie, id: 2, vote_average: 9.5 }, // Above threshold ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(2)
  })

  it('should exclude movies below rating threshold', () => {
    // Arrange
    const movies = [
      { ...mockMovie, id: 1, vote_average: 7.9 }, // Below threshold ✗
      { ...mockMovie, id: 2, vote_average: 8.0 }, // At threshold ✓
    ]
    const selections = mockSelections

    // Act
    const result = matchMovies(movies, selections)

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })
})

describe('generateMatchCriteria', () => {
  it('should generate correct match criteria labels', () => {
    // Arrange
    const movie = mockMovie
    const selections = mockSelections

    // Act
    const criteria = generateMatchCriteria(movie, selections)

    // Assert
    expect(criteria.genres).toContain('Drama')
    expect(criteria.genres).toContain('Thriller')
    expect(criteria.era).toBe('1990s')
    expect(criteria.runtime).toBe('Long')
    expect(criteria.rating).toContain('8+')
  })
})

describe('generateMatchExplanation', () => {
  it('should generate human-readable match explanation', () => {
    // Arrange
    const criteria = {
      genres: ['Drama', 'Thriller'],
      moods: ['Thought-provoking'],
      era: '1990s',
      runtime: 'Long',
      rating: 'Excellent (8+)',
    }

    // Act
    const explanation = generateMatchExplanation(criteria)

    // Assert
    expect(explanation).toContain('Drama')
    expect(explanation).toContain('1990s')
    expect(explanation.toLowerCase()).toContain('love')
  })
})
