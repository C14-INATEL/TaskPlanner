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
                // Mantendo a prática de scripts externos (Lucas)
                sh 'chmod +x ./jenkins/pipeline/setup.sh && ./jenkins/pipeline/setup.sh'
            }
        }

        stage('Build Backend') {
            steps {
                // Incorporando o estágio de Build do Gustavo
                dir('backend') {
                    sh '. ../venv/bin/activate && python3 -m build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/dist/**', fingerprint: true
                }
                failure {
                    echo "Build do Backend falhou. Verifique os logs para detalhes."
                }
            }
        }

        stage('Build Frontend') {
            steps {
                // Estágio de Build do Frontend (Next.js) - Kaua
                dir('frontend') {
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/.next/**', fingerprint: true
                }
                failure {
                    echo "Build do Frontend falhou. Verifique os logs para detalhes."
                }
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
