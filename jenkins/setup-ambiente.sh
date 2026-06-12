#!/bin/bash
# Interrompe a execução se qualquer comando falhar
set -e

echo "=== [DevOps] Atualizando repositórios do sistema ==="
apt-get update

echo "=== [DevOps] Instalando dependências base e Python ==="
apt-get install -y curl python3 python3-pip python3-venv libpq-dev python3-dev

echo "=== [DevOps] Configurando repositório do Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

echo "=== [DevOps] Instalando Node.js e NPM ==="
apt-get install -y nodejs

echo "=== [DevOps] Limpando cache de pacotes para reduzir tamanho da imagem ==="
apt-get clean
rm -rf /var/lib/apt/lists/*

echo "=== [DevOps] Runtimes instalados com sucesso! ==="
python3 --version
node -v
npm -v