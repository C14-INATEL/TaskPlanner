// =================================================================
// PIPELINE DE CI/CD - TASK PLANNER
// Desenvolvido e comitado por: Lucas (DevOps)
// Estágio Inicial: Setup & Dependency Check
// =================================================================

pipeline {
    agent any

    stages {
        stage('Setup & Dependency Check') {
            steps {
                sh '''
                    echo "=== Iniciando Setup e Verificação de Dependências ==="
                    
                    echo "--- Verificando Versões do Ambiente ---"
                    python3 --version || echo "Python3 não encontrado!"
                    node --version || echo "Node.js não encontrado!"
                    npm --version || echo "NPM não encontrado!"
                    docker --version || echo "Docker não encontrado!"
                    
                    echo "--- Configurando Ambiente Virtual Python ---"
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install --upgrade pip
                    
                    echo "--- Instalando Dependências do Backend ---"
                    pip install -r requirements.txt
                    
                    echo "--- Instalando Dependências do Frontend ---"
                    cd frontend
                    npm install
                    
                    echo "=== Setup concluído com sucesso ==="
                '''
            }
        }

        stage('Testes') {
            steps {
                sh '''
                    echo "=== Iniciando Execução dos Testes ==="

                    echo "--- Testes do Backend (pytest) ---"
                    . venv/bin/activate
                    pip install pytest-mock --quiet
                    cd backend
                    export DATABASE_URL="sqlite:///:memory:"
                    python -m pytest tests/ -v --tb=short --rootdir=.
                    cd ..

                    echo "--- Testes do Frontend (jest) ---"
                    cd frontend
                    npm test -- --watchAll=false --passWithNoTests
                    cd ..

                    echo "=== Testes concluídos com sucesso ==="
                '''
            }
        }
    }
}
