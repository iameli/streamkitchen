pipeline {
    agent any

    environment {
        WH_DOCKER_AUTH = credentials('WH_DOCKER_AUTH')
        WH_DOCKER_PUSH_PREFIX = credentials('WH_DOCKER_PUSH_PREFIX')
        WH_S3_ACCESS_KEY_ID = credentials('WH_S3_ACCESS_KEY_ID')
        WH_S3_SECRET_ACCESS_KEY = credentials('WH_S3_SECRET_ACCESS_KEY')
        WH_S3_URL = credentials('WH_S3_URL')
    }

    ansiColor('xterm') {
        stages {
            stage('Build') {
                steps {
                    sh 'npm install'
                    sh 'npx wheelhouse build'
                }
            }
            stage('Push') {
                steps {
                    sh 'npx wheelhouse push'
                }
            }
        }
    }

}
