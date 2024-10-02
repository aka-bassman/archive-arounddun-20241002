pipeline {
    agent any
    environment {
        BRANCH = "$env.BRANCH_NAME".replace("-canary", "")
        BUILD_CONF = credentials("archive-arounddun-20241002-jenkins-conf")
        KUBE_SECRET = credentials("archive-arounddun-20241002-kube-secret")
        KUBE_CONFIG = credentials("archive-arounddun-20241002-kube-config")
        COMMON_SECRET = credentials("archive-arounddun-20241002-common-secret")
        SSH_KEY = credentials("archive-arounddun-20241002-id")
        ALL_PROJECTS = "syrs"
        ALL_LIBS="shared,util,social"
        TEST_LIBS="util,shared"
    }
    stages {
        stage("Boot"){
            steps{
                sh "cp $BUILD_CONF .jenkins.conf"
                load ".jenkins.conf"
                discordSend description: "Build Start - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
                sh "tar --exclude=.git -cvf codebase.tar ./"
            }
        }
        stage("Prepare"){
            parallel{
                stage("Prepare Master"){
                    steps{
                        sh "ssh -o StrictHostKeyChecking=no -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"mkdir -p $REPO_NAME/$BRANCH/node_modules && touch $REPO_NAME/$BRANCH/dummy.js\""
                        sh "ssh -i $SSH_KEY -p $MASTER_PORT $MASTER_USER@$MASTER_HOST \"cd $REPO_NAME/$BRANCH && find . -maxdepth 1 ! -path . ! \\( -name node_modules -or -name pnpm-lock.yaml -or -name dist -or -name .git \\) -print0 | xargs -0 rm -r\""
                        sh "scp -i $SSH_KEY -P $MASTER_PORT codebase.tar $MASTER_USER@$MASTER_HOST:~/$REPO_NAME/$BRANCH/codebase.tar"
                        sh "ssh -i $SSH_KEY -p $MASTER_PORT $MASTER_USER@$MASTER_HOST \"cd $REPO_NAME/$BRANCH && tar -xvf codebase.tar\""
                        sh "scp -i $SSH_KEY -P $MASTER_PORT $KUBE_SECRET $MASTER_USER@$MASTER_HOST:~/$REPO_NAME/$BRANCH/infra/master/regcred.yaml"
                        sh "scp -i $SSH_KEY -P $MASTER_PORT $COMMON_SECRET $MASTER_USER@$MASTER_HOST:~/$REPO_NAME/$BRANCH/infra/app/values/_common-secret.yaml"
                        script {
                            ALL_PROJECTS.tokenize(",").each { app -> 
                                sh "scp -i $SSH_KEY -P $MASTER_PORT $KUBE_CONFIG $MASTER_USER@$MASTER_HOST:~/$REPO_NAME/$BRANCH/infra/master/${app}.yaml"
                                withCredentials([file(credentialsId: "$REPO_NAME-$app-helm-secret", variable: "SECRET")]) {
                                    sh "scp -i $SSH_KEY -P $MASTER_PORT $SECRET $MASTER_USER@$MASTER_HOST:~/$REPO_NAME/$BRANCH/infra/app/values/$app-secret.yaml"
                                }
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra/master && chmod 777 ${app}.yaml && kubectl config use-context $app --kubeconfig ${app}.yaml\""
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra/master && kubectl get ns $app-$BRANCH --kubeconfig ${app}.yaml || kubectl create ns $app-$BRANCH --kubeconfig ${app}.yaml\""
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra/master && (kubectl delete -f regcred.yaml -n $app-$BRANCH --kubeconfig ${app}.yaml || true) && kubectl apply -f regcred.yaml -n $app-$BRANCH --kubeconfig ${app}.yaml\""
                            }
                        }
                    }
                }
                stage("Prepare Build"){
                    steps{
                        sh "ssh -i $SSH_KEY -o StrictHostKeyChecking=no $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"mkdir -p $REPO_NAME/$BRANCH/node_modules && mkdir -p $REPO_NAME/$BRANCH/dist && touch $REPO_NAME/$BRANCH/dummy.js && chmod -R 777 $REPO_NAME/$BRANCH/dist \""
                        sh "ssh -i $SSH_KEY -p $BUILD_PORT $BUILD_USER@$BUILD_HOST \"cd $REPO_NAME/$BRANCH && find . -maxdepth 1 ! -path . ! \\( -name node_modules -or -name package-lock.json -or -name dist -or -name .git \\) -print0 | xargs -0 rm -r\""
                        sh "scp -i $SSH_KEY -P $BUILD_PORT codebase.tar $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/codebase.tar"
                        sh "ssh -i $SSH_KEY -p $BUILD_PORT $BUILD_USER@$BUILD_HOST \"cd $REPO_NAME/$BRANCH && tar -xvf codebase.tar\""
                        script {
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && npx pnpm install -w --frozen-lockfile\""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && npx pnpm nx repair\""
                            PROJECTS = ALL_PROJECTS.tokenize(",");
                            ALL_PROJECTS.tokenize(",").each { app -> 
                                withCredentials([file(credentialsId: "$REPO_NAME-$app-server-env-$BRANCH", variable: "ENV")]) {
                                    sh "scp -i $SSH_KEY -P $BUILD_PORT $ENV $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/apps/$app/env/env.server.ts"        
                                }
                                withCredentials([file(credentialsId: "$REPO_NAME-$app-server-env-testing", variable: "ENV")]) {
                                    sh "scp -i $SSH_KEY -P $BUILD_PORT $ENV $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/apps/$app/env/env.server.testing.ts"        
                                }
                                withCredentials([file(credentialsId: "$REPO_NAME-$app-client-env-$BRANCH", variable: "ENV")]) {
                                    sh "scp -i $SSH_KEY -P $BUILD_PORT $ENV $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/apps/$app/env/env.client.ts"
                                }
                                withCredentials([file(credentialsId: "$REPO_NAME-$app-client-env-testing", variable: "ENV")]) {
                                    sh "scp -i $SSH_KEY -P $BUILD_PORT $ENV $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/apps/$app/env/env.client.testing.ts"
                                }
                            }
                            ALL_LIBS.tokenize(",").each { lib -> 
                                withCredentials([file(credentialsId: "$REPO_NAME-$lib-server-env-testing", variable: "ENV")]) {
                                    sh "ssh -i $SSH_KEY -p $BUILD_PORT $BUILD_USER@$BUILD_HOST \"mkdir -p ~/$REPO_NAME/$BRANCH/libs/$lib/env\""
                                    sh "scp -i $SSH_KEY -P $BUILD_PORT $ENV $BUILD_USER@$BUILD_HOST:~/$REPO_NAME/$BRANCH/libs/$lib/env/env.server.testing.ts"
                                }
                            }
                        }
                    }
                }
            }
        }
        stage("Build"){
            steps {
                script {
                    BUILD_PROJECTS = PROJECTS.join(",");
                    if(BUILD_PROJECTS.length() >=1) {
                        sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && npx pnpm nx run-many --target=build-backend,build-frontend --parallel=8 --projects=$BUILD_PROJECTS --nxBail --environment=$BRANCH\""
                    }
                }
            }
        }
        // stage("Test"){
        //     steps {
        //         script {
        //             TESTS = ALL_PROJECTS.tokenize(",") + TEST_LIBS.tokenize(",");
        //             TEST_PROJECTS = TESTS.join(",");
        //             if(TESTS.size() >= 1) {
        //                 sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && npx pnpm nx run-many --target=test --parallel=3 --projects=$TEST_PROJECTS --nxBail\""
        //             }
        //         }
        //     }
        // }
        stage("Dockerize"){
            steps {
                script {
                    def dockerizes = [:]
                    def maxConcurrentJobs = 6
                    PROJECTS.each { app -> 
                        dockerizes["$app-backend"] = {
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && mkdir -p ./dist/apps/$app/backend \""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH/dist/apps/$app/backend && docker build . -t $REG_URL/$REPO_NAME/$app/backend:$BRANCH-$env.BUILD_NUMBER\" --label=\"repo=$REPO_NAME\" --label=\"branch=$BRANCH\" --label=\"buildNum=$env.BUILD_NUMBER\""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"docker image tag $REG_URL/$REPO_NAME/$app/backend:$BRANCH-$env.BUILD_NUMBER $REG_URL/$REPO_NAME/$app/backend:$BRANCH-live\""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"docker push $REG_URL/$REPO_NAME/$app/backend:$BRANCH-live\""
                        }
                        dockerizes["$app-frontend"] = {
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH && mkdir -p ./dist/apps/$app/frontend && rm -rf ./dist/apps/$app/frontend/.next/cache \""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH/dist/apps/$app/frontend && docker build . -t $REG_URL/$REPO_NAME/$app/frontend:$BRANCH-$env.BUILD_NUMBER\" --label=\"repo=$REPO_NAME\" --label=\"branch=$BRANCH\" --label=\"buildNum=$env.BUILD_NUMBER\""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"docker image tag $REG_URL/$REPO_NAME/$app/frontend:$BRANCH-$env.BUILD_NUMBER $REG_URL/$REPO_NAME/$app/frontend:$BRANCH-live\""
                            sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"docker push $REG_URL/$REPO_NAME/$app/frontend:$BRANCH-live\""
                        }
                    }
                    def totalJobs = dockerizes.size()
                    def totalBranches = totalJobs / maxConcurrentJobs
                    def jobNames = dockerizes.keySet()
                    def jobPlans = dockerizes.values()
                    for (int branch = 0; branch < totalBranches; branch++) {
                        def start = branch * maxConcurrentJobs
                        def end = ((branch + 1) * maxConcurrentJobs < totalJobs ? (branch + 1) * maxConcurrentJobs : totalJobs) - 1
                        def jobs = [:]
                        (start..end).each { index ->
                            jobs[jobNames[index]] = jobPlans[index]
                        }
                        parallel jobs
                    }
                }
            }
        }
        stage("Deploy"){
            steps {
                script {
                    def deploys = [:]
                    def maxConcurrentJobs = 8
                    ALL_PROJECTS.tokenize(",").each { app -> 
                        if((PROJECTS).contains(app)) {
                            deploys[app] = {
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra && helm upgrade app ./app/ -f app/values/_common-values.yaml -f app/values/_common-secret.yaml -f app/values/$app-values.yaml -f app/values/$app-secret.yaml -i --create-namespace -n $app-$BRANCH --kubeconfig master/${app}.yaml\""
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra && kubectl rollout restart deployments/backend-federation-deployment -n $app-$BRANCH --kubeconfig master/${app}.yaml\""
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra && kubectl rollout restart deployments/backend-batch-deployment -n $app-$BRANCH --kubeconfig master/${app}.yaml\""
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra && kubectl rollout restart deployments/frontend-deployment -n $app-$BRANCH --kubeconfig master/${app}.yaml\""
                            }
                        } else {
                            deploys[app] = {
                                sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra && kubectl apply -f $BRANCH/${app}.yaml -n $app-$BRANCH --kubeconfig master/${app}.yaml\""
                            }
                        }
                    }
                    def totalJobs = deploys.size()
                    def totalBranches = totalJobs / maxConcurrentJobs
                    def jobNames = deploys.keySet()
                    def jobPlans = deploys.values()
                    for (int branch = 0; branch < totalBranches; branch++) {
                        def start = branch * maxConcurrentJobs
                        def end = ((branch + 1) * maxConcurrentJobs < totalJobs ? (branch + 1) * maxConcurrentJobs : totalJobs) - 1
                        def jobs = [:]
                        (start..end).each { index ->
                            jobs[jobNames[index]] = jobPlans[index]
                        }
                        parallel jobs
                    }
                }
            }
        }
        stage("Cleanup"){
            parallel {
                stage("Clean Master Registry"){
                    steps{
                        sh "ssh -i $SSH_KEY $MASTER_USER@$MASTER_HOST -p $MASTER_PORT \"cd $REPO_NAME/$BRANCH/infra/master/registry && chmod +x cleanup-registry.sh && ./cleanup-registry.sh\""
                    }
                }
                stage("Clean Build Registry"){
                    steps {
                        sh "ssh -i $SSH_KEY $BUILD_USER@$BUILD_HOST -p $BUILD_PORT \"cd $REPO_NAME/$BRANCH/infra/master/registry && chmod +x cleanup-agent.sh && ./cleanup-agent.sh $REG_URL/$REPO_NAME $BRANCH $env.BUILD_NUMBER\""
                    }
                }
            }
        }
    }
    post {
        failure {
            sh "echo 'Build Failed - $env.JOB_NAME $env.BUILD_NUMBER'"
            discordSend description: "Build Failed - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        success {
            script {
                discordSend description: "Build Succeed - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
                if(BRANCH != "debug" && env.GIT_PREVIOUS_SUCCESSFUL_COMMIT != null) {
                    def commit_messages = sh(script: "git log $env.GIT_PREVIOUS_SUCCESSFUL_COMMIT..HEAD --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cD) %C(bold blue)<%an>%Creset'", returnStdout: true)
                    commit_messages = commit_messages.trim().replaceAll("\\n", "\n")
                    discordSend title: "$env.JOB_NAME:$env.BUILD_NUMBER 빌드 배포 완료", description: commit_messages, result: currentBuild.currentResult, customUsername: "Archive-arounddun-20241002 Update", customAvatarUrl: "https://media.discordapp.net/stickers/952935228865933363.png", webhookURL: env.DISCORD_PUBLIC_WEBHOOK
                }
            }
        }
    }
}
