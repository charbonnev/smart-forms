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

interface SmartCheckboxProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: string
  components?: FormComponents
}

/**
 * Componente de checkbox inteligente com clearErrors automático
 */
export function SmartCheckbox<T extends Record<string, any>>({
  form,
  name,
  label,
  description,
  disabled = false,
  required = false,
  className = '',
  components,
}: SmartCheckboxProps<T>) {
  if (!components) {
    throw new Error('components prop is required. Use the adapter package for pre-configured components.')
  }

  const { handleChange } = useSmartInput(form, name)
  const { FormField, FormItem, FormLabel, FormControl, FormMessage } = components

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          <div className={cn(
            'flex items-center space-x-3 space-y-0 rounded-lg border border-slate-200 p-4',
            'bg-slate-50 transition-colors duration-200',
            'hover:bg-slate-100 hover:border-slate-300',
            field.value && 'bg-blue-50 border-blue-200',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-100'
          )}>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value || false}
                onChange={(e) => {
                  field.onChange(e.target.checked)
                  handleChange(e.target.checked)
                }}
                disabled={disabled}
                className={cn(
                  'w-5 h-5 text-blue-600 rounded border-slate-300',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-all duration-200'
                )}
              />
            </FormControl>
            <div className="flex-1">
              <FormLabel className={cn(
                'text-sm font-medium text-slate-900 cursor-pointer',
                'transition-colors duration-200',
                field.value && 'text-blue-900'
              )}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              {description && (
                <p className="text-xs text-slate-600 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}

// Helper function for className
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
