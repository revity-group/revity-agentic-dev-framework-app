# Tasks: Movie Discovery Quiz

**Input**: Design documents from `/specs/002-movie-discovery-quiz/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/quiz-api.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify TMDB API key is configured in `/Users/poborin/prj/revity-agentic-dev-framework-app/.env.local`
- [x] T002 Verify ShadCN UI components are available in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/ui/`
- [x] T003 [P] Install any missing dependencies (if needed) using `bun install`

**Checkpoint**: Environment ready for quiz feature development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create TypeScript type definitions in `/Users/poborin/prj/revity-agentic-dev-framework-app/types/quiz.ts` (QuizQuestion, QuizOption, QuizSelections, QuizSession, MatchCriteria, MovieRecommendation, SavedResult)
- [x] T005 [P] Create genre ID mapping constant (GENRE_MAP) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/constants.ts`
- [x] T006 [P] Create mood-to-genre mapping constant (MOOD_TO_GENRE) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/constants.ts`
- [x] T007 [P] Create quiz questions configuration (QUIZ_QUESTIONS array) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/constants.ts`
- [x] T008 [P] Implement cache utilities (setCache, getCache, clearCache) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/cache.ts` with 30-day expiration and version validation
- [x] T009 [P] Implement validation utilities (validateSelections) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/validation.ts`
- [x] T010 [P] Implement matching algorithm (matchMovies, generateMatchCriteria, generateMatchExplanation) in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/matching.ts` with strict AND logic

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Quiz and View Recommendations (Priority: P1) 🎯 MVP

**Goal**: Deliver core quiz functionality - users can answer 5 questions and receive personalized movie recommendations

**Independent Test**: Launch quiz, answer all 5 questions, verify recommendations appear with match explanations

### Implementation for User Story 1

- [x] T011 [US1] Create API route `/Users/poborin/prj/revity-agentic-dev-framework-app/app/api/quiz/recommendations/route.ts` that accepts POST with QuizSelections and returns MovieRecommendation[] by calling TMDB discover endpoint
- [x] T012 [US1] Implement TMDB discover query building in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/api/quiz/recommendations/route.ts` (map genres, moods, era, runtime, rating to TMDB parameters)
- [x] T013 [US1] Add error handling in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/api/quiz/recommendations/route.ts` for TMDB API failures (return 500 with friendly message)
- [x] T014 [US1] Add validation in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/api/quiz/recommendations/route.ts` for missing required selections (return 400)
- [x] T015 [US1] Implement response caching with 1-hour revalidation in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/api/quiz/recommendations/route.ts`
- [x] T016 [P] [US1] Create QuizQuestion component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizQuestion.tsx` with client directive for multi-select and single-select question types
- [x] T017 [P] [US1] Create ResultsDisplay component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/ResultsDisplay.tsx` with client directive showing movie cards with match explanations and match criteria tags
- [x] T018 [US1] Create quiz reducer (quizReducer) in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` with actions: ANSWER_QUESTION, NEXT_STEP, COMPLETE_QUIZ, RESET_QUIZ
- [x] T019 [US1] Create QuizContainer component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` with client directive managing quiz state using useReducer
- [x] T020 [US1] Implement question rendering logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` to display current question based on currentStep
- [x] T021 [US1] Implement "Next" button logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` with validation (requires at least 1 selection)
- [x] T022 [US1] Implement quiz completion logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` to call API route and display results
- [x] T023 [US1] Add loading state ("Finding your perfect movies...") in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` while fetching recommendations
- [x] T024 [US1] Add error display in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` for API failures with friendly message
- [x] T025 [US1] Add "No matches" message display in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` when 0 recommendations returned
- [x] T026 [US1] Add "Exit" button in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/ResultsDisplay.tsx` to return to main page
- [x] T027 [US1] Add "Find My Movie" button to main page in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/page.tsx` that launches QuizContainer component
- [x] T028 [US1] Implement single-page flow in `/Users/poborin/prj/revity-agentic-dev-framework-app/app/page.tsx` where quiz replaces main page content (no routing)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can complete quiz and view recommendations

---

## Phase 4: User Story 2 - Interactive Question Selection and Progress Tracking (Priority: P2)

**Goal**: Enhanced UX with progress indicators, multi-select support, deselection, and backward navigation

**Independent Test**: Progress through quiz verifying progress indicator updates, multi-select works, deselection works, and back button preserves selections

### Implementation for User Story 2

- [x] T029 [P] [US2] Create ProgressIndicator component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/ProgressIndicator.tsx` displaying "Question [N] of 5"
- [x] T030 [P] [US2] Create QuizNavigation component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizNavigation.tsx` with client directive for Back/Next buttons
- [x] T031 [US2] Add ProgressIndicator to `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` displaying current step
- [x] T032 [US2] Implement multi-select toggle logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizQuestion.tsx` for genres and moods (click to select, click again to deselect)
- [x] T033 [US2] Add visual selection state (active/inactive styles) in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizQuestion.tsx` using Tailwind classes
- [x] T034 [US2] Add PREV_STEP action to quizReducer in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx`
- [x] T035 [US2] Add QuizNavigation component to `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` with back button (only shown on steps 2-5)
- [x] T036 [US2] Implement backward navigation logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` preserving existing selections
- [x] T037 [US2] Add validation to prevent advancing with no selections in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - enhanced UX features are functional

---

## Phase 5: User Story 3 - Save and Revisit Results (Priority: P3)

**Goal**: Cache quiz results to localStorage for automatic retrieval on return visits

**Independent Test**: Complete quiz, close/reopen application, verify saved results automatically load from cache

### Implementation for User Story 3

- [x] T038 [US3] Add cache save call in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` after receiving recommendations (save to localStorage)
- [x] T039 [US3] Add cache load logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` on component mount (check for valid cached results)
- [x] T040 [US3] Implement auto-load behavior in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` to display cached results if available and valid
- [x] T041 [US3] Add cache expiration handling in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` (ignore cache if >30 days old or version mismatch)
- [x] T042 [US3] Add error handling in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` for localStorage quota exceeded (fallback to no-cache mode)

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional - results persist across sessions

---

## Phase 6: User Story 4 - Retake Quiz with Different Preferences (Priority: P3)

**Goal**: Allow users to retake quiz with fresh selections

**Independent Test**: Complete quiz, click "Retake Quiz", verify quiz restarts at question 1 with no previous selections

### Implementation for User Story 4

- [x] T043 [US4] Add "Retake Quiz" button to ResultsDisplay component in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/ResultsDisplay.tsx`
- [x] T044 [US4] Implement RESET_QUIZ action logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` to clear all selections and return to step 1
- [x] T045 [US4] Add cache clear call in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/QuizContainer.tsx` when retaking quiz (remove saved results)
- [x] T046 [US4] Wire "Retake Quiz" button in `/Users/poborin/prj/revity-agentic-dev-framework-app/components/quiz/ResultsDisplay.tsx` to dispatch RESET_QUIZ action

**Checkpoint**: All user stories should now be independently functional - retake functionality works

---

## Phase 7: Polish & Testing

**Purpose**: Testing (after implementation complete per constitution) and final improvements

### Unit Tests (Testing-Last per Constitution)

- [x] T047 [P] Unit test for strict AND matching logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/matching.test.ts` (verify movies match ALL criteria)
- [x] T048 [P] Unit test for genre intersection in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/matching.test.ts` (verify movie has ALL selected genres)
- [x] T049 [P] Unit test for date range filtering in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/matching.test.ts` (verify era matching)
- [x] T050 [P] Unit test for runtime range filtering in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/matching.test.ts` (verify runtime matching)
- [x] T051 [P] Unit test for rating threshold in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/matching.test.ts` (verify minimum rating)
- [x] T052 [P] Unit test for cache save/load in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/cache.test.ts` (verify data persistence)
- [x] T053 [P] Unit test for cache expiration in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/cache.test.ts` (verify >30 days invalidation)
- [x] T054 [P] Unit test for cache version validation in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/cache.test.ts` (verify version mismatch invalidation)
- [x] T055 [P] Unit test for QuotaExceededError handling in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/cache.test.ts` (verify graceful fallback)
- [x] T056 [P] Unit test for validation logic in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/__tests__/validation.test.ts` (verify selection validation)

### Code Quality

- [x] T057 Run `bun lint` and fix all ESLint errors
- [x] T058 Run `bun format` to ensure consistent code formatting
- [ ] T059 [P] Add JSDoc comments to complex functions in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/matching.ts`
- [ ] T060 [P] Add JSDoc comments to cache utilities in `/Users/poborin/prj/revity-agentic-dev-framework-app/lib/quiz/cache.ts`
- [ ] T061 [P] Verify all images have alt text in quiz components
- [ ] T062 [P] Verify keyboard navigation works for all quiz buttons
- [ ] T063 [P] Verify WCAG AA color contrast in quiz components

### Documentation & Validation

- [ ] T064 Test User Story 1 independently: Complete quiz and view recommendations
- [ ] T065 Test User Story 2 independently: Verify progress tracking and backward navigation
- [ ] T066 Test User Story 3 independently: Verify cache persistence across sessions
- [ ] T067 Test User Story 4 independently: Verify retake functionality
- [ ] T068 Run validation steps from `/Users/poborin/prj/revity-agentic-dev-framework-app/specs/002-movie-discovery-quiz/quickstart.md`
- [ ] T069 Test edge case: No matching movies (verify friendly message appears)
- [ ] T070 Test edge case: TMDB API failure (verify error message appears)
- [ ] T071 Test edge case: Partial results (1-4 movies, verify they display correctly)
- [ ] T072 Remove all console.log statements from production code

**Final Checkpoint**: All user stories independently functional, all tests passing, code quality standards met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - MVP deliverable
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - Can run in parallel with US1 if staffed
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion - Can run in parallel with US1/US2 if staffed
- **User Story 4 (Phase 6)**: Depends on Foundational phase completion - Can run in parallel with US1/US2/US3 if staffed
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - fully independent (MVP)
- **User Story 2 (P2)**: Enhances US1 but is independently testable - adds UX features
- **User Story 3 (P3)**: Adds caching to US1 but is independently testable - adds persistence
- **User Story 4 (P3)**: Adds retake to US1 but is independently testable - adds re-engagement

### Entity/Component Ownership by Story

- **Types (Foundational)**: Used by all stories
- **Constants (Foundational)**: Used by all stories
- **Cache utilities (Foundational)**: Used by US3 primarily
- **Matching utilities (Foundational)**: Used by US1 primarily
- **Validation utilities (Foundational)**: Used by US1, US2
- **API route (US1)**: Core recommendation engine
- **QuizContainer (US1)**: Core quiz orchestration
- **QuizQuestion (US1)**: Core question display
- **ResultsDisplay (US1)**: Core results display
- **ProgressIndicator (US2)**: Progress tracking
- **QuizNavigation (US2)**: Backward navigation
- **Cache integration (US3)**: Persistence layer
- **Retake functionality (US4)**: Re-engagement

### Within Each User Story

- API routes before component integration
- Components before state management
- State management before navigation logic
- Core functionality before error handling
- Story complete before moving to next priority

### Parallel Opportunities

#### Phase 1 (Setup)

All tasks marked [P] can run in parallel

#### Phase 2 (Foundational)

- T005, T006, T007 (constants) can run in parallel
- T008, T009, T010 (utilities) can run in parallel after T004 (types)

#### Phase 3 (User Story 1)

- T016 (QuizQuestion) and T017 (ResultsDisplay) can run in parallel
- T011-T015 (API route) can run in parallel with T016-T017 (components)

#### Phase 4 (User Story 2)

- T029 (ProgressIndicator) and T030 (QuizNavigation) can run in parallel

#### Phase 7 (Testing)

- All unit tests (T047-T056) can run in parallel
- All code quality checks (T061-T063) can run in parallel

#### Cross-Story Parallelization

Once Foundational phase (Phase 2) completes, User Stories 1, 2, 3, and 4 can ALL be worked on in parallel by different team members:

- Developer A: User Story 1 (T011-T028)
- Developer B: User Story 2 (T029-T037)
- Developer C: User Story 3 (T038-T042)
- Developer D: User Story 4 (T043-T046)

---

## Parallel Example: User Story 1

```bash
# Launch API route and components together:
Task: "Create API route /app/api/quiz/recommendations/route.ts"
Task: "Create QuizQuestion component in components/quiz/QuizQuestion.tsx"
Task: "Create ResultsDisplay component in components/quiz/ResultsDisplay.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T010) - CRITICAL
3. Complete Phase 3: User Story 1 (T011-T028)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo MVP if ready

**MVP Scope**: Users can answer 5 questions and receive personalized movie recommendations with match explanations. This is the minimum viable product.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Enhanced UX)
4. Add User Story 3 → Test independently → Deploy/Demo (Persistence)
5. Add User Story 4 → Test independently → Deploy/Demo (Re-engagement)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With 4 developers:

1. Team completes Setup (Phase 1) + Foundational (Phase 2) together
2. Once Foundational is done:
   - Developer A: User Story 1 (Priority P1) - MVP
   - Developer B: User Story 2 (Priority P2) - UX enhancements
   - Developer C: User Story 3 (Priority P3) - Caching
   - Developer D: User Story 4 (Priority P3) - Retake
3. Stories complete and integrate independently
4. Team reconvenes for Phase 7 (Polish & Testing)

### Single Developer Strategy

1. Complete Setup + Foundational (T001-T010)
2. User Story 1 first (T011-T028) - MVP
3. Validate MVP works independently
4. User Story 2 next (T029-T037) - UX improvements
5. User Story 3 next (T038-T042) - Persistence
6. User Story 4 last (T043-T046) - Retake
7. Polish & Testing (T047-T072)

---

## Success Metrics (from spec.md)

### Per User Story

**User Story 1 (MVP)**:

- Users can complete quiz in <3 minutes
- Recommendations appear within 5 seconds
- At least 80% of quiz completions return 5+ suggestions

**User Story 2 (UX)**:

- 90% of users who start quiz complete all 5 questions
- Users can navigate backward without losing selections

**User Story 3 (Persistence)**:

- Saved results persist for at least 30 days
- Auto-load works when returning to app

**User Story 4 (Re-engagement)**:

- Users can successfully restart quiz in one click

---

## Notes

- **[P] tasks** = different files, no dependencies - can run in parallel
- **[Story] label** = maps task to specific user story for traceability
- Each user story should be **independently completable and testable**
- **Testing-Last**: All tests (T047-T056) written AFTER implementation complete (per constitution)
- **No integration tests, no e2e tests** (per constitution - unit tests only)
- Verify tests pass before moving to next phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **MVP = User Story 1 only** - delivers core value
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
