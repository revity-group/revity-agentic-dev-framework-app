'use client'

/**
 * QuizQuestion Component
 *
 * Displays a quiz question with its options
 * Supports both multi-select and single-select question types
 */

import { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { Card } from '@/components/ui/card'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedAnswer: any
  onAnswerChange: (answer: any) => void
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
}: QuizQuestionProps) {
  const isMultiSelect = question.type === 'multi-select'

  // Handle option click
  const handleOptionClick = (optionValue: any) => {
    if (isMultiSelect) {
      // Multi-select: toggle selection
      const currentSelections = Array.isArray(selectedAnswer)
        ? selectedAnswer
        : []

      // For mood options with array values, we need to handle them specially
      if (Array.isArray(optionValue)) {
        // Check if all values in the array are already selected
        const allSelected = optionValue.every((val) =>
          currentSelections.includes(val)
        )

        if (allSelected) {
          // Deselect all values in the array
          const newSelections = currentSelections.filter(
            (val) => !optionValue.includes(val)
          )
          onAnswerChange(newSelections)
        } else {
          // Select all values in the array (remove duplicates)
          const newSelections = [
            ...new Set([...currentSelections, ...optionValue]),
          ]
          onAnswerChange(newSelections)
        }
      } else {
        // Single value - toggle it
        if (currentSelections.includes(optionValue)) {
          // Deselect
          onAnswerChange(
            currentSelections.filter((v: any) => v !== optionValue)
          )
        } else {
          // Select
          onAnswerChange([...currentSelections, optionValue])
        }
      }
    } else {
      // Single-select: replace selection
      onAnswerChange(optionValue)
    }
  }

  // Check if an option is selected
  const isOptionSelected = (optionValue: any): boolean => {
    if (isMultiSelect) {
      const selections = Array.isArray(selectedAnswer) ? selectedAnswer : []

      if (Array.isArray(optionValue)) {
        // For array values, check if all values are selected
        return optionValue.every((val) => selections.includes(val))
      }

      return selections.includes(optionValue)
    } else {
      // Single-select: compare values
      if (
        typeof optionValue === 'object' &&
        typeof selectedAnswer === 'object'
      ) {
        return JSON.stringify(optionValue) === JSON.stringify(selectedAnswer)
      }
      return optionValue === selectedAnswer
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {question.text}
        </h2>
        {isMultiSelect && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select all that apply
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {question.options.map((option) => {
          const isSelected = isOptionSelected(option.value)

          // Get icon component if specified
          const IconComponent = option.icon ? (Icons as any)[option.icon] : null

          return (
            <Card
              key={option.id}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                'p-6 text-center',
                isSelected
                  ? 'border-2 border-primary bg-primary/10'
                  : 'border-2 border-transparent hover:border-gray-300'
              )}
              onClick={() => handleOptionClick(option.value)}
            >
              {IconComponent && (
                <IconComponent
                  className={cn(
                    'mx-auto mb-2 h-8 w-8',
                    isSelected
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                />
              )}
              <p
                className={cn(
                  'font-medium',
                  isSelected
                    ? 'text-primary'
                    : 'text-gray-900 dark:text-gray-100'
                )}
              >
                {option.label}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
