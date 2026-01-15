import { SmartInput as CoreSmartInput } from '@charbonnev/smart-forms-core'
import { Input } from './ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'

interface SmartInputProps<T extends Record<string, any>> {
  form: any
  name: any
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'currency' | 'cep' | 'uf'
  disabled?: boolean
  className?: string
  maxLength?: number
  required?: boolean
  description?: string
  onCepChange?: (value: string) => void
}

export function SmartInput<T extends Record<string, any>>(props: SmartInputProps<T>) {
  return (
    <CoreSmartInput
      {...props}
      components={{
        Input,
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage
      }}
    />
  )
}
