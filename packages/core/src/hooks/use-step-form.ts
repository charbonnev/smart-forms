import { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Hook personalizado para gerenciar formulários com etapas
 * Centraliza a lógica de navegação e validação
 */
export const useStepForm = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  totalSteps: number,
  fieldsByStep: string[][]
) => {
  const [currentStep, setCurrentStep] = useState(1)

  // Avançar para próxima etapa
  const nextStep = useCallback(async () => {
    const fieldsToValidate = fieldsByStep[currentStep - 1] || []
    const isValid = await form.trigger(fieldsToValidate as any)
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
    
    return isValid
  }, [form, currentStep, totalSteps, fieldsByStep])

  // Voltar para etapa anterior
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // Ir para etapa específica
  const goToStep = useCallback(async (stepNumber: number) => {
    // Se clicar na etapa atual, não faz nada
    if (stepNumber === currentStep) return

    // Se for uma etapa anterior, pode voltar livremente
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber)
      return true
    }

    // Se for uma etapa posterior, valida as etapas anteriores
    let isValid = true
    for (let i = 1; i < stepNumber; i++) {
      const fields = fieldsByStep[i - 1] || []
      const stepValid = await form.trigger(fields as any)
      if (!stepValid) {
        isValid = false
        // Se houver erro na validação, vai para a primeira etapa com erro
        setCurrentStep(i)
        return false
      }
    }

    // Se tudo estiver válido, vai para a etapa desejada
    if (isValid) {
      setCurrentStep(stepNumber)
    }
    
    return isValid
  }, [form, currentStep, fieldsByStep])

  // Verificar se etapa pode ser acessada
  const canAccessStep = useCallback((stepNumber: number) => {
    // Pode sempre voltar
    if (stepNumber < currentStep) return true
    
    // Pode avançar apenas para a próxima
    if (stepNumber === currentStep + 1) return true
    
    // Demais etapas não podem ser acessadas diretamente
    return false
  }, [currentStep])

  // Verificar se etapa foi completada
  const isStepCompleted = useCallback((stepNumber: number) => {
    if (stepNumber >= currentStep) return false
    
    const fields = fieldsByStep[stepNumber - 1] || []
    const stepValues = fields.map(field => form.getValues(field as any))
    
    // Verifica se todos os campos da etapa têm valor
    return stepValues.every(value => {
      if (typeof value === 'string') return value.length > 0
      if (typeof value === 'number') return value >= 0
      return value !== undefined && value !== null
    })
  }, [form, currentStep, fieldsByStep])

  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    canAccessStep,
    isStepCompleted,
  }
}
