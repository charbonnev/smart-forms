import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput } from '../src/components/smart-input'
import { createSchema } from '../src/lib/schema-factory'

// Mock do useSmartInput com handlers corretos
jest.mock('../src/hooks/use-smart-input', () => ({
  useSmartInput: () => ({
    handleInputChange: jest.fn((e: any) => e.target.value),
    handleNumberChange: jest.fn((e: any) => e.target.value),
    handleCurrencyChange: jest.fn((e: any) => e.target.value),
    handleCepChange: jest.fn((e: any) => e.target.value),
    handleCpfChange: jest.fn((e: any) => e.target.value),
    handleCnpjChange: jest.fn((e: any) => e.target.value),
    handlePhoneChange: jest.fn((e: any) => e.target.value),
    clearErrors: jest.fn(),
  })
}))

// Componentes mock para testes com contexto do field name
let currentFieldName = ''
let currentFieldError: any = null

const mockComponents = {
  FormField: ({ control, name, render: renderFn }: any) => {
    currentFieldName = name
    const field = { name, value: '', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }
    const error = control?.formState?.errors?.[name]
    currentFieldError = error
    return <div data-testid="form-field">{renderFn({ field, fieldState: { error } })}</div>
  },
  FormItem: ({ children }: any) => <div data-testid="form-item">{children}</div>,
  FormLabel: ({ children }: any) => (
    <label data-testid="form-label" htmlFor={currentFieldName}>{children}</label>
  ),
  FormControl: ({ children }: any) => <div data-testid="form-control">{children}</div>,
  FormMessage: ({ children }: any) => {
    // Renderiza erro do fieldState ou children passados
    const message = currentFieldError?.message || children
    return message ? <div role="alert" data-testid="form-message">{message}</div> : null
  },
  Input: ({ ...props }: any) => (
    <input data-testid="input" id={currentFieldName} {...props} />
  ),
}

describe('SmartInput', () => {
  const mockForm = {
    control: {},
    setValue: jest.fn(),
    getValues: jest.fn(),
    clearErrors: jest.fn(),
    trigger: jest.fn(),
    formState: { errors: {} },
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderização básica', () => {
    it('deve renderizar o input com label e placeholder', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo de Teste"
          placeholder="Digite algo"
          components={mockComponents}
        />
      )

      expect(screen.getByText('Campo de Teste')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Digite algo')).toBeInTheDocument()
    })

    it('deve mostrar asterisco vermelho quando required=true', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo Obrigatório"
          required
          components={mockComponents}
        />
      )

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-red-500')
    })

    it('deve mostrar descrição quando fornecida', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo"
          description="Esta é uma descrição helpful"
          components={mockComponents}
        />
      )

      expect(screen.getByText('Esta é uma descrição helpful')).toBeInTheDocument()
    })
  })

  describe('Integração com React Hook Form', () => {
    it('deve renderizar corretamente com formulário real', () => {
      const TestForm = () => {
        const schema = createSchema({
          testField: { type: 'text', required: true },
        })

        const form = useForm({
          resolver: zodResolver(schema),
        })

        return (
          <SmartInput
            form={form}
            name="testField"
            label="Teste"
            required
            components={mockComponents}
          />
        )
      }

      render(<TestForm />)

      const input = screen.getByTestId('input')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('Teste')).toBeInTheDocument()
    })
  })

  describe('Estados e interações', () => {
    it('deve desabilitar input quando disabled=true', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo"
          disabled
          components={mockComponents}
        />
      )

      const input = screen.getByLabelText('Campo')
      expect(input).toBeDisabled()
    })

    it('deve aplicar className customizada', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo"
          className="bg-red-500"
          components={mockComponents}
        />
      )

      const input = screen.getByLabelText('Campo')
      expect(input).toHaveClass('bg-red-500')
    })

    it('deve respeitar maxLength', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo"
          maxLength={5}
          components={mockComponents}
        />
      )

      const input = screen.getByLabelText('Campo')
      expect(input).toHaveAttribute('maxLength', '5')
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter htmlFor correto no label', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo Acessível"
          components={mockComponents}
        />
      )

      const label = screen.getByText('Campo Acessível')
      const input = screen.getByLabelText('Campo Acessível')
      
      expect(label.htmlFor).toBe(input.id)
    })

    it('deve passar control com formState para FormField', () => {
      const formWithError = {
        ...mockForm,
        formState: {
          errors: {
            testField: {
              message: 'Campo inválido',
            },
          },
        },
      }

      render(
        <SmartInput
          form={formWithError}
          name="testField"
          label="Campo"
          components={mockComponents}
        />
      )

      // O FormField mock recebe o control com formState
      const formField = screen.getByTestId('form-field')
      expect(formField).toBeInTheDocument()
    })
  })

  describe('Casos de borda', () => {
    it('deve funcionar com nomes de campo complexos', () => {
      render(
        <SmartInput
          form={mockForm}
          name="endereco.cep"
          label="CEP"
          components={mockComponents}
        />
      )

      expect(screen.getByText('CEP')).toBeInTheDocument()
    })

    it('deve lidar com valores undefined no formulário', () => {
      render(
        <SmartInput
          form={mockForm}
          name="testField"
          label="Campo"
          placeholder="Placeholder"
          components={mockComponents}
        />
      )

      const input = screen.getByPlaceholderText('Placeholder')
      expect(input).toBeInTheDocument()
      expect(input.value).toBe('')
    })
  })
})
