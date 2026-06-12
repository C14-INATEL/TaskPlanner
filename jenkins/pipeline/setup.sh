#!/bin/bash
# Interrompe a execução se qualquer comando falhar
set -e

echo "=== Iniciando Setup e Verificação de Dependências ==="

echo "--- Verificando Versões do Ambiente ---"
python3 --version || echo "Python3 não encontrado!"
node --version || echo "Node.js não encontrado!"
npm --version || echo "NPM não encontrado!"
docker --version || echo "Docker não encontrado!"

echo "--- Configurando Ambiente Virtual Python ---"
python3 -m venv venv
source venv/bin/activate || . venv/bin/activate
pip install --upgrade pip

echo "--- Instalando Dependências do Backend ---"
pip install build
pip install -r requirements.txt

echo "--- Instalando Dependências do Frontend ---"
cd frontend
npm install
cd ..

echo "=== Setup concluído com sucesso ==="
