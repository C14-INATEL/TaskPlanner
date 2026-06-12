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
    }
}
