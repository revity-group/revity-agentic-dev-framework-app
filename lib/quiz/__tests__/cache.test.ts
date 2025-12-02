/**
 * Unit tests for quiz cache utilities
 *
 * Tests localStorage caching with expiration and version validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  setCache,
  getCache,
  clearCache,
  hasCachedResults,
  getCacheMetadata,
} from '../cache'
import { QuizSelections, MovieRecommendation } from '@/types/quiz'
import { CACHE_VERSION } from '../constants'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Setup global mocks
beforeEach(() => {
  // Clear localStorage before each test
  localStorageMock.clear()

  // Mock window.localStorage
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })

  // Reset Date.now mock
  vi.restoreAllMocks()
})

// Mock data
const mockSelections: QuizSelections = {
  genres: [18, 53],
  moods: [18],
  era: { gte: '1990-01-01', lte: '1999-12-31' },
  runtime: { gte: 121, lte: 300 },
  rating: 8,
}

const mockRecommendations: MovieRecommendation[] = [
  {
    id: 550,
    title: 'Fight Club',
    posterPath: '/test.jpg',
    releaseDate: '1999-10-15',
    rating: 8.4,
    runtime: 139,
    overview: 'Test overview',
    genreIds: [18, 53],
    matchExplanation: 'Test explanation',
    matchCriteria: {
      genres: ['Drama'],
      moods: ['Thought-provoking'],
      era: '1990s',
      runtime: 'Long',
      rating: 'Excellent',
    },
  },
]

describe('setCache and getCache - Save/Load Operations', () => {
  it('should save and retrieve cache successfully', () => {
    // Arrange
    const selections = mockSelections
    const recommendations = mockRecommendations
    const totalMatches = 10

    // Act
    const saveResult = setCache(selections, recommendations, totalMatches)
    const cached = getCache()

    // Assert
    expect(saveResult).toBe(true)
    expect(cached).not.toBeNull()
    expect(cached?.selections).toEqual(selections)
    expect(cached?.recommendations).toEqual(recommendations)
    expect(cached?.totalMatches).toBe(totalMatches)
  })

  it('should store correct version in cache', () => {
    // Arrange
    const selections = mockSelections
    const recommendations = mockRecommendations

    // Act
    setCache(selections, recommendations, 10)
    const cached = getCache()

    // Assert
    expect(cached?.version).toBe(CACHE_VERSION)
  })

  it('should store timestamp and expiration', () => {
    // Arrange
    const mockNow = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(mockNow)
    const selections = mockSelections
    const recommendations = mockRecommendations

    // Act
    setCache(selections, recommendations, 10)
    const cached = getCache()

    // Assert
    expect(cached?.timestamp).toBe(mockNow)
    expect(cached?.expiresAt).toBeGreaterThan(mockNow)
  })
})

describe('getCache - Cache Expiration', () => {
  it('should return null for expired cache', () => {
    // Arrange
    const pastTime = Date.now() - 31 * 24 * 60 * 60 * 1000 // 31 days ago
    vi.spyOn(Date, 'now').mockReturnValueOnce(pastTime) // Save in past

    setCache(mockSelections, mockRecommendations, 10)

    vi.spyOn(Date, 'now').mockReturnValue(Date.now()) // Current time for retrieval

    // Act
    const cached = getCache()

    // Assert
    expect(cached).toBeNull()
  })

  it('should return cache if not expired', () => {
    // Arrange
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    setCache(mockSelections, mockRecommendations, 10)

    // Act
    const cached = getCache()

    // Assert
    expect(cached).not.toBeNull()
  })

  it('should clear expired cache automatically', () => {
    // Arrange
    const pastTime = Date.now() - 31 * 24 * 60 * 60 * 1000
    vi.spyOn(Date, 'now').mockReturnValueOnce(pastTime)

    setCache(mockSelections, mockRecommendations, 10)

    vi.spyOn(Date, 'now').mockReturnValue(Date.now())

    // Act
    getCache() // Should clear expired cache
    const cacheExists = hasCachedResults()

    // Assert
    expect(cacheExists).toBe(false)
  })
})

describe('getCache - Version Validation', () => {
  it('should return null for mismatched version', () => {
    // Arrange
    setCache(mockSelections, mockRecommendations, 10)

    // Manually corrupt version in localStorage
    const stored = localStorageMock.getItem('quiz_result')
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.version = 'v999' // Wrong version
      localStorageMock.setItem('quiz_result', JSON.stringify(parsed))
    }

    // Act
    const cached = getCache()

    // Assert
    expect(cached).toBeNull()
  })

  it('should clear cache with wrong version', () => {
    // Arrange
    setCache(mockSelections, mockRecommendations, 10)

    const stored = localStorageMock.getItem('quiz_result')
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.version = 'v999'
      localStorageMock.setItem('quiz_result', JSON.stringify(parsed))
    }

    // Act
    getCache()
    const cacheExists = hasCachedResults()

    // Assert
    expect(cacheExists).toBe(false)
  })
})

describe('setCache - QuotaExceededError Handling', () => {
  it('should return false when localStorage quota exceeded', () => {
    // Arrange
    const mockSetItem = vi.spyOn(localStorageMock, 'setItem')
    const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError')
    mockSetItem.mockImplementation(() => {
      throw quotaError
    })

    // Act
    const result = setCache(mockSelections, mockRecommendations, 10)

    // Assert
    expect(result).toBe(false)
  })

  it('should handle other errors gracefully', () => {
    // Arrange
    const mockSetItem = vi.spyOn(localStorageMock, 'setItem')
    mockSetItem.mockImplementation(() => {
      throw new Error('Unknown error')
    })

    // Act
    const result = setCache(mockSelections, mockRecommendations, 10)

    // Assert
    expect(result).toBe(false)
  })
})

describe('clearCache', () => {
  it('should remove cache from localStorage', () => {
    // Arrange
    setCache(mockSelections, mockRecommendations, 10)
    expect(hasCachedResults()).toBe(true)

    // Act
    clearCache()

    // Assert
    expect(hasCachedResults()).toBe(false)
  })

  it('should not throw error if cache does not exist', () => {
    // Arrange
    clearCache() // Clear non-existent cache

    // Act & Assert
    expect(() => clearCache()).not.toThrow()
  })
})

describe('hasCachedResults', () => {
  it('should return true when valid cache exists', () => {
    // Arrange
    setCache(mockSelections, mockRecommendations, 10)

    // Act
    const result = hasCachedResults()

    // Assert
    expect(result).toBe(true)
  })

  it('should return false when no cache exists', () => {
    // Act
    const result = hasCachedResults()

    // Assert
    expect(result).toBe(false)
  })

  it('should return false for expired cache', () => {
    // Arrange
    const pastTime = Date.now() - 31 * 24 * 60 * 60 * 1000
    vi.spyOn(Date, 'now').mockReturnValueOnce(pastTime)

    setCache(mockSelections, mockRecommendations, 10)

    vi.spyOn(Date, 'now').mockReturnValue(Date.now())

    // Act
    const result = hasCachedResults()

    // Assert
    expect(result).toBe(false)
  })
})

describe('getCacheMetadata', () => {
  it('should return cache metadata without loading full results', () => {
    // Arrange
    const mockNow = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(mockNow)

    setCache(mockSelections, mockRecommendations, 10)

    // Act
    const metadata = getCacheMetadata()

    // Assert
    expect(metadata).not.toBeNull()
    expect(metadata?.timestamp).toBe(mockNow)
    expect(metadata?.version).toBe(CACHE_VERSION)
    expect(metadata?.expiresAt).toBeGreaterThan(mockNow)
  })

  it('should return null when no cache exists', () => {
    // Act
    const metadata = getCacheMetadata()

    // Assert
    expect(metadata).toBeNull()
  })
})
