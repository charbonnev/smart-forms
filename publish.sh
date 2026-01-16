#!/bin/bash

# Script para publicar pacotes no NPM usando token
# Uso: NPM_TOKEN=npm_xxxxx ./publish.sh

set -e

if [ -z "$NPM_TOKEN" ]; then
  echo "❌ Erro: NPM_TOKEN não definido"
  echo "Use: NPM_TOKEN=npm_xxxxx ./publish.sh"
  exit 1
fi

echo "🔧 Configurando autenticação NPM..."
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

echo "📦 Buildando pacotes..."
pnpm build --filter @charbonnev/smart-forms-core --filter @charbonnev/smart-forms-shadcn

echo "📤 Publicando @charbonnev/smart-forms-core..."
cd packages/core
npm publish --access public
cd ../..

echo "📤 Publicando @charbonnev/smart-forms-shadcn..."
cd packages/adapters/shadcn
npm publish --access public
cd ../../..

echo "✅ Publicação concluída!"
echo ""
echo "Versões publicadas:"
npm view @charbonnev/smart-forms-core version
npm view @charbonnev/smart-forms-shadcn version
