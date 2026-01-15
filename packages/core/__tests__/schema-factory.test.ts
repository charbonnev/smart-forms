import { createSchema, extendSchema } from '../src/lib/schema-factory'

describe('Schema Factory', () => {
  describe('createSchema', () => {
    it('deve criar schema com campo texto obrigatório', () => {
      const schema = createSchema({
        nome: { type: 'text', required: true }
      })

      const result = schema.safeParse({ nome: 'João' })
      expect(result.success).toBe(true)
    })

    it('deve falhar quando campo obrigatório não é fornecido', () => {
      const schema = createSchema({
        nome: { type: 'text', required: true }
      })

      const result = schema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('deve validar email corretamente', () => {
      const schema = createSchema({
        email: { type: 'email', required: true }
      })

      const validResult = schema.safeParse({ email: 'test@example.com' })
      expect(validResult.success).toBe(true)

      const invalidResult = schema.safeParse({ email: 'invalid-email' })
      expect(invalidResult.success).toBe(false)
    })

    it('deve validar números com min e max', () => {
      const schema = createSchema({
        idade: { type: 'number', required: true, min: 18, max: 120 }
      })

      const validResult = schema.safeParse({ idade: 25 })
      expect(validResult.success).toBe(true)

      const tooYoungResult = schema.safeParse({ idade: 15 })
      expect(tooYoungResult.success).toBe(false)

      const tooOldResult = schema.safeParse({ idade: 150 })
      expect(tooOldResult.success).toBe(false)
    })

    it('deve validar string com minLength e maxLength', () => {
      const schema = createSchema({
        senha: { type: 'text', required: true, minLength: 8, maxLength: 20 }
      })

      const validResult = schema.safeParse({ senha: '12345678' })
      expect(validResult.success).toBe(true)

      const tooShortResult = schema.safeParse({ senha: '1234' })
      expect(tooShortResult.success).toBe(false)

      const tooLongResult = schema.safeParse({ senha: '123456789012345678901' })
      expect(tooLongResult.success).toBe(false)
    })

    it('deve validar com pattern regex', () => {
      const schema = createSchema({
        placa: { type: 'text', required: true, pattern: /^[A-Z]{3}-\d{4}$/ }
      })

      const validResult = schema.safeParse({ placa: 'ABC-1234' })
      expect(validResult.success).toBe(true)

      const invalidResult = schema.safeParse({ placa: 'ABC1234' })
      expect(invalidResult.success).toBe(false)
    })

    it('deve aceitar campos opcionais', () => {
      const schema = createSchema({
        nome: { type: 'text', required: true },
        apelido: { type: 'text', required: false }
      })

      const withNicknameResult = schema.safeParse({ nome: 'João', apelido: 'Jão' })
      expect(withNicknameResult.success).toBe(true)

      const withoutNicknameResult = schema.safeParse({ nome: 'João' })
      expect(withoutNicknameResult.success).toBe(true)
    })

    it('deve validar boolean', () => {
      const schema = createSchema({
        ativo: { type: 'boolean', required: false }
      })

      const trueResult = schema.safeParse({ ativo: true })
      expect(trueResult.success).toBe(true)

      const falseResult = schema.safeParse({ ativo: false })
      expect(falseResult.success).toBe(true)

      const undefinedResult = schema.safeParse({})
      expect(undefinedResult.success).toBe(true)
    })
  })

  describe('extendSchema', () => {
    it('deve estender schema existente', () => {
      const baseSchema = createSchema({
        nome: { type: 'text', required: true }
      })

      const extendedSchema = extendSchema(baseSchema, {
        email: { type: 'email', required: true }
      })

      const result = extendedSchema.safeParse({
        nome: 'João',
        email: 'joao@example.com'
      })

      expect(result.success).toBe(true)
    })

    it('deve falhar se campos base não forem fornecidos', () => {
      const baseSchema = createSchema({
        nome: { type: 'text', required: true }
      })

      const extendedSchema = extendSchema(baseSchema, {
        email: { type: 'email', required: true }
      })

      const result = extendedSchema.safeParse({
        email: 'joao@example.com'
      })

      expect(result.success).toBe(false)
    })
  })

  describe('Tipos especiais', () => {
    it('deve validar CEP brasileiro', () => {
      const schema = createSchema({
        cep: { type: 'cep', required: true }
      })

      // CEP válido
      const validResult = schema.safeParse({ cep: '12345-678' })
      expect(validResult.success).toBe(true)
    })

    it('deve validar UF brasileira', () => {
      const schema = createSchema({
        uf: { type: 'uf', required: true }
      })

      const validResult = schema.safeParse({ uf: 'SP' })
      expect(validResult.success).toBe(true)

      const invalidResult = schema.safeParse({ uf: 'ABC' })
      expect(invalidResult.success).toBe(false)
    })

    it('deve validar currency (number)', () => {
      const schema = createSchema({
        preco: { type: 'currency', required: true }
      })

      const validResult = schema.safeParse({ preco: 1000.50 })
      expect(validResult.success).toBe(true)
    })
  })
})
