/**
 * ProgressIndicator Component
 *
 * Displays current question progress (e.g., "Question 3 of 5")
 */

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps?: number
}

export function ProgressIndicator({
  currentStep,
  totalSteps = 5,
}: ProgressIndicatorProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Question {currentStep} of {totalSteps}
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
