# API Reference

## Core Package

### createSchema

Cria um schema Zod dinamicamente a partir de configurações.

```typescript
function createSchema(config: SchemaConfig): z.ZodObject
```

**Parâmetros:**
- `config` - Objeto com configurações dos campos

**Retorno:**
- `z.ZodObject` - Schema Zod validado

**Exemplo:**
```typescript
const schema = createSchema({
  name: { type: 'text', required: true },
  email: { type: 'email', required: true }
})
```

### extendSchema

Estende um schema existente com novos campos.

```typescript
function extendSchema(baseSchema: z.ZodObject, extension: SchemaConfig): z.ZodObject
```

### useStepForm

Hook para gerenciar formulários multi-etapas.

```typescript
function useStepForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  totalSteps: number,
  fieldsByStep: string[][]
): StepFormReturn
```

**Retorno:**
```typescript
{
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  canAccessStep: (step: number) => boolean
  isStepCompleted: (step: number) => boolean
}
```

### useSmartInput

Hook para manipulação de inputs com validação automática.

```typescript
function useSmartInput<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: Path<T>
): SmartInputReturn
```

**Retorno:**
```typescript
{
  handleChange: (value: any) => void
  clearErrors: () => void
}
```

### Componentes Core

#### SmartFormContainer

Container para formulários com layout padrão.

```tsx
<SmartFormContainer 
  title="Título do Formulário"
  subtitle="Descrição opcional"
  maxWidth="2xl"
>
  {/* Conteúdo do formulário */}
</SmartFormContainer>
```

**Props:**
- `title?: string` - Título do formulário
- `subtitle?: string` - Subtítulo
- `maxWidth?: string` - Largura máxima
- `children: ReactNode` - Conteúdo

#### SmartStepIndicator

Indicador visual de progresso para formulários multi-etapas.

```tsx
<SmartStepIndicator
  currentStep={currentStep}
  totalSteps={totalSteps}
  onStepClick={goToStep}
  labels={['Etapa 1', 'Etapa 2', 'Etapa 3']}
/>
```

**Props:**
- `currentStep: number` - Etapa atual
- `totalSteps: number` - Total de etapas
- `onStepClick?: (step: number) => void` - Callback de clique
- `labels?: string[]` - Labels das etapas

## Shadcn Adapter

### SmartInput

Campo de texto inteligente com validações.

```tsx
<SmartInput
  form={form}
  name="fieldName"
  label="Label do campo"
  type="text"
  placeholder="Placeholder..."
  required
  maxLength={50}
/>
```

**Props:**
- `form: UseFormReturn` - Instância do react-hook-form
- `name: Path<T>` - Nome do campo
- `label: string` - Label do campo
- `type?: FieldType` - Tipo do campo
- `placeholder?: string` - Placeholder
- `required?: boolean` - Obrigatório
- `disabled?: boolean` - Desabilitado
- `maxLength?: number` - Tamanho máximo

### SmartCurrencyInput

Campo para valores monetários.

```tsx
<SmartCurrencyInput
  form={form}
  name="price"
  label="Preço"
  placeholder="R$ 0,00"
/>
```

### SmartSelect

Campo de seleção.

```tsx
<SmartSelect
  form={form}
  name="category"
  label="Categoria"
  options={[
    { value: 'cat1', label: 'Categoria 1' },
    { value: 'cat2', label: 'Categoria 2' }
  ]}
/>
```

### SmartCheckbox

Checkbox com label e descrição.

```tsx
<SmartCheckbox
  form={form}
  name="active"
  label="Ativo"
  description="Marque se o item estiver ativo"
/>
```

## Tipos

### FieldType

```typescript
type FieldType = 
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
```

### FieldConfig

```typescript
interface FieldConfig {
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
```

### SchemaConfig

```typescript
type SchemaConfig = Record<string, FieldConfig>
```

## Constantes

### BASE_SCHEMAS

Schemas pré-definidos para uso comum.

```typescript
BASE_SCHEMAS = {
  address: {
    cep: { type: 'cep', required: true },
    logradouro: { type: 'text', required: true },
    numero: { type: 'text', required: true },
    // ...
  },
  personal: {
    nome: { type: 'text', required: true },
    email: { type: 'email', required: true },
    // ...
  }
}
```
