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
  CurrencyInput: any
}

interface SmartCurrencyInputProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  description?: string
  components?: FormComponents
}

/**
 * Componente de input de moeda inteligente
 * Com formatação automática e clearErrors
 */
export function SmartCurrencyInput<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder = '0,00',
  disabled = false,
  className = '',
  required = false,
  description,
  components,
}: SmartCurrencyInputProps<T>) {
  if (!components) {
    throw new Error('components prop is required. Use the adapter package for pre-configured components.')
  }

  const { handleCurrencyChange } = useSmartInput(form, name)
  const { FormField, FormItem, FormLabel, FormControl, FormMessage, CurrencyInput } = components

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
            <CurrencyInput
              value={field.value || undefined}
              onChange={(value) => {
                // Se apagar tudo, seta como undefined para falhar na validação
                const numValue = (typeof value === 'string' && value === '') || value === 0 ? undefined : value
                field.onChange(numValue)
                form.clearErrors(name)
              }}
              placeholder={placeholder}
              disabled={disabled}
              className={`h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-right ${className}`}
              prefix="R$ "
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
