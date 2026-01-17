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
 * Implementação com segment-based lines para alinhamento perfeito
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
    <nav className={cn('w-full', className)} aria-label="Progress steps">
      <ol 
        className="w-full"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
          gap: '0'
        }}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const canAccess = canAccessStep ? canAccessStep(step) : true
          const isLast = index === totalSteps - 1

          return (
            <li 
              key={step}
              className="relative flex flex-col items-center"
            >
              {/* Linha de conexão para o próximo step - só se não for o último */}
              {!isLast && (
                <div 
                  className="absolute top-5 left-1/2 right-0 h-0.5 -translate-x-0"
                  style={{ 
                    left: '50%',
                    right: '0%',
                    width: '100%'
                  }}
                  aria-hidden="true"
                >
                  {/* Linha de fundo (cinza) */}
                  <div className="absolute inset-0 bg-gray-200" />
                  
                  {/* Linha de progresso (azul) - preenchida se step anterior foi completado */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-blue-500 transition-all duration-300" />
                  )}
                </div>
              )}
              
              {/* Bolinha do step */}
              <button
                type="button"
                onClick={() => canAccess && onStepClick && onStepClick(step)}
                disabled={!canAccess && step > currentStep}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-all flex-shrink-0',
                  isActive && 'border-blue-500 bg-blue-500 text-white ring-4 ring-blue-100',
                  isCompleted && 'border-blue-500 bg-blue-500 text-white',
                  !isActive && !isCompleted && canAccess && 'border-gray-300 bg-white text-gray-500 hover:border-blue-300 cursor-pointer',
                  !isActive && !isCompleted && !canAccess && 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
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
              
              {/* Label do step */}
              <span className={cn(
                'mt-2 text-sm text-center whitespace-nowrap max-w-[120px] truncate px-2',
                isActive && 'text-blue-600 font-medium',
                !isActive && 'text-gray-600'
              )}>
                {stepTitles[index]}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
