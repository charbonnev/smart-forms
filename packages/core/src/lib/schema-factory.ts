import { z } from 'zod'

/**
 * Tipos de campo disponíveis na Schema Factory
 */
export type FieldType = 
  | 'text'
  | 'email'
  | 'number'
  | 'currency'
  | 'cep'
  | 'uf'
  | 'boolean'
  | 'array'
  | 'date'
  | 'phone'
  | 'cnpj'
  | 'cpf'

/**
 * Configuração de um campo para a Schema Factory
 */
export interface FieldConfig {
  type: FieldType
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
  options?: string[] // para selects
  defaultValue?: any
}

/**
 * Configuração completa do schema
 */
export type SchemaConfig = Record<string, FieldConfig>

/**
 * Mensagens de erro padrão
 */
const DEFAULT_MESSAGES = {
  required: 'Campo obrigatório',
  email: 'Email inválido',
  number: 'Deve ser um número',
  positive: 'Deve ser positivo',
  min: (min: number) => `Mínimo ${min}`,
  max: (max: number) => `Máximo ${max}`,
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  cep: 'CEP inválido',
  uf: 'UF deve ter 2 caracteres',
  phone: 'Telefone inválido',
  cnpj: 'CNPJ inválido',
  cpf: 'CPF inválido',
  currency: 'Valor deve ser positivo',
  arrayMin: (min: number) => `Adicione pelo menos ${min} item(ns)`,
  date: 'Data inválida',
} as const

/**
 * Cria um validador Zod baseado no tipo do campo
 */
function createFieldValidator(fieldName: string, config: FieldConfig) {
  if (!config) {
    throw new Error(`Config for field ${fieldName} is null or undefined`)
  }
  
  const { type, required = false, message, ...rules } = config
  let validator: z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodArray<any> | z.ZodEffects<any> | z.ZodDefault<any> | z.ZodOptional<any>

  // Define o tipo base
  switch (type) {
    case 'text':
      validator = z.string()
      if (rules.minLength) {
        validator = (validator as z.ZodString).min(rules.minLength, message || DEFAULT_MESSAGES.minLength(rules.minLength))
      }
      if (rules.maxLength) {
        validator = (validator as z.ZodString).max(rules.maxLength, message || DEFAULT_MESSAGES.maxLength(rules.maxLength))
      }
      if (rules.pattern) {
        validator = (validator as z.ZodString).regex(rules.pattern, message || DEFAULT_MESSAGES.required)
      }
      break

    case 'email':
      validator = z.string().email(message || DEFAULT_MESSAGES.email)
      break

    case 'number':
      validator = z.number()
      if (rules.min !== undefined) {
        validator = (validator as z.ZodNumber).min(rules.min, message || DEFAULT_MESSAGES.min(rules.min))
      }
      if (rules.max !== undefined) {
        validator = (validator as z.ZodNumber).max(rules.max, message || DEFAULT_MESSAGES.max(rules.max))
      }
      break

    case 'currency':
      validator = z.number().min(0, message || DEFAULT_MESSAGES.currency)
      break

    case 'cep':
      validator = z.string().regex(/^\d{5}-?\d{3}$/, message || DEFAULT_MESSAGES.cep)
      break

    case 'uf':
      validator = z.string().length(2, message || DEFAULT_MESSAGES.uf)
      break

    case 'boolean':
      validator = z.boolean().default(rules.defaultValue || false)
      break

    case 'array':
      validator = z.array(z.string())
      if (rules.min) {
        validator = (validator as z.ZodArray<any>).min(rules.min, message || DEFAULT_MESSAGES.arrayMin(rules.min))
      }
      break

    case 'date':
      validator = z.string().datetime(message || DEFAULT_MESSAGES.date)
      break

    case 'phone':
      validator = z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, message || DEFAULT_MESSAGES.phone)
      break

    case 'cnpj':
      validator = z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, message || DEFAULT_MESSAGES.cnpj)
      break

    case 'cpf':
      validator = z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message || DEFAULT_MESSAGES.cpf)
      break

    default:
      validator = z.string()
  }

  // Adiciona validação required se necessário
  if (required && type !== 'boolean') {
    if (type === 'number' || type === 'currency') {
      // Para números, undefined não é permitido se required
      validator = (validator as z.ZodNumber).refine((val) => val !== undefined && val !== null, {
        message: message || DEFAULT_MESSAGES.required,
      })
    } else if (type === 'text') {
      // Para strings
      validator = (validator as z.ZodString).min(1, message || DEFAULT_MESSAGES.required)
    } else if (type === 'array') {
      // Para arrays
      validator = (validator as z.ZodArray<any>).min(1, message || DEFAULT_MESSAGES.required)
    }
  } else if (!required && type !== 'boolean') {
    validator = (validator as any).optional()
  }

  return validator
}

/**
 * Schema Factory - Cria schemas Zod dinamicamente
 */
export function createSchema<T extends SchemaConfig>(config: T) {
  const schema: Record<string, z.ZodTypeAny> = {}

  Object.entries(config).forEach(([fieldName, fieldConfig]) => {
    // Pular propriedades internas do Zod
    if (fieldName.startsWith('_') || typeof fieldConfig === 'function') {
      return
    }
    
    schema[fieldName] = createFieldValidator(fieldName, fieldConfig)
  })

  return z.object(schema)
}

/**
 * Extende um schema existente
 */
export function extendSchema<T extends SchemaConfig>(
  baseSchema: z.ZodObject<any>,
  additionalFields: T
) {
  const additionalSchema = createSchema(additionalFields)
  return baseSchema.merge(additionalSchema)
}

/**
 * Schema base para entidades comuns
 */
export const BASE_SCHEMAS = {
  /**
   * Schema base para endereço
   */
  address: createSchema({
    cep: { type: 'cep', required: true },
    logradouro: { type: 'text', required: true, minLength: 1 },
    numero: { type: 'text', required: true, minLength: 1 },
    municipio: { type: 'text', required: true, minLength: 1 },
    uf: { type: 'uf', required: true },
    complemento: { type: 'text', required: false },
  }),

  /**
   * Schema base para contato
   */
  contact: createSchema({
    nome: { type: 'text', required: true, minLength: 1 },
    email: { type: 'email', required: true },
    telefone: { type: 'phone', required: false },
  }),

  /**
   * Schema base para documentos
   */
  documents: createSchema({
    cpf: { type: 'cpf', required: false },
    cnpj: { type: 'cnpj', required: false },
    rg: { type: 'text', required: false },
  }),
} as const
