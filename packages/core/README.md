# @much/smart-forms-core

Core package do Smart Forms - componentes e hooks agnósticos de UI para criação de formulários React com validação.

## Instalação

```bash
npm install @much/smart-forms-core react-hook-form zod
```

## Features

- ✅ Schema Factory para validação declarativa
- ✅ Hook `useStepForm` para formulários multi-etapas
- ✅ Hook `useSmartInput` para manipulação de inputs
- ✅ Componentes core: SmartFormContainer, SmartStepIndicator
- ✅ TypeScript ready
- ✅ Zero dependências de UI

## Uso Básico

```typescript
import { createSchema } from '@much/smart-forms-core'

const schema = createSchema({
  name: { type: 'text', required: true, minLength: 2 },
  email: { type: 'email', required: true },
  age: { type: 'number', required: true, min: 18 }
})
```

## Tipos de Campo Suportados

- `text` - Texto simples
- `email` - Email com validação
- `number` - Números
- `currency` - Valores monetários
- `cep` - CEP brasileiro
- `uf` - UF brasileira
- `boolean` - Verdadeiro/Falso
- `date` - Datas
- `phone` - Telefones
- `cnpj`/`cpf` - Documentos brasileiros

## Documentação Completa

Visite o [repositório principal](https://github.com/much/smart-forms) para documentação completa.

## Licença

MIT
