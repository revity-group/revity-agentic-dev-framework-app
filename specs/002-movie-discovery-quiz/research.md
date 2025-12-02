# Research: Movie Discovery Quiz Implementation Patterns

**Feature**: Movie Discovery Quiz  
**Date**: 2025-12-02  
**Project**: Movie Watchlist App (Next.js 15 + Bun + TypeScript)

## Executive Summary

This document outlines research findings for implementing a multi-step Movie Discovery Quiz feature. The research covers five critical technical decisions: quiz state management, TMDB API integration, localStorage caching, mood-to-genre mapping, and single-page navigation patterns within Next.js 15 App Router.

---

## 1. Quiz State Management Pattern

### Decision

**Use `useReducer` for managing quiz state** with the following structure:

```typescript
interface QuizState {
  currentStep: number // 0-indexed step (0-4)
  answers: {
    mood: string | null // Step 0: User's movie-watching goal
    decade: string | null // Step 1: Preferred release period
    runtime: string | null // Step 2: Desired movie length
    rating: string | null // Step 3: Minimum rating threshold
    popularity: string | null // Step 4: Hidden gems vs popular
  }
  isComplete: boolean
  canNavigateBack: boolean
}

type QuizAction =
  | { type: 'ANSWER_QUESTION'; step: number; answer: string }
  | { type: 'NAVIGATE_BACK' }
  | { type: 'NAVIGATE_NEXT' }
  | { type: 'RESET_QUIZ' }
  | { type: 'COMPLETE_QUIZ' }
```

### Rationale

1. **Complex State Relationships**: The quiz involves 5 interdependent steps where navigation logic depends on completion status, step position, and answer validation
2. **Predictable State Transitions**: A reducer provides a single source of truth for all state transitions, making backward/forward navigation logic easier to reason about
3. **Backward Navigation Support**: useReducer excels at maintaining state history and handling conditional logic when users navigate back through steps
4. **Testability**: Pure reducer functions are easier to unit test than multiple useState calls with interdependent logic
5. **Industry Best Practice**: For multi-step forms and wizards, useReducer is the recommended pattern in 2024-2025 React best practices

### Alternatives Considered

**useState with multiple state variables**:

- **Rejected because**: Would require 6+ separate useState calls (currentStep, mood, decade, runtime, rating, popularity, isComplete) leading to scattered logic
- **Problem**: Handling backward navigation would require multiple setState calls to keep states synchronized
- **Complexity**: Conditional logic for step validation would be spread across multiple useEffect hooks

**Third-party form library (react-hook-form)**:

- **Rejected because**: Overkill for a 5-question quiz with simple multiple-choice answers
- **Problem**: Adds unnecessary dependencies and complexity for what's essentially a wizard flow
- **Project constraint**: CLAUDE.md emphasizes following existing patterns - the codebase uses simple React state management

### Implementation Notes

1. **Initial State**: All answers start as `null` to distinguish between "not answered" vs "answered with empty value"
2. **Step Validation**: Before `NAVIGATE_NEXT`, validate that `answers[currentStep]` is not null
3. **Persistence**: Serialize/deserialize reducer state when saving to localStorage
4. **Navigation Guards**:
   - Can only navigate back if `currentStep > 0`
   - Can only navigate next if current question is answered
   - Complete button only enabled on final step when all answers provided

**Example Reducer Pattern**:

```typescript
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: {
          ...state.answers,
          [getAnswerKey(action.step)]: action.answer,
        },
      }
    case 'NAVIGATE_BACK':
      return state.currentStep > 0
        ? { ...state, currentStep: state.currentStep - 1 }
        : state
    // ... other cases
  }
}
```

**Sources**:

- [useReducer vs useState: The Battle for Your React State](https://abdulmuhaimintoha.medium.com/usereducer-vs-usestate-the-battle-for-your-react-state-and-when-to-use-which-60c4b8941044)
- [useState vs useReducer | TkDodo's blog](https://tkdodo.eu/blog/use-state-vs-use-reducer)
- [React Forms Battle: useState vs. useReducer vs. react-hook-form](https://medium.com/@emailtophanitham/react-forms-battle-usestate-vs-usereducer-vs-react-hook-form-which-one-should-you-use-38a07ff223c2)
- [Should I useState or useReducer?](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)

---

## 2. TMDB API Integration

### Decision

**Use TMDB's `/discover/movie` endpoint** with the following query parameters:

```typescript
interface DiscoverParams {
  with_genres: string // Comma-separated genre IDs (AND logic)
  'release_date.gte': string // YYYY-MM-DD format
  'release_date.lte': string // YYYY-MM-DD format
  'with_runtime.gte': number // Minutes
  'with_runtime.lte': number // Minutes
  'vote_average.gte': number // 0-10 scale
  sort_by: string // 'popularity.desc' or 'vote_count.desc'
  language: string // 'en-US'
  page: number // Pagination
}
```

**API Endpoint**: `GET https://api.themoviedb.org/3/discover/movie`

### Rationale

1. **Native Filtering Support**: The discover endpoint supports all required filters (genre, date range, runtime range, rating threshold) in a single API call
2. **AND Logic for Strict Matching**: Using comma-separated genre IDs provides strict AND matching (movie must have ALL selected genres)
3. **Efficient Querying**: Single endpoint call vs multiple API requests and client-side filtering
4. **Caching Compatible**: Next.js can cache discover results using `{ next: { revalidate: 3600 } }` similar to existing `/api/movies` route
5. **Consistent Pattern**: Follows existing TMDB integration pattern in `/app/api/movies/route.ts`

### Alternatives Considered

**Using existing `/movie/popular` and `/movie/top_rated` endpoints**:

- **Rejected because**: These endpoints don't support genre, runtime, or date filtering
- **Problem**: Would require fetching large result sets and filtering client-side (inefficient)

**Genre endpoint + multiple API calls**:

- **Rejected because**: Would require separate calls for each filter, then client-side intersection
- **Problem**: Slow, inefficient, and doesn't respect TMDB's rate limits well

**Using pipe-separated genre IDs (OR logic)**:

- **Rejected because**: Spec requires strict matching - movies must match ALL criteria
- **Problem**: OR logic (`|`) would return movies with ANY of the genres, not ALL

### Implementation Notes

1. **Create New API Route**: `/app/api/movies/discover/route.ts` to keep separation of concerns
2. **Query Parameter Mapping**:
   - Mood → Genre IDs (see Section 4)
   - Decade → `release_date.gte` and `release_date.lte`
   - Runtime → `with_runtime.gte` and `with_runtime.lte`
   - Rating → `vote_average.gte`
   - Popularity → `sort_by` parameter
3. **Genre Combination**: Use comma separator for AND logic: `with_genres=28,35` (Action AND Comedy)
4. **Date Format**: Convert decade strings to YYYY-MM-DD format (e.g., "2020s" → `release_date.gte=2020-01-01&release_date.lte=2029-12-31`)
5. **Error Handling**: Handle cases where no movies match all criteria (return empty results vs relaxed criteria)
6. **Caching Strategy**: Use 1-hour cache like existing movies route: `{ next: { revalidate: 3600 } }`

**Example API Route Structure**:

```typescript
// /app/api/movies/discover/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    sort_by: searchParams.get('sort_by') || 'popularity.desc',
    with_genres: searchParams.get('genres') || '',
    'release_date.gte': searchParams.get('date_from') || '',
    'release_date.lte': searchParams.get('date_to') || '',
    'with_runtime.gte': searchParams.get('runtime_min') || '',
    'with_runtime.lte': searchParams.get('runtime_max') || '',
    'vote_average.gte': searchParams.get('rating_min') || '',
  })

  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    next: { revalidate: 3600 },
  })

  return NextResponse.json(await response.json())
}
```

**TMDB Genre AND vs OR Logic**:

- Comma (`,`): AND logic - `with_genres=28,35` = Action AND Comedy
- Pipe (`|`): OR logic - `with_genres=28|35` = Action OR Comedy

**Sources**:

- [Search & Query For Details](https://developer.themoviedb.org/docs/search-and-query-for-details)
- [How do I get movie data through genres - TMDB Talk](https://www.themoviedb.org/talk/635968b34a4bf6007c5997f3)
- [TMDb API - filter by genre id - Stack Overflow](https://stackoverflow.com/questions/65428570/tmdb-api-filter-by-genre-id)
- [Movie - TMDB API Reference](https://developer.themoviedb.org/reference/discover-movie)

---

## 3. LocalStorage Cache Strategy

### Decision

**Implement a time-based expiration cache** with the following structure:

```typescript
interface CacheEntry<T> {
  data: T
  timestamp: number // Date.now() when cached
  expiresAt: number // timestamp + TTL
  version: string // Cache format version for invalidation
}

interface QuizCacheConfig {
  key: 'movie-quiz-results'
  ttl: 3600000 // 1 hour in milliseconds (3600 * 1000)
  maxSize: 50000 // ~50KB in bytes (conservative localStorage limit)
  version: '1.0.0'
}
```

### Rationale

1. **User Experience**: Prevents redundant TMDB API calls if user revisits quiz results within 1 hour
2. **Performance**: Instant results display from cache vs 500-1000ms API round trip
3. **Rate Limit Protection**: Reduces TMDB API usage (protects against rate limiting)
4. **Session Continuity**: Preserves quiz results during tab refresh or accidental navigation
5. **Size Constraint**: 50KB limit ensures we stay well within browser localStorage limits (5-10MB typical)

### Alternatives Considered

**SessionStorage**:

- **Rejected because**: Clears when tab closes, losing quiz results if user closes tab temporarily
- **Use case mismatch**: Quiz results should persist longer than a single browsing session

**IndexedDB**:

- **Rejected because**: Overkill for simple key-value caching of quiz results
- **Complexity**: Requires async API and more complex error handling
- **Project constraint**: Keep implementation simple, follow existing patterns

**No caching**:

- **Rejected because**: Poor UX - forces API call every time user views results
- **Problem**: Wastes API quota and increases latency

**Infinite cache (no expiration)**:

- **Rejected because**: Stale data problem - TMDB data changes (new movies, updated ratings)
- **Problem**: Users might see outdated results from weeks ago

### Implementation Notes

1. **TTL Selection**: 1 hour (3600000ms) balances freshness vs performance
   - Long enough: Prevents redundant calls during quiz session
   - Short enough: Ensures reasonably fresh data
2. **Cache Key Structure**: Use single key `movie-quiz-results` (simple, no need for multiple entries)

3. **Size Management**:
   - **Estimate**: Typical movie object ~500 bytes, 10 movies = ~5KB (well under 50KB limit)
   - **Check**: Calculate `JSON.stringify(data).length` before caching
   - **Fallback**: If size exceeds limit, skip caching but still show results

4. **Error Handling**:

   ```typescript
   function setCache<T>(key: string, data: T): boolean {
     try {
       const entry: CacheEntry<T> = {
         data,
         timestamp: Date.now(),
         expiresAt: Date.now() + CACHE_CONFIG.ttl,
         version: CACHE_CONFIG.version,
       }

       const serialized = JSON.stringify(entry)

       // Size check
       if (serialized.length > CACHE_CONFIG.maxSize) {
         console.warn('Cache entry too large, skipping cache')
         return false
       }

       localStorage.setItem(key, serialized)
       return true
     } catch (error) {
       // Handle QuotaExceededError, SecurityError (private browsing)
       console.error('Failed to cache data:', error)
       return false
     }
   }
   ```

5. **Cache Retrieval**:

   ```typescript
   function getCache<T>(key: string): T | null {
     try {
       const cached = localStorage.getItem(key)
       if (!cached) return null

       const entry: CacheEntry<T> = JSON.parse(cached)

       // Version check
       if (entry.version !== CACHE_CONFIG.version) {
         localStorage.removeItem(key)
         return null
       }

       // Expiration check
       if (Date.now() > entry.expiresAt) {
         localStorage.removeItem(key)
         return null
       }

       return entry.data
     } catch (error) {
       console.error('Failed to retrieve cache:', error)
       return null
     }
   }
   ```

6. **Version-Based Invalidation**: Bump `version` string when cache format changes (e.g., adding new Movie fields)

7. **Privacy Considerations**:
   - Don't cache personally identifiable information (PII)
   - Quiz results are generic movie lists (safe to cache)
   - User can clear via browser settings

8. **Browser Compatibility**:
   - Check `typeof window !== 'undefined'` for SSR safety in Next.js
   - Handle `SecurityError` for private browsing modes where localStorage is disabled

**Sources**:

- [Storage quotas and eviction criteria - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [When do items in HTML5 local storage expire?](https://stackoverflow.com/questions/2326943/when-do-items-in-html5-local-storage-expire)
- [Window: localStorage property - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Understanding Browser Storage APIs: A Guide for Web Developers in 2025](https://blog.rdpcore.com/en/understanding-browser-storage-apis-a-guide-for-web-developers-in-2025)
- [LocalStorage, sessionStorage](https://javascript.info/localstorage)

---

## 4. Mood-to-Genre Mapping

### Decision

**Map quiz moods to TMDB genre IDs** using the following strategy:

```typescript
const MOOD_TO_GENRES: Record<string, number[]> = {
  'action-packed': [28], // Action
  heartwarming: [10749, 18], // Romance + Drama
  'thought-provoking': [18, 878], // Drama + Sci-Fi
  scary: [27, 53], // Horror + Thriller
  funny: [35], // Comedy
  romantic: [10749], // Romance
}
```

**TMDB Genre ID Reference**:

- Action: 28
- Adventure: 12
- Animation: 16
- Comedy: 35
- Crime: 80
- Documentary: 99
- Drama: 18
- Family: 10751
- Fantasy: 14
- History: 36
- Horror: 27
- Music: 10402
- Mystery: 9648
- Romance: 10749
- Science Fiction: 878
- TV Movie: 10770
- Thriller: 53
- War: 10752
- Western: 37

### Rationale

1. **User-Friendly Language**: "Action-packed" is more intuitive than "Action genre"
2. **Mood-Based Discovery**: Aligns with how users actually think about movies ("I want something scary" vs "I want a horror movie")
3. **Multi-Genre Support**: Some moods naturally map to multiple genres (heartwarming = Romance + Drama)
4. **TMDB Compatibility**: Uses official TMDB genre IDs for API integration
5. **Research-Backed**: Mapping based on industry research on mood-to-genre relationships

### Alternatives Considered

**Direct genre selection (dropdown of "Action", "Comedy", etc.)**:

- **Rejected because**: Less user-friendly, requires users to think in industry terms
- **UX problem**: Users don't always map their mood to specific genres accurately

**TMDB keyword API**:

- **Rejected because**: Keywords are less standardized than genres, inconsistent coverage
- **Problem**: Keyword search would return unreliable results vs genre filtering

**Single genre per mood**:

- **Rejected because**: Some moods are inherently multi-genre (heartwarming, thought-provoking)
- **Problem**: Would exclude relevant movies (e.g., romantic drama for "heartwarming")

**AI/ML-based mood detection**:

- **Rejected because**: Overengineering, requires external service or complex model
- **Project constraint**: Keep implementation simple and maintainable

### Implementation Notes

1. **Genre Combination Logic**:
   - For multi-genre moods, use comma separator (AND logic) in TMDB API
   - Example: "heartwarming" → `with_genres=10749,18` (Romance AND Drama)
   - This ensures movies match the mood more accurately

2. **Alternative: OR Logic for Broader Results**:
   - If AND logic returns too few results, consider OR logic: `with_genres=10749|18`
   - Trade-off: More results but less precise matching
   - **Recommendation**: Start with AND, fallback to OR if results < 5 movies

3. **Mood Option Labels**:

   ```typescript
   const MOOD_OPTIONS = [
     { value: 'action-packed', label: 'Action-packed adventure', icon: '💥' },
     { value: 'heartwarming', label: 'Heartwarming story', icon: '❤️' },
     {
       value: 'thought-provoking',
       label: 'Thought-provoking drama',
       icon: '🤔',
     },
     { value: 'scary', label: 'Scary thriller', icon: '😱' },
     { value: 'funny', label: 'Funny comedy', icon: '😂' },
     { value: 'romantic', label: 'Romantic love story', icon: '💕' },
   ]
   ```

4. **Extended Mood Mapping** (Future Enhancement):
   - Could add more nuanced moods: 'epic' (Adventure + Fantasy), 'mysterious' (Mystery + Thriller)
   - Could use TMDB keywords API as secondary filter for more granular matching

5. **Genre Validation**:
   - Validate genre IDs exist in TMDB's official list before querying
   - Handle deprecated or new genres gracefully

**Research Context**:

- **Action-packed** → Action genre: Fast-paced, adventurous, energetic films
- **Heartwarming** → Romance + Drama: Emotionally uplifting, feel-good stories about relationships
- **Thought-provoking** → Drama + Sci-Fi: Films that challenge perspectives, explore complex themes
- **Scary** → Horror + Thriller: Fear-inducing films focusing on danger and the unknown
- **Funny** → Comedy: Light-hearted entertainment designed to make you laugh
- **Romantic** → Romance: Love stories with emotional depth and relationship focus

**Sources**:

- [Which Genre ID # is assigned to each movie category? - TMDB Talk](https://www.themoviedb.org/talk/5daf6eb0ae36680011d7e6ee)
- [Genres - Movie Bible - TMDB](https://www.themoviedb.org/bible/movie/59f3b16d9251414f20000006)
- [Movie Suggestions By Mood & Feeling](https://agoodmovietowatch.com/mood/)
- [The Best Movie Genres to Watch for Every Mood](https://www.dxbnewsnetwork.com/the-best-movie-genres-to-watch-for-every-mood)
- [How to Choose the Perfect Movie Genre for Your Mood](https://www.deerfieldsmall.com/blogs/how-to-choose-the-perfect-movie-genre-for-your-mood)

---

## 5. Single-Page Navigation Pattern

### Decision

**Use component state (useReducer) for quiz navigation without Next.js routing**:

```typescript
// Quiz flow managed entirely in component state
// No URL changes, no route navigation
// Browser back button returns to previous page (Home), not previous quiz step

interface QuizNavigationStrategy {
  pattern: 'Component State Only'
  routing: false
  browserBackBehavior: 'Exit Quiz' // Goes to previous page, not quiz step
  internalNavigation: 'Reducer Actions' // NAVIGATE_BACK, NAVIGATE_NEXT
}
```

### Rationale

1. **Simpler Implementation**: No URL state synchronization, no query parameters to manage
2. **Quiz as Modal/Overlay**: Conceptually the quiz is a temporary interaction, not a route destination
3. **Consistent with Existing Pattern**: The app's `ReviewForm` component uses similar modal pattern (opens on top of page without routing)
4. **State Preservation**: useReducer naturally preserves all quiz state during navigation
5. **No Browser History Pollution**: Doesn't clutter browser history with 5 intermediate quiz steps

### Alternatives Considered

**Next.js App Router with query parameters**:

```typescript
// Pattern: /quiz?step=2&mood=action-packed&decade=2020s
router.push(`/quiz?step=${step}&mood=${mood}...`)
```

- **Rejected because**:
  - Overly complex for a 5-step flow
  - Query params would need constant synchronization with component state
  - Browser back would navigate between quiz steps (confusing UX)
  - Doesn't align with existing app patterns (no other multi-step flows use routing)

**Separate route per quiz step**:

```typescript
// Pattern: /quiz/mood → /quiz/decade → /quiz/runtime → etc.
```

- **Rejected because**:
  - Extreme overengineering (5 route files for a simple quiz)
  - Complex route protection logic (can't access step 3 without completing steps 1-2)
  - Poor UX: Browser back navigates between quiz steps instead of exiting quiz

**Using Next.js `useRouter()` with shallow routing**:

```typescript
router.push('/quiz?step=2', { shallow: true })
```

- **Rejected because**:
  - Still modifies URL and browser history
  - Adds complexity without meaningful benefit
  - Not appropriate for transient UI state like quiz navigation

### Implementation Notes

1. **Quiz Component Structure**:

   ```typescript
   // /app/quiz/page.tsx (or /components/MovieQuiz.tsx)
   'use client'

   export default function MovieQuiz() {
     const [state, dispatch] = useReducer(quizReducer, initialState)

     // No useRouter(), no URL manipulation
     // All navigation via dispatch()

     return (
       <div className="quiz-container">
         {state.currentStep === 0 && <MoodStep />}
         {state.currentStep === 1 && <DecadeStep />}
         {state.currentStep === 2 && <RuntimeStep />}
         {state.currentStep === 3 && <RatingStep />}
         {state.currentStep === 4 && <PopularityStep />}
         {state.isComplete && <ResultsStep />}

         <QuizNavigation
           onBack={() => dispatch({ type: 'NAVIGATE_BACK' })}
           onNext={() => dispatch({ type: 'NAVIGATE_NEXT' })}
           canGoBack={state.currentStep > 0}
           canGoNext={isStepComplete(state)}
         />
       </div>
     )
   }
   ```

2. **Browser Back Button Behavior**:
   - **Default behavior**: User clicks browser back → navigates to previous page (e.g., Home)
   - **No custom handling needed**: Let browser back exit the quiz naturally
   - **Confirmation dialog** (Optional enhancement):
     ```typescript
     useEffect(() => {
       const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         if (!state.isComplete && hasAnswers(state)) {
           e.preventDefault()
           e.returnValue = '' // Shows browser confirmation dialog
         }
       }

       window.addEventListener('beforeunload', handleBeforeUnload)
       return () =>
         window.removeEventListener('beforeunload', handleBeforeUnload)
     }, [state])
     ```

3. **Quiz Exit Handling**:
   - Provide explicit "Exit Quiz" button in UI
   - Option to save quiz state to localStorage for "Continue Later" feature
   - Clear localStorage cache when quiz is completed and submitted

4. **Step Transitions**:
   - Use CSS transitions for smooth step changes
   - Consider slide/fade animations between steps
   - Use ShadCN's animation utilities if available

5. **State Persistence** (Optional):
   - Save quiz state to localStorage on each answer
   - Restore state on component mount if unfinished quiz exists
   - Clear after completion or explicit exit

6. **Accessibility**:
   - Use `aria-live` regions to announce step changes to screen readers
   - Ensure keyboard navigation works for back/next buttons
   - Add step indicator (e.g., "Step 2 of 5") for progress awareness

**Comparison with Existing Patterns**:

- **ReviewForm** (`/components/ReviewForm.tsx`): Modal component with internal state, no routing
- **Quiz**: Similar pattern - temporary UI overlay with internal navigation
- **Consistency**: Both use component state for transient interactions

**Sources**:

- [Getting Started: Linking and Navigating | Next.js](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- [Functions: useRouter | Next.js](https://nextjs.org/docs/pages/api-reference/functions/use-router)
- [useRouter() - App router - Handle back button - Next.js Discussion](https://github.com/vercel/next.js/discussions/58476)
- [A Comprehensive Guide to useRouter() in Next.js 15](https://dev.to/joodi/a-comprehensive-guide-to-userouter-in-nextjs-15-59bg)

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Create quiz state types and reducer
- [ ] Implement mood-to-genre mapping constants
- [ ] Create localStorage cache utilities (set/get/validate)
- [ ] Set up quiz component structure with step routing logic

### Phase 2: API Integration

- [ ] Create `/app/api/movies/discover/route.ts`
- [ ] Implement query parameter transformation (decade → dates, runtime → minutes)
- [ ] Add error handling for no results found
- [ ] Test API route with various filter combinations

### Phase 3: UI Components

- [ ] Build quiz step components (MoodStep, DecadeStep, etc.)
- [ ] Implement navigation buttons with validation
- [ ] Add progress indicator (Step X of 5)
- [ ] Create results display component

### Phase 4: Testing & Polish

- [ ] Test reducer state transitions
- [ ] Test localStorage cache with expiration
- [ ] Test API integration with strict filters
- [ ] Add loading states and error handling
- [ ] Accessibility audit (keyboard nav, screen readers)

---

## Open Questions & Future Enhancements

### Open Questions

1. **Empty Results Handling**: If strict filters return 0 movies, should we:
   - Display "No matches" message with option to relax filters?
   - Automatically fallback to less strict criteria (AND → OR for genres)?
   - Show closest matches with explanation of mismatched criteria?

2. **Cache Invalidation**: Should we invalidate cache when:
   - User starts a new quiz with different answers?
   - TMDB API returns different results for same query (rare)?

3. **Quiz Re-entry**: If user exits quiz mid-way, should we:
   - Auto-restore from localStorage?
   - Show "Continue Quiz" vs "Start New Quiz" options?
   - Clear state on explicit exit?

### Future Enhancements

1. **Advanced Filtering**: Add optional filters like language, certification (PG, R, etc.)
2. **Keyword Integration**: Use TMDB keywords API for more nuanced mood matching
3. **Result Sorting**: Let users re-sort results by popularity, rating, or release date
4. **Save Preferences**: Store user's filter preferences for future quizzes
5. **Social Sharing**: Generate shareable link with quiz results
6. **Analytics**: Track popular mood combinations and filter usage

---

## Technical Constraints

### Project Constraints (from CLAUDE.md)

- **Framework**: Next.js 15 (App Router only)
- **Runtime**: Bun (not Node.js)
- **TypeScript**: Strict mode enabled
- **UI Library**: ShadCN UI components (New York style)
- **Icons**: Lucide React
- **State Management**: React hooks (no Zustand, Redux, etc.)
- **API Pattern**: Next.js API routes in `/app/api/`
- **Testing**: Vitest with AAA pattern

### TMDB API Constraints

- **Rate Limiting**: 40 requests per 10 seconds (shared across app)
- **Cache Recommended**: 1-hour cache for discover results
- **Genre Limit**: Maximum ~19 genres, but practical limit is 3-4 for meaningful results
- **Date Format**: YYYY-MM-DD required for release_date parameters

### Browser Constraints

- **localStorage**: 5-10MB limit (10MB max in most browsers)
- **Storage Format**: UTF-16 encoding (affects size calculation)
- **Private Browsing**: localStorage may be disabled (SecurityError)
- **SSR Considerations**: Check `typeof window !== 'undefined'` before using localStorage

---

## Conclusion

This research establishes a solid technical foundation for implementing the Movie Discovery Quiz feature. Key decisions prioritize:

1. **Maintainability**: useReducer provides clear state management for multi-step flow
2. **Performance**: localStorage caching + TMDB discover endpoint optimization
3. **User Experience**: Mood-based language + single-page flow without URL complexity
4. **Consistency**: Follows existing project patterns (component state, API routes, ShadCN UI)

All decisions align with Next.js 15 App Router best practices, React 18 patterns, and the project's technical constraints outlined in CLAUDE.md.
