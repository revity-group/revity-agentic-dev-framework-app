'use client'

/**
 * QuizNavigation Component
 *
 * Provides Back/Next navigation buttons for the quiz
 */

import { Button } from '@/components/ui/button'

interface QuizNavigationProps {
  currentStep: number
  totalSteps?: number
  canProceed: boolean
  onBack?: () => void
  onNext: () => void
  isLastStep?: boolean
}

export function QuizNavigation({
  currentStep,
  totalSteps: _totalSteps = 5,
  canProceed,
  onBack,
  onNext,
  isLastStep = false,
}: QuizNavigationProps) {
  const showBackButton = currentStep > 1 && onBack

  return (
    <div className="flex justify-center gap-4">
      {showBackButton && (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      )}
      <Button onClick={onNext} disabled={!canProceed}>
        {isLastStep ? 'Get Recommendations' : 'Next'}
      </Button>
    </div>
  )
}
