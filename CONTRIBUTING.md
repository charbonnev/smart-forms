# Contributing Guide

## 🚀 Fluxo de Desenvolvimento

### 1. Desenvolvimento Local

```bash
# Clone e instale
git clone <repo>
cd smart-forms
pnpm install

# Desenvolva com hot reload
pnpm dev

# Rode os testes enquanto desenvolve
pnpm test:watch
```

### 2. Antes de Commitar

```bash
# Roda lint, typecheck e tests
pnpm check

# Se tudo passar, commit
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### 3. Publicar Nova Versão

**Opção 1: Manual (recomendado inicialmente)**

```bash
# 1. Atualize a versão (patch: 0.1.0 → 0.1.1)
pnpm version:patch

# 2. Commit as mudanças de versão
git add .
git commit -m "chore: bump version to 0.1.1"

# 3. Push para master (CI vai publicar automaticamente)
git push origin master
```

**Opção 2: Automático via CI**

Simplesmente aumente a versão nos `package.json` dos pacotes e faça push para `master`. O GitHub Actions vai:
- ✅ Rodar todos os testes
- ✅ Fazer build
- ✅ Publicar no NPM automaticamente
- ✅ Criar release no GitHub

### 4. Usar no CRM

```bash
cd crm_bkm
pnpm update @charbonnev/smart-forms-core @charbonnev/smart-forms-shadcn
```

## 📦 Scripts Disponíveis

### Root (monorepo)
- `pnpm build` - Build de todos os pacotes
- `pnpm test` - Roda todos os testes
- `pnpm test:coverage` - Testes com cobertura
- `pnpm check` - Lint + typecheck + tests (use antes de commitar)
- `pnpm version:patch` - Atualiza versão patch (0.1.0 → 0.1.1)
- `pnpm version:minor` - Atualiza versão minor (0.1.0 → 0.2.0)
- `pnpm version:major` - Atualiza versão major (0.1.0 → 1.0.0)

### Core Package
- `pnpm --filter @charbonnev/smart-forms-core test` - Testes apenas do core
- `pnpm --filter @charbonnev/smart-forms-core build` - Build apenas do core

## 🔄 CI/CD Pipeline

### Em Pull Requests e Pushes
1. ✅ Lint
2. ✅ Type Check
3. ✅ Testes
4. ✅ Build

### No Master (após merge)
1. ✅ Verifica se a versão mudou
2. ✅ Se sim, publica no NPM
3. ✅ Cria release no GitHub

## 🏷️ Semantic Versioning

Use conventional commits:

- `feat:` → minor version (0.1.0 → 0.2.0)
- `fix:` → patch version (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → major version (0.1.0 → 1.0.0)
- `chore:`, `docs:`, `test:` → sem mudança de versão

## 🔐 Secrets Necessários no GitHub

Para o CI/CD funcionar, configure no GitHub:

1. **NPM_TOKEN**: Token de autenticação do NPM
   - Criar em: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Type: Automation (para CI/CD)
   
2. **CODECOV_TOKEN** (opcional): Para upload de cobertura
   - Criar em: https://codecov.io/

## 📊 Monitoramento

- **Testes**: Rodados em toda PR/push
- **Cobertura**: Codecov.io (badge no README)
- **Builds**: GitHub Actions
- **Versões**: NPM (https://www.npmjs.com/package/@charbonnev/smart-forms-core)
