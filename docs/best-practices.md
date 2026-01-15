# Best Practices

## 🏗️ Padrões e Boas Práticas

### 1. Reutilize Schemas

Crie schemas base para dados comuns e reutilize-os:

```tsx
// schemas/base.ts
export const ENDERECO_SCHEMA = {
  cep: { type: 'cep', required: true },
  logradouro: { type: 'text', required: true },
  numero: { type: 'text', required: true },
  complemento: { type: 'text', required: false },
  municipio: { type: 'text', required: true },
  uf: { type: 'uf', required: true },
}

export const DADOS_PESSOAIS_SCHEMA = {
  nome: { type: 'text', required: true, minLength: 3 },
  email: { type: 'email', required: true },
  telefone: { type: 'phone', required: false },
}

// Usar em formulários específicos
import { createSchema } from '@much/smart-forms-shadcn'
import { ENDERECO_SCHEMA, DADOS_PESSOAIS_SCHEMA } from './schemas/base'

const clienteSchema = createSchema({
  ...DADOS_PESSOAIS_SCHEMA,
  ...ENDERECO_SCHEMA,
  cpf: { type: 'cpf', required: true },
})
```

### 2. Use BASE_SCHEMAS

O Smart Forms já vem com schemas pré-definidos:

```tsx
import { BASE_SCHEMAS, extendSchema } from '@much/smart-forms-shadcn'

// Usar schema de endereço completo
const meuSchema = extendSchema(BASE_SCHEMAS.address, {
  observacoes: { type: 'text', required: false },
})
```

### 3. Modo de Validação

Configure o modo de validação adequado:

```tsx
// Para validação em tempo real (melhor UX)
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',  // Valida a cada mudança
})

// Para melhor performance
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur',    // Valida ao sair do campo
})

// Para validação apenas no submit
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onSubmit',  // Valida apenas ao submeter
})
```

### 4. Mensagens de Erro Customizadas

```tsx
const schema = createSchema({
  senha: {
    type: 'text',
    required: true,
    minLength: 8,
    message: 'A senha deve ter no mínimo 8 caracteres',
  },
  confirmarSenha: {
    type: 'text',
    required: true,
    message: 'Por favor, confirme sua senha',
  },
})

// Validação customizada adicional
const formSchema = schema.refine(
  (data) => data.senha === data.confirmarSenha,
  {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  }
)
```

### 5. Loading States

Gerencie estados de loading corretamente:

```tsx
function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await api.post('/endpoint', data)
      toast.success('Salvo com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <SmartInput form={form} name="nome" label="Nome" disabled={isSubmitting} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
```

### 6. Validação Assíncrona

Para validações que precisam consultar APIs:

```tsx
const schema = createSchema({
  email: { type: 'email', required: true },
  username: { type: 'text', required: true },
})

const formSchema = schema.refine(
  async (data) => {
    const response = await fetch(`/api/check-username/${data.username}`)
    const { available } = await response.json()
    return available
  },
  {
    message: "Username já está em uso",
    path: ["username"],
  }
)
```

### 7. Formulários Dinâmicos

Para adicionar/remover campos dinamicamente:

```tsx
import { useFieldArray } from 'react-hook-form'

function DynamicForm() {
  const form = useForm({
    defaultValues: {
      telefones: [{ numero: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "telefones"
  })

  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <SmartInput
            form={form}
            name={`telefones.${index}.numero`}
            label={`Telefone ${index + 1}`}
            type="phone"
          />
          <button type="button" onClick={() => remove(index)}>
            Remover
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => append({ numero: '' })}>
        Adicionar Telefone
      </button>
    </form>
  )
}
```

### 8. Reset e Defaults

```tsx
function EditForm({ initialData }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  })

  // Reset para valores iniciais
  const handleCancel = () => {
    form.reset()
  }

  // Reset para valores específicos
  const handleClear = () => {
    form.reset({
      nome: '',
      email: '',
      // ...
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* campos */}
      <button type="button" onClick={handleCancel}>Cancelar</button>
      <button type="button" onClick={handleClear}>Limpar</button>
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## 🎨 Estilização

### Customizar Componentes

```tsx
// Classes Tailwind customizadas
<SmartInput
  form={form}
  name="campo"
  label="Campo Especial"
  className="bg-blue-50 border-blue-300 focus:border-blue-500"
/>

// Usar com CSS Modules
import styles from './form.module.css'

<SmartInput
  form={form}
  name="campo"
  label="Campo"
  className={styles.customInput}
/>
```

### Temas Consistentes

Crie wrappers para manter consistência:

```tsx
// components/MySmartInput.tsx
export function MySmartInput(props) {
  return (
    <SmartInput
      {...props}
      className={`my-default-classes ${props.className || ''}`}
    />
  )
}
```

## 🐛 Debug

### Visualizar Estado do Formulário

```tsx
function DebugForm() {
  const form = useForm({ resolver: zodResolver(schema) })

  return (
    <>
      <form>{/* campos */}</form>
      
      {/* Remover em produção */}
      <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
      <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
    </>
  )
}
```

### DevTools

Instale o React Hook Form DevTools:

```tsx
import { DevTool } from "@hookform/devtools"

function MyForm() {
  const form = useForm()
  
  return (
    <>
      <form>{/* campos */}</form>
      <DevTool control={form.control} />
    </>
  )
}
```

## 📱 Responsividade

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <SmartInput form={form} name="nome" label="Nome" />
  <SmartInput form={form} name="sobrenome" label="Sobrenome" />
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <SmartInput form={form} name="cep" label="CEP" />
  <SmartInput form={form} name="numero" label="Número" />
  <SmartInput form={form} name="uf" label="UF" />
</div>
```

## 🔒 Segurança

### Sanitização

```tsx
import DOMPurify from 'isomorphic-dompurify'

const onSubmit = (data) => {
  const sanitizedData = {
    ...data,
    descricao: DOMPurify.sanitize(data.descricao),
  }
  
  // Enviar sanitizedData
}
```

### Validação Server-Side

Sempre valide no servidor também:

```tsx
// Cliente (front-end)
const schema = createSchema({
  email: { type: 'email', required: true },
})

// Servidor (back-end)
// Use o mesmo schema ou validação equivalente
const { error } = schema.safeParse(requestBody)
if (error) {
  return res.status(400).json({ error: error.message })
}
```

## 💡 Dicas Pro

1. **Mode onChange vs onBlur**: Use `onChange` para campos críticos, `onBlur` para melhor performance
2. **Descriptions**: Adicione descriptions em campos complexos para ajudar o usuário
3. **Required visual**: Marque visualmente campos obrigatórios
4. **Loading feedback**: Sempre mostre feedback durante submissão
5. **Error messages**: Escreva mensagens de erro claras e acionáveis
6. **Auto-save**: Considere auto-save para formulários longos
7. **Undo**: Permita desfazer mudanças em formulários de edição
8. **Keyboard navigation**: Teste navegação por teclado (Tab, Enter)
9. **Mobile testing**: Teste em dispositivos móveis reais
10. **Accessibility**: Use labels corretos e ARIA attributes quando necessário
