#!/bin/bash

APPS=$1
if [ -z "$APPS" ]
then
    echo "APPS should be passed as arguments (ex. akamir)"
    exit 1
fi

# namespaces
IFS=',' read -ra apps <<< $APPS
for app in ${apps[@]}
do
    kubectl delete mongodbcommunity mongo -n $app-debug
    kubectl delete mongodbcommunity mongo -n $app-develop
    kubectl delete mongodbcommunity mongo -n $app-main
    kubectl delete statefulset redis -n $app-debug
    kubectl delete statefulset redis -n $app-develop
    kubectl delete statefulset redis -n $app-main
    kubectl delete pvc --all -n $app-debug
    kubectl delete pvc --all -n $app-develop
    kubectl delete pvc --all -n $app-main
    kubectl delete all --all -n $app-debug
    kubectl delete all --all -n $app-develop
    kubectl delete all --all -n $app-main
    kubectl delete pv $app-debug-mongo-data-volume-0
    kubectl delete pv $app-debug-mongo-logs-volume-0
    kubectl delete pv $app-debug-redis-claim-volume-0
    kubectl delete pv $app-debug-redis-data-volume-0
    kubectl delete pv $app-debug-meili-data-volume-0
    kubectl delete pv $app-develop-mongo-data-volume-0
    kubectl delete pv $app-develop-mongo-logs-volume-0
    kubectl delete pv $app-develop-redis-claim-volume-0
    kubectl delete pv $app-develop-redis-data-volume-0
    kubectl delete pv $app-develop-meili-data-volume-0
    kubectl delete pv $app-main-mongo-data-volume-0
    kubectl delete pv $app-main-mongo-logs-volume-0
    kubectl delete pv $app-main-redis-claim-volume-0
    kubectl delete pv $app-main-redis-data-volume-0
    kubectl delete pv $app-main-meili-data-volume-0
    kubectl delete ns $app-debug
    kubectl delete ns $app-develop
    kubectl delete ns $app-main
done