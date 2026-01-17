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
  // Calcular porcentagem de progresso
  const progressPercentage = totalSteps > 1 
    ? ((currentStep - 1) / (totalSteps - 1)) * 100 
    : 0

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full">
        {/* Container das linhas - padding de 20px = metade da largura da bolinha (w-10) */}
        <div className="absolute top-5 left-[20px] right-[20px] h-1">
          {/* Linha de fundo */}
          <div className="absolute inset-0 bg-gray-200" />
          
          {/* Linha de progresso */}
          <div 
            className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Bolinhas e labels - sem flex-1, alinhamento natural */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const step = index + 1
            const isActive = step === currentStep
            const isCompleted = step < currentStep
            const canAccess = canAccessStep ? canAccessStep(step) : true

            return (
              <div key={step} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick && onStepClick(step)}
                  disabled={!canAccess && step > currentStep}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors flex-shrink-0 z-10',
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
                
                <span className={cn(
                  'mt-2 text-sm text-center px-2',
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                )}>
                  {stepTitles[index]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
