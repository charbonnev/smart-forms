import { useCallback } from 'react'
import { UseFormReturn, Path, PathValue } from 'react-hook-form'

/**
 * Hook personalizado para gerenciar inputs inteligentes
 * Centraliza a lógica de onChange e clearErrors
 */
export function useSmartInput<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
  onCepChange?: (value: string) => void
) {
  // Handle change com clearErrors automático
  const handleChange = useCallback(
    (value: any) => {
      form.setValue(fieldName as any, value)
      form.clearErrors(fieldName)
    },
    [form, fieldName]
  )

  // Handle change para inputs controlados (event)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      handleChange(value)
    },
    [handleChange]
  )

  // Handle change para selects
  const handleSelectChange = useCallback(
    (value: string) => {
      handleChange(value)
    },
    [handleChange]
  )

  // Handle change para campos numéricos
  const handleNumberChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value) || 0
      handleChange(numValue)
    },
    [handleChange]
  )

  // Handle change para moeda
  const handleCurrencyChange = useCallback(
    (value: string) => {
      // Remove formatação e converte para número
      const cleanValue = value.replace(/\D/g, '')
      const numValue = parseInt(cleanValue) || 0
      handleChange(numValue)
    },
    [handleChange]
  )

  // Handle change para CEP
  const handleCepChange = useCallback(
    (value: string) => {
      // Formata CEP automaticamente para exibição
      const cleanValue = value.replace(/\D/g, '')
      let formattedValue = cleanValue
      
      if (cleanValue.length > 5) {
        formattedValue = cleanValue.slice(0, 5) + '-' + cleanValue.slice(5, 8)
      }
      
      // Salva o valor formatado no input, mas o valor limpo no form
      form.setValue(fieldName as any, formattedValue as any)
      form.clearErrors(fieldName)
      
      // Chama callback personalizada se existir
      if (onCepChange) {
        onCepChange(formattedValue)
      }
    },
    [form, fieldName, onCepChange]
  )

  // Handle change para UF (maiúsculas)
  const handleUfChange = useCallback(
    (value: string) => {
      handleChange(value.toUpperCase())
    },
    [handleChange]
  )

  return {
    handleChange,
    handleInputChange,
    handleSelectChange,
    handleNumberChange,
    handleCurrencyChange,
    handleCepChange,
    handleUfChange,
  }
}
