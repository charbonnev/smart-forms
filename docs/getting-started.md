# Getting Started with Smart Forms

Smart Forms é uma biblioteca de componentes e hooks para facilitar a criação de formulários em React com validação automática, tipagem forte e UX otimizada.

## Instalação

```bash
# Para o adapter Shadcn/UI (inclui o core)
npm install @much/smart-forms-shadcn

# Ou apenas o core (agnóstico de UI)
npm install @much/smart-forms-core

# Peer dependencies
npm install react react-hook-form zod @hookform/resolvers
```

## Uso Básico

### 1. Formulário Simples

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput, createSchema } from '@much/smart-forms-shadcn'

// 1. Definir o schema
const schema = createSchema({
  nome: { type: 'text', required: true },
  email: { type: 'email', required: true },
})

// 2. Criar o formulário
export function MeuForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <SmartInput
        form={form}
        name="nome"
        label="Nome Completo"
        placeholder="Digite seu nome"
        required
      />
      
      <SmartInput
        form={form}
        name="email"
        label="E-mail"
        type="email"
        placeholder="email@exemplo.com"
        required
      />
      
      <button type="submit">Enviar</button>
    </form>
  )
}
```

### 2. Validações Avançadas

```tsx
const schema = createSchema({
  // Campo obrigatório com mensagem customizada
  nome: {
    type: 'text',
    required: true,
    message: 'Nome é obrigatório!',
  },
  
  // Campo com tamanho mínimo e máximo
  senha: {
    type: 'text',
    required: true,
    minLength: 8,
    maxLength: 20,
  },
  
  // Número com range
  idade: {
    type: 'number',
    required: true,
    min: 18,
    max: 120,
  },
  
  // Com regex customizado
  placa: {
    type: 'text',
    required: true,
    pattern: /^[A-Z]{3}-\d{4}$/,
  },
})
```

### 3. Formulário Multi-Etapas

```tsx
import { useStepForm, SmartStepIndicator } from '@much/smart-forms-shadcn'

function FormularioSteps() {
  const form = useForm({ resolver: zodResolver(schema) })
  
  const {
    currentStep,
    nextStep,
    prevStep,
    canAccessStep,
    isStepCompleted,
  } = useStepForm(form, 3, [
    ['nome', 'email'],          // Etapa 1
    ['cep', 'logradouro'],      // Etapa 2
    ['senha', 'confirmar'],     // Etapa 3
  ])

  return (
    <>
      <SmartStepIndicator
        currentStep={currentStep}
        totalSteps={3}
        labels={['Dados', 'Endereço', 'Senha']}
      />
      
      {currentStep === 1 && <Step1 form={form} />}
      {currentStep === 2 && <Step2 form={form} />}
      {currentStep === 3 && <Step3 form={form} />}
      
      <div className="flex gap-2">
        {currentStep > 1 && (
          <button onClick={prevStep}>Anterior</button>
        )}
        {currentStep < 3 && (
          <button onClick={nextStep}>Próximo</button>
        )}
      </div>
    </>
  )
}
```

## Componentes Disponíveis

### SmartInput

Input principal com todas as funcionalidades:

```tsx
<SmartInput
  form={form}                    // React Hook Form instance
  name="campo"                   // Nome do campo
  label="Rótulo"                 // Label do campo
  type="text"                    // Tipo do input
  placeholder="Digite algo"      // Placeholder
  required={true}                // Campo obrigatório?
  disabled={false}               // Desabilitado?
  description="Texto de ajuda"   // Descrição abaixo
  className="classe-custom"      // CSS extra
  maxLength={100}                // Máximo de caracteres
  onCepChange={(value) => {      // Callback para CEP
    // Buscar endereço via API
  }}
/>
```

### SmartCurrencyInput

Para valores monetários:

```tsx
<SmartCurrencyInput
  form={form}
  name="valor"
  label="Valor"
  placeholder="0,00"
  required={true}
/>
```

### SmartCheckbox

Checkboxes estilizados:

```tsx
<SmartCheckbox
  form={form}
  name="aceito_termos"
  label="Aceito os termos"
  required={true}
  description="Li e concordo com os termos"
/>
```

### SmartSelect

Select dropdown:

```tsx
<SmartSelect
  form={form}
  name="estado_civil"
  label="Estado Civil"
  options={[
    { value: 'solteiro', label: 'Solteiro' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
  ]}
/>
```

## Exemplo: Auto-preenchimento de CEP

```tsx
const handleCEPChange = async (cep: string) => {
  if (cep.length === 9) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        form.setValue('logradouro', data.logradouro)
        form.setValue('municipio', data.localidade)
        form.setValue('uf', data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }
}

<SmartInput
  form={form}
  name="cep"
  type="cep"
  label="CEP"
  onCepChange={handleCEPChange}
/>
```

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
