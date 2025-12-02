'use client'

/**
 * QuizContainer Component
 *
 * Main quiz orchestrator managing state with useReducer
 * Handles quiz flow, API calls, and results display
 */

import { useReducer, useEffect } from 'react'
import { QuizState, QuizAction, QuizSelections } from '@/types/quiz'
import { QuizQuestion } from './QuizQuestion'
import { ResultsDisplay } from './ResultsDisplay'
import { ProgressIndicator } from './ProgressIndicator'
import { QuizNavigation } from './QuizNavigation'
import { QUIZ_QUESTIONS } from '@/lib/quiz/constants'
import { hasSelection, isQuizComplete } from '@/lib/quiz/validation'
import { getCache, setCache, clearCache } from '@/lib/quiz/cache'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Initial state
const initialState: QuizState = {
  currentStep: 1,
  selections: {},
  isComplete: false,
  isLoading: false,
  error: null,
  recommendations: [],
  totalMatches: 0,
}

// Reducer function
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER_QUESTION': {
      const { step, answer } = action.payload
      const newSelections = { ...state.selections }

      // Map step to selection field
      if (step === 1) newSelections.genres = answer
      else if (step === 2) newSelections.moods = answer
      else if (step === 3) newSelections.era = answer
      else if (step === 4) newSelections.runtime = answer
      else if (step === 5) newSelections.rating = answer

      return {
        ...state,
        selections: newSelections,
      }
    }

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 5),
      }

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload.recommendations,
        totalMatches: action.payload.totalMatches,
        isComplete: true,
        isLoading: false,
        error: null,
      }

    case 'LOAD_CACHED_RESULTS':
      return {
        ...state,
        selections: action.payload.selections,
        recommendations: action.payload.recommendations,
        totalMatches: action.payload.totalMatches,
        isComplete: true,
        currentStep: 5,
      }

    case 'RESET_QUIZ':
      clearCache()
      return initialState

    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isComplete: true,
      }

    default:
      return state
  }
}

interface QuizContainerProps {
  onExit: () => void
}

export function QuizContainer({ onExit }: QuizContainerProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  // Load cached results on mount
  useEffect(() => {
    const cached = getCache()
    if (cached) {
      dispatch({
        type: 'LOAD_CACHED_RESULTS',
        payload: cached,
      })
    }
  }, [])

  // Get current question
  const currentQuestion = QUIZ_QUESTIONS[state.currentStep - 1]

  // Get current answer
  const getCurrentAnswer = () => {
    if (state.currentStep === 1) return state.selections.genres
    if (state.currentStep === 2) return state.selections.moods
    if (state.currentStep === 3) return state.selections.era
    if (state.currentStep === 4) return state.selections.runtime
    if (state.currentStep === 5) return state.selections.rating
    return null
  }

  // Handle answer change
  const handleAnswerChange = (answer: any) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { step: state.currentStep, answer },
    })
  }

  // Handle next button
  const handleNext = async () => {
    const currentAnswer = getCurrentAnswer()

    // Validate current answer
    if (!hasSelection(currentAnswer)) {
      return // Cannot proceed without selection
    }

    // If on last question, submit quiz
    if (state.currentStep === 5) {
      await submitQuiz()
    } else {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  // Submit quiz and fetch recommendations
  const submitQuiz = async () => {
    if (!isQuizComplete(state.selections)) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Please answer all questions',
      })
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await fetch('/api/quiz/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.selections),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch recommendations')
      }

      const data = await response.json()

      // Save to cache
      if (data.recommendations.length > 0) {
        setCache(
          state.selections as QuizSelections,
          data.recommendations,
          data.totalMatches
        )
      }

      dispatch({
        type: 'SET_RECOMMENDATIONS',
        payload: {
          recommendations: data.recommendations,
          totalMatches: data.totalMatches,
        },
      })
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Unable to fetch recommendations. Please try again later.',
      })
    }
  }

  // Handle retake quiz
  const handleRetake = () => {
    dispatch({ type: 'RESET_QUIZ' })
  }

  // Show results if complete
  if (state.isComplete) {
    return (
      <ResultsDisplay
        recommendations={state.recommendations}
        totalMatches={state.totalMatches}
        onRetake={handleRetake}
        onExit={onExit}
      />
    )
  }

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Finding your perfect movies...
        </p>
      </div>
    )
  }

  // Show error state
  if (state.error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Error
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {state.error}
          </p>
        </div>
        <Button onClick={handleRetake}>Try Again</Button>
      </div>
    )
  }

  // Show quiz question
  const currentAnswer = getCurrentAnswer()
  const canProceed = hasSelection(currentAnswer)

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <ProgressIndicator currentStep={state.currentStep} totalSteps={5} />

      {/* Current question */}
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
      />

      {/* Navigation buttons */}
      <QuizNavigation
        currentStep={state.currentStep}
        totalSteps={5}
        canProceed={canProceed}
        onBack={
          state.currentStep > 1
            ? () => dispatch({ type: 'PREV_STEP' })
            : undefined
        }
        onNext={handleNext}
        isLastStep={state.currentStep === 5}
      />
    </div>
  )
}
