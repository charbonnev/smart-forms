import { SmartSelect as CoreSmartSelect } from '@charbonnev/smart-forms-core'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

interface SmartSelectProps<T extends Record<string, any>> {
  form: any
  name: any
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  description?: string
}

export function SmartSelect<T extends Record<string, any>>(props: SmartSelectProps<T>) {
  return (
    <CoreSmartSelect
      {...props}
      components={{
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage
      }}
    />
  )
}
