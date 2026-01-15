# @much/smart-forms-shadcn

Adapter Shadcn/UI para Smart Forms - componentes React prontos para uso com Shadcn/UI.

## Instalação

```bash
npm install @much/smart-forms-shadcn @much/smart-forms-core react-hook-form zod
```

## Componentes

- `SmartInput` - Campo de texto com validação
- `SmartCurrencyInput` - Campo monetário
- `SmartSelect` - Campo de seleção
- `SmartCheckbox` - Checkbox com validação
- `SmartFormContainer` - Container para formulários
- `SmartStepIndicator` - Indicador de progresso

## Uso Básico

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput, SmartCheckbox, createSchema } from '@much/smart-forms-shadcn'

const schema = createSchema({
  name: { type: 'text', required: true },
  email: { type: 'email', required: true },
  active: { type: 'boolean' }
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <SmartInput form={form} name="name" label="Nome" />
      <SmartInput form={form} name="email" label="Email" type="email" />
      <SmartCheckbox form={form} name="active" label="Ativo" />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Formulário Multi-Etapas

```tsx
import { useStepForm } from '@much/smart-forms-shadcn'

const { currentStep, nextStep, prevStep } = useStepForm(form, 3, [
  ['name', 'email'],
  ['address', 'city'],
  ['phone', 'notes']
])
```

## Requisitos

Este adapter requer que seu projeto tenha Shadcn/UI configurado com os seguintes componentes:
- Form
- Input
- Label
- Select (opcional)
- Checkbox (opcional)

## Documentação Completa

Visite o [repositório principal](https://github.com/much/smart-forms) para:
- Getting Started guide
- API Reference completa
- Exemplos avançados
- Migration guide

## Licença

MIT
