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
                sh 'chmod +x ./jenkins/pipeline/setup.sh && ./jenkins/pipeline/setup.sh'
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
