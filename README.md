# Smart Forms

Uma biblioteca de componentes e hooks para facilitar a criação de formulários em React com validação.

## 📦 Estrutura

Este é um monorepo que contém:

- **packages/core** - Componentes e hooks agnósticos de UI
- **packages/adapters/shadcn** - Adapter para componentes Shadcn/UI
- **examples** - Exemplos de uso

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Build dos pacotes
npm run build

# Executar em modo dev
npm run dev
```

## Instalação em Projetos

```bash
# Core package (agnóstico de UI)
npm install @much/smart-forms-core

# Adapter para Shadcn/UI
npm install @much/smart-forms-shadcn

# Dependências necessárias
npm install react react-hook-form zod
```

## Exemplo Rápido

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

## 📚 Documentação

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Migration Guide](./docs/migration-guide.md)

## 🎯 Features

- ✅ Schema Factory para validação declarativa
- ✅ Formulários multi-etapas com `useStepForm`
- ✅ Componentes inteligentes com validação automática
- ✅ Suporte a diversos tipos de campo (texto, email, moeda, CEP, etc.)
- ✅ Adaptadores para diferentes UI libraries
- ✅ TypeScript ready
- ✅ Zero dependências de UI no core

## 🔧 Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Build de todos os pacotes
pnpm build

# Executar testes
pnpm test

# Executar em modo dev
pnpm dev
```

## 📄 Licença

MIT
