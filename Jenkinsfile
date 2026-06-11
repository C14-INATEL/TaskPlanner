// =================================================================
// PIPELINE DE CI/CD - TASK PLANNER
// Desenvolvido e comitado por: Lucas (DevOps)
// Estágio Inicial: Setup & Dependency Check
// =================================================================

pipeline
{
    agent any

    stages {
        stage('Setup & Dependency Check')
        {
            steps
            {
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
                    pip install build
                    pip install -r requirements.txt

                    echo "--- Instalando Dependências do Frontend ---"
                    cd frontend
                    npm install

                    echo "=== Setup concluído com sucesso ==="
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '. ../venv/bin/activate && python3 -m build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/dist/**',
                             fingerprint: true
                }

                failure {
                    echo "Build do Backend falhou. Verifique os logs para detalhes."
                }
            }
        }
    }
}
