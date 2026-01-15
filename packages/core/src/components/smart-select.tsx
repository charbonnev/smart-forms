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
}

interface SmartSelectProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  description?: string
  components?: FormComponents
}

/**
 * Componente select inteligente com clearErrors automático
 */
export function SmartSelect<T extends Record<string, any>>({
  form,
  name,
  label,
  options,
  placeholder,
  disabled = false,
  className = '',
  required = false,
  description,
  components,
}: SmartSelectProps<T>) {
  if (!components) {
    throw new Error('components prop is required. Use the adapter package for pre-configured components.')
  }

  const { handleSelectChange } = useSmartInput(form, name)
  const { FormField, FormItem, FormLabel, FormControl, FormMessage } = components

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
            <select
              {...field}
              disabled={disabled}
              className={`flex h-12 w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 ${className}`}
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              {placeholder && (
                <option value="">{placeholder}</option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
