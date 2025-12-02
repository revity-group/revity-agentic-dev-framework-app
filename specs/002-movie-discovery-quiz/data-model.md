# Data Model: Movie Discovery Quiz

**Feature**: Movie Discovery Quiz  
**Date**: 2025-12-02  
**Purpose**: Define data structures for quiz state, user selections, recommendations, and cache

## Core Entities

### QuizQuestion

Represents a single question in the 5-question quiz flow.

**Fields**:

- `id`: number (1-5) - Question position/identifier
- `text`: string - Question prompt displayed to user
- `type`: 'multi-select' | 'single-select' - Selection behavior
- `options`: QuizOption[] - Available answer choices

**Relationships**:

- Part of QuizSession (5 questions total)
- Has many QuizOptions

**Validation**:

- `id` must be 1-5
- `text` must be non-empty
- `type` must match expected selection behavior
- `options` must have at least 2 choices

**State Transitions**: N/A (static configuration)

---

### QuizOption

Represents a single answer choice within a question.

**Fields**:

- `id`: string - Unique identifier for the option
- `label`: string - Display text shown to user
- `value`: string | number - Value used for API filtering
- `icon`?: string - Optional Lucide icon name for mood options

**Relationships**:

- Belongs to QuizQuestion

**Validation**:

- `id` must be unique within question
- `label` must be non-empty
- `value` must match TMDB API parameter format

**Examples**:

```typescript
// Genre option
{ id: 'action', label: 'Action', value: 28 }

// Mood option
{ id: 'action-packed', label: 'Action-packed', value: 28, icon: 'Zap' }

// Era option
{ id: '1990s', label: '1990s', value: { gte: '1990-01-01', lte: '1999-12-31' } }

// Runtime option
{ id: 'medium', label: 'Medium (90-120 min)', value: { gte: 90, lte: 120 } }

// Rating option
{ id: 'high', label: '8+ (Highly Rated)', value: 8 }
```

---

### QuizSession

Represents a user's current or completed quiz attempt with all selections.

**Fields**:

- `currentStep`: number (1-5) - Current question being answered
- `selections`: QuizSelections - User's answers for all questions
- `isComplete`: boolean - Whether all 5 questions answered
- `startedAt`: Date - Timestamp when quiz started
- `completedAt`?: Date - Timestamp when quiz completed

**Relationships**:

- Contains QuizSelections
- Generates MovieRecommendation[] upon completion

**Validation**:

- `currentStep` must be 1-5
- `selections` must have at least one selection per completed question
- `isComplete` requires all 5 questions answered
- `completedAt` only set when `isComplete` is true

**State Transitions**:

```
Initial → In Progress (step 1-5) → Complete → Cached
   ↓           ↓                      ↓
Created    Navigating            Results Shown
           (can go back)
```

---

### QuizSelections

Container for all user answers across the 5 questions.

**Fields**:

- `genres`: number[] - Selected TMDB genre IDs (from Q1)
- `moods`: number[] - Selected mood-mapped genre IDs (from Q2)
- `era`: { gte: string, lte: string } - Date range (from Q3)
- `runtime`: { gte: number, lte: number } - Minutes range (from Q4)
- `rating`: number - Minimum rating threshold (from Q5)

**Relationships**:

- Part of QuizSession
- Used by matching algorithm to filter movies

**Validation**:

- `genres`: at least 1 item, all valid TMDB genre IDs
- `moods`: at least 1 item, all valid TMDB genre IDs
- `era.gte` < `era.lte`, valid ISO date format
- `runtime.gte` < `runtime.lte`, positive integers
- `rating`: number between 0-10

**Strict AND Matching Logic**:
All fields are combined with AND logic:

- Movie MUST have ALL selected genres
- Movie MUST have ALL selected moods
- Movie MUST be released within era range
- Movie MUST have runtime within range
- Movie MUST have rating >= threshold

---

### MovieRecommendation

Represents a recommended movie with explanation of why it matched.

**Fields**:

- `id`: number - TMDB movie ID
- `title`: string - Movie title
- `posterPath`: string | null - TMDB poster image path
- `releaseDate`: string - ISO date (YYYY-MM-DD)
- `rating`: number - Vote average (0-10)
- `runtime`: number - Duration in minutes
- `overview`: string - Movie description
- `genreIds`: number[] - TMDB genre IDs
- `matchExplanation`: string - Human-readable match reason
- `matchCriteria`: MatchCriteria - Detailed match breakdown

**Relationships**:

- Generated from QuizSession
- Part of SavedResult

**Validation**:

- `id` must be valid TMDB movie ID
- `rating` must be 0-10
- `runtime` must be positive integer
- `matchCriteria` must show ALL quiz criteria matched

**Example**:

```typescript
{
  id: 550,
  title: "Fight Club",
  posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  releaseDate: "1999-10-15",
  rating: 8.4,
  runtime: 139,
  overview: "A ticking-time-bomb insomniac...",
  genreIds: [18, 53],
  matchExplanation: "Based on your love of Drama and 1990s films",
  matchCriteria: {
    genres: ["Drama", "Thriller"],
    moods: ["Thought-provoking"],
    era: "1990s",
    runtime: "Long",
    rating: "High (8+)"
  }
}
```

---

### MatchCriteria

Detailed breakdown showing which quiz criteria a movie matched.

**Fields**:

- `genres`: string[] - Matched genre names
- `moods`: string[] - Matched mood labels
- `era`: string - Matched decade label
- `runtime`: string - Matched runtime category
- `rating`: string - Matched rating category

**Relationships**:

- Part of MovieRecommendation

**Validation**:

- All arrays must contain at least 1 item (strict AND requires all criteria met)
- Labels must match original quiz option labels

**Display Format**: "Matches: Drama, Thought-provoking, 1990s, Long, High Rating"

---

### SavedResult

Represents a cached quiz result for automatic retrieval on return visits.

**Fields**:

- `cacheKey`: string - Unique cache identifier
- `timestamp`: number - Unix timestamp when cached
- `expiresAt`: number - Unix timestamp for cache expiration
- `version`: string - Cache schema version for invalidation
- `selections`: QuizSelections - User's original quiz answers
- `recommendations`: MovieRecommendation[] - Cached movie results (5-10)
- `totalMatches`: number - Total movies that matched criteria

**Relationships**:

- Contains QuizSelections
- Contains MovieRecommendation[]

**Validation**:

- `expiresAt` must be `timestamp + 30 days`
- `version` must match current cache schema version
- `recommendations` must have 1-10 items (or 0 if no matches)
- `totalMatches` >= `recommendations.length`

**Cache Expiration Logic**:

```typescript
const isExpired = Date.now() > savedResult.expiresAt
const isValidVersion = savedResult.version === CURRENT_CACHE_VERSION
const isCacheValid = !isExpired && isValidVersion
```

**Storage Constraints**:

- Maximum size: ~50KB per result
- Storage location: Browser localStorage
- Key format: `quiz_result_v{version}`
- Fallback: If localStorage unavailable, quiz works but results not cached

---

## Entity Relationships Diagram

```
QuizSession
├── currentStep: number
├── selections: QuizSelections
│   ├── genres: number[]
│   ├── moods: number[]
│   ├── era: DateRange
│   ├── runtime: NumberRange
│   └── rating: number
├── isComplete: boolean
└── completedAt?: Date

↓ (generates on completion)

SavedResult (cached to localStorage)
├── selections: QuizSelections
├── recommendations: MovieRecommendation[]
│   ├── id, title, posterPath...
│   └── matchCriteria: MatchCriteria
│       ├── genres: string[]
│       ├── moods: string[]
│       ├── era: string
│       ├── runtime: string
│       └── rating: string
├── timestamp, expiresAt
└── version: string
```

---

## Type Definitions Reference

All types defined in `/types/quiz.ts`:

```typescript
export interface QuizQuestion {
  id: number
  text: string
  type: 'multi-select' | 'single-select'
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  label: string
  value: number | { gte: number | string; lte: number | string }
  icon?: string
}

export interface QuizSelections {
  genres: number[]
  moods: number[]
  era: { gte: string; lte: string }
  runtime: { gte: number; lte: number }
  rating: number
}

export interface QuizSession {
  currentStep: number
  selections: Partial<QuizSelections>
  isComplete: boolean
  startedAt: Date
  completedAt?: Date
}

export interface MatchCriteria {
  genres: string[]
  moods: string[]
  era: string
  runtime: string
  rating: string
}

export interface MovieRecommendation {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string
  rating: number
  runtime: number
  overview: string
  genreIds: number[]
  matchExplanation: string
  matchCriteria: MatchCriteria
}

export interface SavedResult {
  cacheKey: string
  timestamp: number
  expiresAt: number
  version: string
  selections: QuizSelections
  recommendations: MovieRecommendation[]
  totalMatches: number
}
```

---

## Data Flow

1. **Quiz Start**: Create QuizSession with `currentStep: 1`, empty selections
2. **User Answers**: Update `selections` as user progresses through steps 1-5
3. **Backward Navigation**: Preserve existing selections when returning to previous questions
4. **Quiz Completion**: Set `isComplete: true`, `completedAt: Date`, send to API
5. **API Processing**: Apply strict AND matching, return 5-10 MovieRecommendation[]
6. **Cache Storage**: Save SavedResult to localStorage with 30-day expiration
7. **Return Visit**: Check localStorage, auto-load if valid cache exists

---

## Cache Invalidation Rules

Cache is invalid and must be discarded if:

- `expiresAt` timestamp passed (>30 days old)
- `version` doesn't match current schema version
- localStorage quota exceeded (fallback to no-cache mode)
- User explicitly clicks "Retake Quiz" (clear cache, restart)

---

## Validation Summary

**Quiz Input Validation** (before API call):

- At least 1 genre selected
- At least 1 mood selected
- Era, runtime, rating always have single selection (single-select UI)

**API Response Validation** (after TMDB fetch):

- Each movie MUST match ALL criteria (strict AND)
- Return 5-10 movies if available
- Return 1-4 movies if fewer matches
- Return 0 movies with friendly error if no matches

**Cache Validation** (on load):

- Check expiration timestamp
- Verify schema version
- Handle localStorage errors gracefully
