import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'lib/index': 'src/lib/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'components/index': 'src/components/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: false, // Desabilitado temporariamente
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-hook-form', 'zod']
})
