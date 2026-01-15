import React from 'react'

// Helper function for className
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export interface SmartStepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  canAccessStep?: (step: number) => boolean
  onStepClick?: (step: number) => void
  className?: string
}

/**
 * Indicador visual de steps para formulários multi-etapas
 */
export function SmartStepIndicator({
  currentStep,
  totalSteps,
  stepTitles,
  canAccessStep,
  onStepClick,
  className,
}: SmartStepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const canAccess = canAccessStep ? canAccessStep(step) : true

          return (
            <div key={step} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(step)}
                disabled={!canAccess && step > currentStep}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : canAccess
                    ? 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 cursor-pointer'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  step
                )}
              </button>
              {step < totalSteps && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2',
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={cn(
              'flex-1 text-center',
              index + 1 === currentStep ? 'text-blue-600 font-medium' : ''
            )}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  )
}
