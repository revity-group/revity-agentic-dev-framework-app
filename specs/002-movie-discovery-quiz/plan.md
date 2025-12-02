# Implementation Plan: Movie Discovery Quiz

**Branch**: `002-movie-discovery-quiz` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-movie-discovery-quiz/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an interactive 5-question quiz that helps users discover personalized movie recommendations by answering questions about genres, movie-watching goals (mood), era, runtime, and rating preferences. The quiz uses single-page flow navigation, strict AND matching logic for recommendations, supports backward navigation with preserved selections, and caches results locally for automatic retrieval on return visits.

## Technical Context

**Language/Version**: TypeScript 5.6.3 with strict mode  
**Primary Dependencies**: Next.js 15 (App Router), React 18, Tailwind CSS, ShadCN UI (Radix UI), Lucide React  
**Storage**: Local cache (browser localStorage) for quiz results, JSON files for any server-side data  
**Testing**: Vitest (testing-last approach per constitution)  
**Target Platform**: Web (Next.js SSR/Client Components)  
**Project Type**: Web application (frontend + API routes)  
**Runtime**: Bun  
**Performance Goals**: Quiz completion in <3 minutes, recommendations appear within 5 seconds  
**Constraints**: <5 second response time for recommendations, 90% quiz completion rate  
**Scale/Scope**: Single-user experience, 5 questions, 5-10 movie results, 30-day cache retention

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**✅ I. Component-First Architecture**: Quiz will be built with modular components (QuizQuestion, ProgressIndicator, MovieCard, etc.) with clear props interfaces. Components live in `/components` directory.

**✅ II. Type Safety**: All code uses TypeScript strict mode. Types defined in `/types/quiz.ts` for QuizSession, QuizQuestion, MovieRecommendation, SavedResult.

**✅ III. API-First Design**: Movie recommendations fetched through `/app/api/quiz/recommendations` route. No direct external API calls from client components. API route handles TMDB integration and error handling.

**✅ IV. Progressive Enhancement**: Quiz uses client components (`'use client'`) for interactivity (form selections, navigation). Results display can use server components where possible.

**✅ V. Testing-Last with Unit Focus**: Unit tests written after implementation for quiz logic (matching algorithm, cache utilities, validation functions). Tests in `__tests__/` directories co-located with source.

**Gate Status**: ✅ PASSED - No constitution violations. All principles align with feature requirements.

**Post-Phase 1 Re-check**: ✅ PASSED

- Component-First: Confirmed with modular quiz components (QuizContainer, QuizQuestion, ProgressIndicator, QuizNavigation, ResultsDisplay)
- Type Safety: All types defined in `/types/quiz.ts` with strict mode enabled
- API-First: Recommendation logic in `/app/api/quiz/recommendations/route.ts`
- Progressive Enhancement: Client components only for interactivity (quiz selections, navigation)
- Testing-Last: Unit tests planned for matching.ts, cache.ts, validation.ts after implementation

## Project Structure

### Documentation (this feature)

```text
specs/002-movie-discovery-quiz/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── quiz-api.yaml    # OpenAPI spec for quiz endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (Next.js App Router)
app/
├── api/
│   └── quiz/
│       └── recommendations/
│           └── route.ts              # Quiz recommendation endpoint
├── quiz/
│   └── page.tsx                       # Quiz page (single-page flow)
├── layout.tsx                         # Root layout
├── page.tsx                           # Main page with "Find My Movie" button
└── globals.css                        # Global styles

components/
├── ui/                                # ShadCN UI components (existing)
├── quiz/
│   ├── QuizContainer.tsx             # Main quiz orchestrator (client component)
│   ├── QuizQuestion.tsx              # Question display with options (client component)
│   ├── ProgressIndicator.tsx         # Progress display (1 of 5)
│   ├── QuizNavigation.tsx            # Back/Next buttons (client component)
│   └── ResultsDisplay.tsx            # Results page with movie cards (client component)
├── MovieCard.tsx                      # Existing movie card component (reuse)
└── ReviewForm.tsx                     # Existing (not modified)

lib/
├── utils.ts                           # Existing (cn helper)
└── quiz/
    ├── matching.ts                    # Strict AND matching algorithm
    ├── cache.ts                       # LocalStorage cache utilities
    └── validation.ts                  # Quiz answer validation

types/
├── movie.ts                           # Existing movie types
└── quiz.ts                            # Quiz-specific types (new)

__tests__/
└── quiz/
    ├── matching.test.ts              # Unit tests for matching logic
    ├── cache.test.ts                 # Unit tests for cache utilities
    └── validation.test.ts            # Unit tests for validation

data/                                  # Existing (not modified for this feature)
```

**Structure Decision**: Using Next.js App Router web application structure. Quiz lives in `/app/quiz` route with dedicated API endpoint at `/app/api/quiz/recommendations`. Components are modular and live in `/components/quiz` subdirectory following Component-First Architecture principle. Client components used only where interactivity required (quiz questions, navigation).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - table not needed.
