import { SmartCheckbox as CoreSmartCheckbox } from '@charbonnev/smart-forms-core'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

interface SmartCheckboxProps<T extends Record<string, any>> {
  form: any
  name: any
  label: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function SmartCheckbox<T extends Record<string, any>>(props: SmartCheckboxProps<T>) {
  return (
    <CoreSmartCheckbox
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
