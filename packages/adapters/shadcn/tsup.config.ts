import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    entry: 'src/index.d.ts'
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react', 
    'react-hook-form', 
    '@much/smart-forms-core',
    '@/components/ui/input',
    '@/components/ui/form',
    '@/components/ui/select',
    '@/components/ui/checkbox',
    '@/components/ui/currency-input'
  ]
})
