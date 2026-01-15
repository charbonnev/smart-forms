# Getting Started with Smart Forms

Smart Forms é uma biblioteca de componentes e hooks para facilitar a criação de formulários em React com validação.

## Instalação

```bash
# Para o pacote core (agnóstico de UI)
npm install @much/smart-forms-core

# Para o adapter Shadcn/UI
npm install @much/smart-forms-shadcn
```

## Dependências Necessárias

```bash
# Peer dependencies
npm install react react-hook-form zod
```

## Uso Básico

### 1. Schema Factory

Crie schemas de validação de forma declarativa:

```typescript
import { createSchema } from '@much/smart-forms-core'

const userSchema = createSchema({
  name: { type: 'text', required: true, minLength: 2 },
  email: { type: 'email', required: true },
  age: { type: 'number', required: true, min: 18 },
  active: { type: 'boolean', required: false }
})
```

### 2. Formulário Simples

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput, SmartCheckbox } from '@much/smart-forms-shadcn'

function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 0,
      active: false
    }
  })

  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <SmartInput form={form} name="name" label="Nome" />
      <SmartInput form={form} name="email" label="Email" type="email" />
      <SmartInput form={form} name="age" label="Idade" type="number" />
      <SmartCheckbox form={form} name="active" label="Ativo" />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

### 3. Formulário Multi-Etapas

```tsx
import { useStepForm } from '@much/smart-forms-shadcn'

function MultiStepForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    canAccessStep,
    isStepCompleted
  } = useStepForm(form, 3, [
    ['name', 'email'],
    ['address', 'city'],
    ['phone', 'notes']
  ])

  // Renderize os campos da etapa atual...
}
```

## Componentes Disponíveis

### Core (Agnóstico de UI)

- `SmartFormContainer` - Container para formulários
- `SmartStepIndicator` - Indicador de etapas
- `useStepForm` - Hook para formulários multi-etapas
- `useSmartInput` - Hook para manipulação de inputs
- `createSchema` - Factory para criar schemas Zod
- `extendSchema` - Extender schemas existentes

### Adapter Shadcn/UI

- `SmartInput` - Campo de texto com validações
- `SmartCurrencyInput` - Campo monetário
- `SmartSelect` - Campo de seleção
- `SmartCheckbox` - Checkbox

## Tipos de Campo Suportados

- `text` - Texto simples
- `email` - Email com validação
- `number` - Números inteiros
- `currency` - Valores monetários
- `cep` - CEP brasileiro
- `uf` - UF brasileira
- `boolean` - Verdadeiro/Falso
- `date` - Datas
- `phone` - Telefones
- `cnpj`/`cpf` - Documentos brasileiros

## Configuração de Campos

```typescript
{
  type: 'text',
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern: /^[A-Za-z]+$/,
  message: 'Campo inválido',
  defaultValue: ''
}
```

## Próximos Passos

- Veja os exemplos na pasta `/examples`
- Consulte a API Reference para detalhes
- Contribua com novos adapters de UI
