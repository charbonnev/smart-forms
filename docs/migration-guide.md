# Guia de Migração

Este guia ajuda a migrar projetos existentes para usar o Smart Forms monorepo.

## Do CRM BKM para Monorepo

### 1. Dependências

Remova os arquivos locais:
```bash
rm -rf lib/schema-factory.ts
rm -rf hooks/use-step-form.ts
rm -rf hooks/use-smart-input.ts
rm -rf components/ui/smart-*.tsx
```

Adicione as dependências do monorepo:
```bash
npm install @much/smart-forms-core @much/smart-forms-shadcn
```

### 2. Atualizar Imports

**Antes:**
```typescript
import { createSchema } from '@/lib/schema-factory'
import { useStepForm } from '@/hooks/use-step-form'
import { SmartInput } from '@/components/ui/smart-input'
```

**Depois:**
```typescript
import { createSchema, useStepForm, SmartInput } from '@much/smart-forms-shadcn'
```

### 3. Mudanças na API

#### Schema Factory
- Sem mudanças na API
- Mesma sintaxe de configuração

#### useStepForm
- Sem mudanças na API
- Mesma assinatura e retorno

#### Componentes
- `SmartInput` agora aceita `FormComponents` como prop (interno)
- Interface pública permanece a mesma

## Criando Novos Adapters

### Estrutura do Adapter

```typescript
// packages/adapters/[ui-library]/src/components/smart-input.tsx
import { SmartInput as CoreSmartInput } from '@much/smart-forms-core'
import { Input } from '[ui-library]/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '[ui-library]/form'

export function SmartInput(props) {
  return (
    <CoreSmartInput
      {...props}
      components={{
        Input,
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage
      }}
    />
  )
}
```

### Passos para Criar Adapter

1. Criar estrutura: `packages/adapters/[nome]`
2. Configurar `package.json` com dependência do core
3. Criar wrappers para cada componente
4. Exportar componentes do core junto com wrappers
5. Configurar build com `tsup`

## Boas Práticas

### 1. Versionamento

- Use semantic versioning
- Core: breaking changes incrementam major
- Adapters: seguem versão do core

### 2. Dependências

- Core: apenas peer dependencies
- Adapters: dependencies do core + da UI library

### 3. Types

- Exporte tipos do core no adapter
- Mantenha compatibilidade com TypeScript

## Exemplo Completo de Migração

### Arquivo Original
```typescript
// components/user-form.tsx
import { useForm } from 'react-hook-form'
import { createSchema } from '@/lib/schema-factory'
import { useStepForm } from '@/hooks/use-step-form'
import { SmartInput } from '@/components/ui/smart-input'

const schema = createSchema({
  name: { type: 'text', required: true }
})

export function UserForm() {
  // ...
}
```

### Arquivo Migrado
```typescript
// components/user-form.tsx
import { useForm } from 'react-hook-form'
import { createSchema, useStepForm, SmartInput } from '@much/smart-forms-shadcn'

const schema = createSchema({
  name: { type: 'text', required: true }
})

export function UserForm() {
  // ...
}
```

## Troubleshooting

### Erro: Module not found
- Verifique se as dependências estão instaladas
- Confirme o nome do pacote no package.json

### Erro: TypeScript não encontra tipos
- Verifique se o arquivo `.d.ts` está sendo gerado
- Confirme a configuração do `tsconfig.json`

### Build falhando
- Verifique se todas as peer dependencies estão instaladas
- Confirme a configuração do `tsup` ou webpack

## Suporte

- Abra uma issue no repositório
- Consulte os exemplos em `/examples`
- Leia a API Reference para detalhes
