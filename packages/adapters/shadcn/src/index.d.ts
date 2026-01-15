import React from 'react'

// Componentes wrappers do Shadcn
export declare function SmartInput<T extends Record<string, any>>(props: any): React.ReactElement
export declare function SmartCurrencyInput<T extends Record<string, any>>(props: any): React.ReactElement
export declare function SmartSelect<T extends Record<string, any>>(props: any): React.ReactElement
export declare function SmartCheckbox<T extends Record<string, any>>(props: any): React.ReactElement

// Export manual dos tipos do core
export declare const SmartFormContainer: any
export declare const SmartStepIndicator: any
export declare const useStepForm: any
export declare const useSmartInput: any
export declare const createSchema: any
export declare const extendSchema: any
export declare const BASE_SCHEMAS: any

export type FieldType = 'text' | 'email' | 'number' | 'currency' | 'cep' | 'uf' | 'boolean' | 'array' | 'date' | 'phone' | 'cnpj' | 'cpf'
export interface FieldConfig {
  type: FieldType
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
  options?: string[]
  defaultValue?: any
}
export type SchemaConfig = Record<string, FieldConfig>
