import React from 'react'

// Helper function for className
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface SmartFormContainerProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

/**
 * Container inteligente para formulários com o visual padrão
 * Aplica gradientes, sombras e layout responsivo
 */
export function SmartFormContainer({
  children,
  title,
  subtitle,
  className,
  maxWidth = '2xl',
}: SmartFormContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className={cn('mx-auto', maxWidthClass, className)}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h1 className="text-4xl font-semibold text-slate-900 mb-3">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-slate-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6">
          {children}
        </div>
      </div>
    </div>
  )
}

interface SmartFormCardProps {
  children: React.ReactNode
  className?: string
}

/**
 * Card interno para formulários com padding e bordas padrão
 */
export function SmartFormCard({ children, className }: SmartFormCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6',
      className
    )}>
      {children}
    </div>
  )
}

interface SmartStepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  onStepClick?: (step: number) => void
  canAccessStep?: (step: number) => boolean
  className?: string
}

/**
 * Indicador de etapas com visual padrão
 */
export function SmartStepIndicator({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick,
  canAccessStep = () => true,
  className,
}: SmartStepIndicatorProps) {
  return (
    <div className={cn('mb-12 flex justify-center', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].filter(step => step <= totalSteps).map((step) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(step)}
                disabled={!canAccessStep(step)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300 ease-in-out
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
                    : canAccessStep(step)
                      ? 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                  ${canAccessStep(step) ? 'transform hover:scale-110' : ''}
                `}
              >
                {currentStep > step ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : step}
              </button>
              <span className={`
                text-xs mt-2 font-medium transition-colors duration-300 whitespace-nowrap
                ${currentStep >= step 
                  ? 'text-blue-600' 
                  : canAccessStep(step)
                    ? 'text-slate-500 hover:text-slate-600'
                    : 'text-slate-400'
                }
              `}>
                {stepTitles[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`
                h-0.5 w-24 mx-4 transition-all duration-300
                ${currentStep > step ? 'bg-blue-600' : 'bg-slate-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
