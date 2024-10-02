#!/bin/bash
REPO_NAME="archive-arounddun-20241002"
SECRET_MAP=( \
"infra/master/$REPO_NAME-id,$REPO_NAME-id,general" \
"infra/master/$REPO_NAME-id.pub,$REPO_NAME-id-pub,general" \
"infra/master/kubeconfig.yaml,$REPO_NAME-kube-config,general" \
"infra/master/regcred.yaml,$REPO_NAME-kube-secret,general" \
"infra/master/mongo-connections.json,$REPO_NAME-mongo-connections,general" \
"infra/master/jenkins/.jenkins.conf,$REPO_NAME-jenkins-conf,general" \
"infra/app/values/_common-secret.yaml,$REPO_NAME-common-secret,general" \
"infra/app/values/syrs-secret.yaml,$REPO_NAME-syrs-helm-secret,general" \
)
for SECRET in ${SECRET_MAP[@]}; do
    echo ${SECRET}
done
exit 0