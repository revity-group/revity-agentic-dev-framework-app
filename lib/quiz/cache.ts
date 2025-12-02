/**
 * LocalStorage cache utilities for quiz results
 *
 * Implements 30-day expiration and version validation
 * Handles QuotaExceededError gracefully
 */

import { SavedResult, QuizSelections, MovieRecommendation } from '@/types/quiz'
import { CACHE_KEY, CACHE_VERSION, CACHE_EXPIRATION_MS } from './constants'

/**
 * Save quiz results to localStorage cache
 *
 * @param selections - User's quiz selections
 * @param recommendations - Movie recommendations
 * @param totalMatches - Total number of matches
 * @returns true if saved successfully, false if quota exceeded or storage unavailable
 */
export function setCache(
  selections: QuizSelections,
  recommendations: MovieRecommendation[],
  totalMatches: number
): boolean {
  // Check if localStorage is available
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage not available')
    return false
  }

  const now = Date.now()
  const savedResult: SavedResult = {
    cacheKey: CACHE_KEY,
    timestamp: now,
    expiresAt: now + CACHE_EXPIRATION_MS,
    version: CACHE_VERSION,
    selections,
    recommendations,
    totalMatches,
  }

  try {
    const serialized = JSON.stringify(savedResult)
    window.localStorage.setItem(CACHE_KEY, serialized)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded - clearing old data')
      // Try to clear old data and retry
      clearCache()
      try {
        const serialized = JSON.stringify(savedResult)
        window.localStorage.setItem(CACHE_KEY, serialized)
        return true
      } catch (retryError) {
        console.error('Failed to save cache after clearing:', retryError)
        return false
      }
    }
    console.error('Error saving to cache:', error)
    return false
  }
}

/**
 * Load quiz results from localStorage cache
 *
 * @returns SavedResult if valid cache exists, null otherwise
 */
export function getCache(): SavedResult | null {
  // Check if localStorage is available
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  try {
    const serialized = window.localStorage.getItem(CACHE_KEY)
    if (!serialized) {
      return null
    }

    const savedResult: SavedResult = JSON.parse(serialized)

    // Validate cache version
    if (savedResult.version !== CACHE_VERSION) {
      console.warn('Cache version mismatch - clearing old cache')
      clearCache()
      return null
    }

    // Check expiration
    const now = Date.now()
    if (now > savedResult.expiresAt) {
      console.warn('Cache expired - clearing')
      clearCache()
      return null
    }

    return savedResult
  } catch (error) {
    console.error('Error reading from cache:', error)
    clearCache() // Clear corrupted cache
    return null
  }
}

/**
 * Clear quiz results from localStorage cache
 */
export function clearCache(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

/**
 * Check if valid cache exists without loading it
 *
 * @returns true if valid cache exists, false otherwise
 */
export function hasCachedResults(): boolean {
  return getCache() !== null
}

/**
 * Get cache metadata without loading full results
 *
 * @returns Cache metadata (timestamp, expiration, version) or null
 */
export function getCacheMetadata(): {
  timestamp: number
  expiresAt: number
  version: string
} | null {
  const cached = getCache()
  if (!cached) {
    return null
  }

  return {
    timestamp: cached.timestamp,
    expiresAt: cached.expiresAt,
    version: cached.version,
  }
}
