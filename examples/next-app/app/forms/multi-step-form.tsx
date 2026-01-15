'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSchema, useStepForm } from '@much/smart-forms-core'

// Schema para cada etapa
const personalSchema = createSchema({
  nome: { type: 'text', required: true, minLength: 2 },
  email: { type: 'email', required: true },
  telefone: { type: 'phone', required: false }
})

const addressSchema = createSchema({
  cep: { type: 'cep', required: true },
  logradouro: { type: 'text', required: true },
  numero: { type: 'text', required: true },
  municipio: { type: 'text', required: true },
  uf: { type: 'uf', required: true }
})

const additionalSchema = createSchema({
  profissao: { type: 'text', required: false },
  renda: { type: 'currency', required: false }
})

// Schema completo combinando todas as etapas
const fullSchema = personalSchema.merge(addressSchema).merge(additionalSchema)

type FormData = z.infer<typeof fullSchema>

export function MultiStepForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      municipio: '',
      uf: '',
      profissao: '',
      renda: 0
    }
  })

  // Configurar as etapas
  const totalSteps = 3
  const fieldsByStep = [
    ['nome', 'email', 'telefone'], // Etapa 1: Dados pessoais
    ['cep', 'logradouro', 'numero', 'municipio', 'uf'], // Etapa 2: Endereço
    ['profissao', 'renda'] // Etapa 3: Informações adicionais
  ]

  const stepForm = useStepForm(form, totalSteps, fieldsByStep)

  const onSubmit = (data: FormData) => {
    console.log('Dados completos:', data)
    alert('Formulário enviado com sucesso!')
  }

  const renderStep = () => {
    switch (stepForm.currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP *
              </label>
              <input
                {...form.register('cep')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
              />
              {form.formState.errors.cep && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cep.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logradouro *
              </label>
              <input
                {...form.register('logradouro')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rua, Avenida, etc."
              />
              {form.formState.errors.logradouro && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.logradouro.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                {...form.register('numero')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
              {form.formState.errors.numero && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.numero.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Município *
              </label>
              <input
                {...form.register('municipio')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sua cidade"
              />
              {form.formState.errors.municipio && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.municipio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UF *
              </label>
              <input
                {...form.register('uf')}
                type="text"
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="SP"
              />
              {form.formState.errors.uf && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.uf.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissão
              </label>
              <input
                {...form.register('profissao')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sua profissão"
              />
              {form.formState.errors.profissao && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.profissao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renda Mensal
              </label>
              <input
                {...form.register('renda', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0,00"
              />
              {form.formState.errors.renda && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.renda.message}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Indicador de etapas */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  stepForm.currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepForm.currentStep > step ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    stepForm.currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Dados Pessoais</span>
          <span>Endereço</span>
          <span>Informações Adicionais</span>
        </div>
      </div>

      {/* Formulário da etapa atual */}
      <form onSubmit={form.handleSubmit(stepForm.currentStep === 3 ? onSubmit : () => stepForm.nextStep())}>
        {renderStep()}

        {/* Botões de navegação */}
        <div className="flex justify-between mt-8">
          {stepForm.currentStep > 1 && (
            <button
              type="button"
              onClick={() => stepForm.prevStep()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Anterior
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ml-auto"
          >
            {stepForm.currentStep === 3 ? 'Enviar' : 'Próxima'}
          </button>
        </div>
      </form>
    </div>
  )
}
