// Componentes wrappers do Shadcn
export { SmartInput } from './components/smart-input'
export { SmartCurrencyInput } from './components/smart-currency-input'
export { SmartSelect } from './components/smart-select'
export { SmartCheckbox } from './components/smart-checkbox'

// Import direto do core (sem re-export)
import * as Core from '@charbonnev/smart-forms-core'

// Export manual dos componentes do core
export const SmartFormContainer = Core.SmartFormContainer
export const SmartStepIndicator = Core.SmartStepIndicator
export const useStepForm = Core.useStepForm
export const useSmartInput = Core.useSmartInput
export const createSchema = Core.createSchema
export const extendSchema = Core.extendSchema
export const BASE_SCHEMAS = Core.BASE_SCHEMAS

// Export dos tipos
export type FieldType = Core.FieldType
export type FieldConfig = Core.FieldConfig
export type SchemaConfig = Core.SchemaConfig
