import { SmartCurrencyInput as CoreSmartCurrencyInput } from '@charbonnev/smart-forms-core'
import { CurrencyInput } from './ui/currency-input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'

interface SmartCurrencyInputProps<T extends Record<string, any>> {
  form: any
  name: any
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  description?: string
}

export function SmartCurrencyInput<T extends Record<string, any>>(props: SmartCurrencyInputProps<T>) {
  return (
    <CoreSmartCurrencyInput
      {...props}
      components={{
        CurrencyInput,
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage
      }}
    />
  )
}
