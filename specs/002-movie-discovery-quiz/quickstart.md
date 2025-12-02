# Quickstart: Movie Discovery Quiz

**Feature**: Movie Discovery Quiz  
**Branch**: `002-movie-discovery-quiz`  
**Last Updated**: 2025-12-02

## Overview

This guide helps developers quickly understand and work with the Movie Discovery Quiz feature. The quiz helps users discover personalized movie recommendations by answering 5 questions about their preferences.

## Prerequisites

- Node.js 18+ or Bun installed
- TMDB API key configured in `.env.local`
- Existing Movie Watchlist App running
- Basic familiarity with Next.js 15 App Router, React 18, TypeScript

## Architecture Summary

**Pattern**: Single-page flow with client-side state management  
**State**: React `useReducer` for quiz navigation and selections  
**Data Fetching**: Next.js API route (`/api/quiz/recommendations`) proxies TMDB  
**Caching**: Browser localStorage with 30-day expiration  
**Matching**: Strict AND logic (all criteria must match)

## Key Files

```
├── app/
│   ├── page.tsx                           # "Find My Movie" button added here
│   └── api/quiz/recommendations/route.ts  # Recommendation endpoint
├── components/quiz/
│   ├── QuizContainer.tsx                  # Main orchestrator (client component)
│   ├── QuizQuestion.tsx                   # Question display
│   ├── ProgressIndicator.tsx              # "Question X of 5"
│   ├── QuizNavigation.tsx                 # Back/Next buttons
│   └── ResultsDisplay.tsx                 # Movie cards with match info
├── lib/quiz/
│   ├── matching.ts                        # Strict AND matching algorithm
│   ├── cache.ts                           # localStorage utilities
│   └── validation.ts                      # Input validation
└── types/quiz.ts                          # TypeScript definitions
```

## Quick Start: Running the Quiz

### 1. Launch the Quiz

Click the **"Find My Movie"** button on the main page. This opens the quiz in single-page flow (replaces main content).

### 2. Answer Questions (5 total)

- **Q1: Genres** - Multi-select (Action, Comedy, Drama, etc.)
- **Q2: Mood** - Multi-select (Action-packed, Heartwarming, etc.)
- **Q3: Era** - Single-select (1980s, 1990s, 2000s, etc.)
- **Q4: Runtime** - Single-select (Short, Medium, Long)
- **Q5: Rating** - Single-select (6+, 7+, 8+, 9+)

**Navigation**:

- Click "Next" to advance (requires at least 1 selection)
- Click "Back" to return to previous question (preserves selections)
- Progress indicator shows "Question X of 5"

### 3. View Results

After question 5, see:

- 5-10 movie recommendations (or fewer if limited matches)
- Each movie card shows match explanation
- "Matches: Genre, Mood, Era, Runtime, Rating" tags
- **"Retake Quiz"** button to start over
- **"Exit"** button to return to main page

### 4. Cached Results

On return visits, quiz results are automatically loaded from cache if:

- Less than 30 days old
- Cache version matches current schema
- localStorage available

## Development Workflows

### Adding a New Question

1. Update `QUIZ_QUESTIONS` constant in `QuizContainer.tsx`
2. Add field to `QuizSelections` type in `types/quiz.ts`
3. Update `quizReducer` to handle new selection
4. Modify API route to include new parameter in TMDB query
5. Update validation logic in `lib/quiz/validation.ts`

### Modifying Matching Logic

**Current**: Strict AND (all criteria must match)

To change to weighted scoring or fallback relaxation:

1. Edit `lib/quiz/matching.ts` - `matchMovies()` function
2. Update API route in `app/api/quiz/recommendations/route.ts`
3. Adjust `matchCriteria` generation logic
4. Update documentation in `research.md`

### Changing Cache Duration

Default: 30 days

To modify:

1. Update `CACHE_EXPIRATION_MS` in `lib/quiz/cache.ts`
2. Update success criteria in `spec.md` if needed
3. Increment `CACHE_VERSION` to invalidate old caches

## API Usage

### POST `/api/quiz/recommendations`

**Request**:

```json
{
  "genres": [28, 878],
  "moods": [28, 53],
  "era": { "gte": "1990-01-01", "lte": "1999-12-31" },
  "runtime": { "gte": 90, "lte": 120 },
  "rating": 7
}
```

**Response**:

```json
{
  "recommendations": [
    {
      "id": 550,
      "title": "Fight Club",
      "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "rating": 8.4,
      "matchExplanation": "Based on your love of Drama and 1990s films",
      "matchCriteria": {
        "genres": ["Drama", "Thriller"],
        "moods": ["Thought-provoking"],
        "era": "1990s",
        "runtime": "Medium",
        "rating": "High (7+)"
      }
    }
  ],
  "totalMatches": 15
}
```

**Error Handling**:

- `400`: Invalid selections (missing required fields)
- `500`: TMDB API unavailable (show friendly error message)

## Common Tasks

### Testing the Matching Algorithm

```bash
bun test lib/quiz/__tests__/matching.test.ts
```

Tests verify:

- Strict AND logic (all criteria must match)
- Genre intersection (movie has ALL selected genres)
- Date range filtering
- Runtime range filtering
- Rating threshold filtering

### Testing Cache Utilities

```bash
bun test lib/quiz/__tests__/cache.test.ts
```

Tests verify:

- Cache save/load operations
- Expiration handling
- Version invalidation
- QuotaExceededError handling

### Debugging Quiz State

Add breakpoint in `quizReducer` function in `QuizContainer.tsx`:

```typescript
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  console.log('Action:', action) // <-- Add here
  // ...
}
```

Inspect:

- `state.currentStep` - Current question (1-5)
- `state.selections` - User answers so far
- `action.type` - What triggered state change

### Clearing Cached Results

**Programmatically**:

```typescript
import { clearCache } from '@/lib/quiz/cache'
clearCache()
```

**Manually**:

1. Open DevTools → Application → Local Storage
2. Find key: `quiz_result_v1`
3. Delete entry

## TMDB API Integration

### Genre IDs Reference

```typescript
const GENRE_MAP = {
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
```

### Mood Mappings

```typescript
const MOOD_TO_GENRE = {
  'action-packed': [28], // Action
  heartwarming: [10749, 18], // Romance, Drama
  'thought-provoking': [18, 878], // Drama, Sci-Fi
  scary: [27, 53], // Horror, Thriller
  funny: [35], // Comedy
  romantic: [10749], // Romance
}
```

### TMDB Discover Endpoint

**Endpoint**: `https://api.themoviedb.org/3/discover/movie`

**Key Parameters**:

- `with_genres`: Comma-separated genre IDs (AND logic)
- `primary_release_date.gte`: Start date (YYYY-MM-DD)
- `primary_release_date.lte`: End date (YYYY-MM-DD)
- `with_runtime.gte`: Minimum minutes
- `with_runtime.lte`: Maximum minutes
- `vote_average.gte`: Minimum rating
- `sort_by`: popularity.desc (default)
- `page`: 1 (fetch first page only for 5-10 results)

## Troubleshooting

### No Recommendations Returned

**Check**:

1. Are selections too restrictive? (e.g., multiple obscure genres + high rating + specific decade)
2. TMDB API returning results? (check Network tab in DevTools)
3. Matching logic correctly combining criteria? (check `matching.ts`)

**Solution**: Display friendly message "No movies match all your preferences. Try adjusting your choices" with "Retake Quiz" button.

### Cache Not Loading

**Check**:

1. Is cache expired? (>30 days old)
2. Cache version mismatch? (schema changed)
3. localStorage available? (private browsing mode disables it)

**Solution**: Quiz should work without cache, just won't auto-load on return.

### Quiz State Not Preserving on Back Navigation

**Check**:

1. Is `quizReducer` handling `PREV_STEP` action correctly?
2. Are selections stored in state before navigating?

**Debug**: Add console.log in reducer to inspect state transitions.

### TMDB API Rate Limiting

**Check**:

1. Are you making too many requests during development?
2. TMDB has rate limits (40 requests per 10 seconds)

**Solution**:

- Use cached results during development
- Add request debouncing if needed
- Use TMDB's `page` parameter to fetch more results per request

## Performance Considerations

**Target Metrics** (from spec):

- Quiz completion: <3 minutes
- Recommendations load: <5 seconds
- Cache size: ~50KB per result

**Optimization Tips**:

- Use React.memo for QuizQuestion components (avoid re-renders)
- Debounce API calls if implementing live preview
- Cache TMDB responses in API route (1 hour revalidation)
- Lazy load movie poster images

## Next Steps

After understanding the basics:

1. Review [spec.md](./spec.md) for complete requirements
2. Check [research.md](./research.md) for technical decisions
3. Study [data-model.md](./data-model.md) for type definitions
4. Read [contracts/quiz-api.yaml](./contracts/quiz-api.yaml) for API spec
5. Run unit tests to understand expected behavior

## Support

For questions or issues:

- Review constitution principles in `.specify/memory/constitution.md`
- Check existing movie watchlist code patterns
- Refer to Next.js 15 documentation for App Router patterns
- Consult TMDB API documentation for endpoint details
