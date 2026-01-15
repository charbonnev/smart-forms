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
      <div className="flex items-start justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const canAccess = canAccessStep ? canAccessStep(step) : true

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full justify-center mb-2">
                  {step > 1 && (
                    <div
                      className={cn(
                        'flex-1 h-1',
                        step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => onStepClick && onStepClick(step)}
                    disabled={!canAccess && step > currentStep}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors flex-shrink-0',
                      isActive
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isCompleted
                        ? 'border-blue-500 bg-blue-500 text-white'
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
                        'flex-1 h-1',
                        step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    'text-sm text-center px-2',
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                  )}
                >
                  {stepTitles[index]}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
