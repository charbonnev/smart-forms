import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput } from '../src/components/smart-input'
import { createSchema } from '../src/lib/schema-factory'

// Mock do useSmartInput
jest.mock('../src/hooks/use-smart-input')

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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
        />
      )

      expect(screen.getByText('Esta é uma descrição helpful')).toBeInTheDocument()
    })
  })

  describe('Integração com React Hook Form', () => {
    it('deve limpar erros ao digitar', async () => {
      const TestForm = () => {
        const schema = createSchema({
          testField: { type: 'text', required: true },
        })

        const form = useForm({
          resolver: zodResolver(schema),
          mode: 'onChange',
        })

        return (
          <SmartInput
            form={form}
            name="testField"
            label="Teste"
            required
            components={{
              FormField: ({ children }: any) => <div>{children}</div>,
              FormItem: ({ children }: any) => <div>{children}</div>,
              FormLabel: ({ children }: any) => <label>{children}</label>,
              FormControl: ({ children }: any) => <div>{children}</div>,
              FormMessage: ({ children }: any) => <div>{children}</div>,
              Input: (props: any) => <input {...props} />,
            }}
          />
        )
      }

      render(<TestForm />)

      const input = screen.getByLabelText('Teste *')
      
      // Simular erro
      fireEvent.blur(input)
      await waitFor(() => {
        expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
      })

      // Digitar algo deve limpar o erro
      fireEvent.change(input, { target: { value: 'teste' } })
      await waitFor(() => {
        expect(screen.queryByText('Campo obrigatório')).not.toBeInTheDocument()
      })
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label htmlFor="testField">{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input id="testField" {...props} />,
          }}
        />
      )

      const label = screen.getByText('Campo Acessível')
      const input = screen.getByLabelText('Campo Acessível')
      
      expect(label.htmlFor).toBe(input.id)
    })

    it('deve mostrar mensagem de erro quando houver erro de validação', () => {
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div role="alert">Campo inválido</div>,
            Input: (props: any) => <input {...props} />,
          }}
        />
      )

      expect(screen.getByText('Campo inválido')).toBeInTheDocument()
    })
  })

  describe('Casos de borda', () => {
    it('deve funcionar com nomes de campo complexos', () => {
      render(
        <SmartInput
          form={mockForm}
          name="endereco.cep"
          label="CEP"
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
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
          components={{
            FormField: ({ children }: any) => <div>{children}</div>,
            FormItem: ({ children }: any) => <div>{children}</div>,
            FormLabel: ({ children }: any) => <label>{children}</label>,
            FormControl: ({ children }: any) => <div>{children}</div>,
            FormMessage: ({ children }: any) => <div>{children}</div>,
            Input: (props: any) => <input {...props} />,
          }}
        />
      )

      const input = screen.getByPlaceholderText('Placeholder')
      expect(input).toBeInTheDocument()
      expect(input.value).toBe('')
    })
  })
})
