'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSchema } from '@much/smart-forms-core'

// Define o schema usando a Schema Factory
const formSchema = createSchema({
  nome: { type: 'text', required: true, minLength: 2 },
  email: { type: 'email', required: true },
  telefone: { type: 'phone', required: false },
  mensagem: { type: 'text', required: true, minLength: 10 }
})

type FormData = z.infer<typeof formSchema>

export function BasicForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      mensagem: ''
    }
  })

  const onSubmit = (data: FormData) => {
    console.log('Dados do formulário:', data)
    alert('Formulário enviado com sucesso!')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          {...form.register('nome')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Seu nome completo"
        />
        {form.formState.errors.nome && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.nome.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          {...form.register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="seu@email.com"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefone
        </label>
        <input
          {...form.register('telefone')}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(11) 99999-9999"
        />
        {form.formState.errors.telefone && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.telefone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensagem *
        </label>
        <textarea
          {...form.register('mensagem')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua mensagem aqui..."
        />
        {form.formState.errors.mensagem && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.mensagem.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Enviar Formulário
      </button>
    </form>
  )
}
