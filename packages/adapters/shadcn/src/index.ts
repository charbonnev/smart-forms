// Componentes wrappers do Shadcn
export { SmartInput } from './components/smart-input'
export { SmartCurrencyInput } from './components/smart-currency-input'
export { SmartSelect } from './components/smart-select'
export { SmartCheckbox } from './components/smart-checkbox'

// Exportar componentes do core que não dependem de UI
export { 
  SmartFormContainer, 
  SmartStepIndicator,
  useStepForm,
  useSmartInput,
  createSchema,
  extendSchema,
  BASE_SCHEMAS,
  type FieldType,
  type FieldConfig,
  type SchemaConfig
} from '@much/smart-forms-core'
