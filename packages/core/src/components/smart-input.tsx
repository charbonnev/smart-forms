import React from 'react'
import { UseFormReturn, Path } from 'react-hook-form'
import { useSmartInput } from '../hooks/use-smart-input'

// Interface para componentes de formulário (serão injetados pelo adapter)
export interface FormComponents {
  FormField: any
  FormItem: any
  FormLabel: any
  FormControl: any
  FormMessage: any
  Input: any
}

interface SmartInputProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'currency' | 'cep' | 'uf'
  disabled?: boolean
  className?: string
  maxLength?: number
  required?: boolean
  description?: string
  onCepChange?: (value: string) => void
  components?: FormComponents
}

/**
 * Componente de input inteligente com clearErrors automático
 * Reduz drasticamente a repetição de código
 */
export function SmartInput<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  maxLength,
  required = false,
  description,
  onCepChange,
  components,
}: SmartInputProps<T>) {
  if (!components) {
    throw new Error('components prop is required. Use the adapter package for pre-configured components.')
  }

  const {
    handleInputChange,
    handleNumberChange,
    handleCurrencyChange,
    handleCepChange,
    handleUfChange,
  } = useSmartInput(form, name, onCepChange)

  const { FormField, FormItem, FormLabel, FormControl, FormMessage, Input } = components

  // Define o placeholder baseado no tipo
  const getDefaultPlaceholder = () => {
    switch (type) {
      case 'number':
        return '0'
      case 'currency':
        return '0,00'
      case 'cep':
        return '00000-000'
      case 'uf':
        return 'SP'
      default:
        return ''
    }
  }

  // Define classes CSS baseado no tipo
  const getTypeClasses = () => {
    const baseClasses = 'h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500'
    
    switch (type) {
      case 'currency':
      case 'number':
        return `${baseClasses} text-right`
      case 'uf':
        return `${baseClasses} uppercase`
      default:
        return baseClasses
    }
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder || getDefaultPlaceholder()}
              disabled={disabled}
              className={`${getTypeClasses()} ${className}`}
              maxLength={maxLength}
              onChange={(e) => {
                if (type === 'number') {
                  handleNumberChange(e.target.value)
                } else if (type === 'currency') {
                  handleCurrencyChange(e.target.value)
                } else if (type === 'cep') {
                  handleCepChange(e.target.value)
                } else if (type === 'uf') {
                  handleUfChange(e.target.value)
                } else {
                  handleInputChange(e)
                }
              }}
              type={type === 'currency' || type === 'number' ? 'text' : type}
            />
          </FormControl>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
