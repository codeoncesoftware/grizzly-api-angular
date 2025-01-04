#!/usr/bin/env groovy

pipeline {

    agent any
    tools {
        nodejs 'node'
    }

    triggers { pollSCM('*/5 * * * *') }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {

        stage('Setup Stage') {
            steps {
                sh "npm install --legacy-peer-deps"
            }
        }
        stage('Lint Stage') {
             steps {
                 sh "npm run lint"
             }
         }
        stage('Build for CI') {
            when { branch "develop" }
            steps {
               sh "npm run build -- --configuration=develop"
            }
        }
        stage('Build for PROD') {
            when { branch "master" }
            steps {
               sh "npm run build -- --configuration=production"
            }
        }
        stage('Upload Dist into AWS S3 '){
            when { branch "develop" }
            steps {
                withAWS(credentials:'7f53e3c0-f681-444e-a49a-14495eb89e82', region:'eu-central-1') {
                    s3Delete(bucket:'codeonce-grizzly-api-angular-s3-dev', path:'**/*')
                    s3Upload(bucket:"codeonce-grizzly-api-angular-s3-dev", path:'dist', includePathPattern:'**/*', workingDir:'dist')
                    cfInvalidate(distribution:'E106FME6ADBE4U', paths:['/*'])
                }
            }
        }
        stage('Upload Dist into AWS S3 CD '){
            when { branch "master" }
            environment {
               APP_VERSION = sh(script: 'npm run get-version --silent', returnStdout: true).trim()
            }
            steps {
                sh "echo APP_VERSION:${env.APP_VERSION}"
                withAWS(credentials:'7f53e3c0-f681-444e-a49a-14495eb89e82', region:'eu-central-1') {
                    s3Upload(bucket:"codeonce-grizzly-api-angular-s3-prod", path:"${env.APP_VERSION}", includePathPattern:'**/*', workingDir:'dist')
                }
            }
        }
        stage('Mirroring') {
            when { branch "master" }
			steps {
                script {
                    sh 'git config --global core.sshCommand "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"'
                    if (fileExists('grizzly-api-angular.git')) {
                        echo 'file exist'
                        sh 'rm -r grizzly-api-angular.git'
                    }
                    withCredentials([usernamePassword(credentialsId: 'bitbucket-jenkins-user', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh "git clone --mirror https://${GIT_USERNAME}:${GIT_PASSWORD}@bitbucket.org/codeonceteam/grizzly-api-angular.git"
                    }

                    sshagent(credentials: ['github-jenkins-user']) {
                        sh 'cd grizzly-api-angular.git'
                        sh 'rm -r .git'
                        sh 'git init'
                        if (fileExists('grizzly-api-angular.git')) {
                            sh 'rm -r grizzly-api-angular.git'
                        }
                        sh 'git add .'
                        sh 'git rm -f src/environments/environment.develop.ts'
                        sh 'git rm -f src/environments/environment.prod.ts'
                        sh 'git commit -m "mirroring sync"'
                        sh 'git push -f git@github.com:codeoncesoftware/grizzly-api-angular.git master'
                    }
                }
            }
        }
    }
    post {
        failure {
             emailext (
		      subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
		      body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
		        <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>"</p>""",
		      recipientProviders: [[$class: 'DevelopersRecipientProvider'],[$class: 'CulpritsRecipientProvider']]
		    )
        }
    }

}
