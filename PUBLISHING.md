# Guia de Publicação no NPM

## Pré-requisitos

### 1. Criar conta no NPM
```bash
# Se ainda não tiver conta
npm adduser

# Ou fazer login se já tiver conta
npm login
```

### 2. Verificar se está logado
```bash
npm whoami
```

## Opções de Publicação

### Opção A: Pacote Público (Recomendado para open source)

**Vantagens:**
- Gratuito
- Qualquer projeto pode usar
- Comunidade pode contribuir

**Processo:**
```bash
# 1. Build dos pacotes
pnpm build

# 2. Publicar o core
cd packages/core
npm publish --access public

# 3. Publicar o adapter
cd ../adapters/shadcn
npm publish --access public
```

### Opção B: Pacote Privado com Scope (Recomendado para empresas)

**Vantagens:**
- Apenas sua organização pode usar
- Mais controle
- Nome da empresa no escopo (@much/...)

**Custo:**
- $7/mês por usuário no NPM Teams

**Processo:**
```bash
# 1. Criar organização no NPM
# Acesse: https://www.npmjs.com/org/create

# 2. Build dos pacotes
pnpm build

# 3. Publicar o core
cd packages/core
npm publish --access restricted

# 4. Publicar o adapter
cd ../adapters/shadcn
npm publish --access restricted
```

### Opção C: Registro Privado (Recomendado para empresas maiores)

Use GitHub Packages, Verdaccio, ou JFrog Artifactory.

**GitHub Packages (Gratuito com GitHub):**
```bash
# 1. Criar .npmrc no projeto
echo "@much:registry=https://npm.pkg.github.com" > .npmrc

# 2. Autenticar com GitHub
npm login --registry=https://npm.pkg.github.com

# 3. Publicar
pnpm build
cd packages/core
npm publish --registry=https://npm.pkg.github.com

cd ../adapters/shadcn
npm publish --registry=https://npm.pkg.github.com
```

## Versionamento Semântico

Siga o padrão [SemVer](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): Novas features (compatível)
- **PATCH** (0.0.1): Bug fixes

### Atualizar versões:
```bash
# Na raiz do monorepo
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

## Workflow Recomendado

### 1. Antes de publicar
```bash
# Garantir que tudo está commitado
git status

# Rodar testes (quando houver)
pnpm test

# Build
pnpm build

# Verificar o que será publicado
cd packages/core
npm pack --dry-run
```

### 2. Publicar nova versão
```bash
# 1. Atualizar CHANGELOG.md com as mudanças
# 2. Atualizar versão nos package.json
# 3. Commit das mudanças
git add .
git commit -m "chore: release v0.2.0"
git tag v0.2.0
git push && git push --tags

# 4. Publicar
pnpm build
cd packages/core && npm publish
cd ../adapters/shadcn && npm publish
```

## Automação com GitHub Actions

Crie `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build packages
        run: pnpm build
      
      - name: Publish core
        run: cd packages/core && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Publish shadcn adapter
        run: cd packages/adapters/shadcn && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Instalação em Projetos

Após publicar, outros projetos podem instalar:

```bash
# Público
npm install @much/smart-forms-core @much/smart-forms-shadcn

# Privado (GitHub Packages)
# Adicionar .npmrc ao projeto
echo "@much:registry=https://npm.pkg.github.com" > .npmrc
npm install @much/smart-forms-core @much/smart-forms-shadcn
```

## Minha Recomendação

Para a sua empresa (Much), sugiro:

1. **Comece com público** para facilitar desenvolvimento
2. **Depois migre para privado** se necessário
3. **Use GitHub Packages** (gratuito) em vez do NPM privado

### Primeira Publicação (Público):
```bash
# 1. Fazer login no NPM
npm login

# 2. Build
pnpm build

# 3. Publicar core
cd packages/core
npm publish --access public

# 4. Publicar adapter
cd ../adapters/shadcn
npm publish --access public

# 5. Verificar
npm info @much/smart-forms-core
```

## Troubleshooting

### Erro: Package name taken
Altere o nome no package.json para algo único:
- `@much/smart-forms-core` → `@much-dev/smart-forms-core`
- Ou use seu username: `@seunome/smart-forms-core`

### Erro: 403 Forbidden
- Verifique se está logado: `npm whoami`
- Para scope organizacional, precisa ser membro da org

### Erro: No README
Adicione um README.md em cada package antes de publicar
