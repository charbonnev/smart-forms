import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SmartInput } from '../src/components/smart-input'
import { createSchema } from '../src/lib/schema-factory'
import * as useSmartInputModule from '../src/hooks/use-smart-input'

// Mock do useSmartInput
jest.mock('../src/hooks/use-smart-input', () => ({
  useSmartInput: jest.fn(() => ({
    handleChange: jest.fn(),
    clearErrors: jest.fn(),
  }))
}))

// Mock components para testes
const mockComponents = {
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
          components={mockComponents}
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
            components={mockComponents}
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
          components={mockComponents}
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
          components={mockComponents}
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
          components={mockComponents}
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
          components={mockComponents}
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
          components={mockComponents}
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
          components={mockComponents}
          }}
        />
      )

      const input = screen.getByPlaceholderText('Placeholder')
      expect(input).toBeInTheDocument()
      expect(input.value).toBe('')
    })
  })
})
