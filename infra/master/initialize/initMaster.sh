#!/bin/bash

HOST_NAME=$(cat /etc/hostname)
USER=$(whoami)
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
sudo apt-get install -y nodejs && sudo apt-get install -y build-essential
sudo add-apt-repository universe && sudo apt update && sudo apt install -y python2-minimal
mkdir ~/.npm-global && npm config set prefix '~/.npm-global' && export PATH=~/.npm-global/bin:$PATH && source ~/.profile
sudo snap install docker && sudo groupadd docker && sudo chown root:docker /var/run/docker.sock && sudo usermod -aG docker $USER && newgrp docker
npm i -g nx ts-node cross-env pnpm
sudo ufw disable
sudo apt update
sudo apt install -y nfs-common dnsutils curl snapd
sudo snap install kubectl --classic
sudo snap install helm --classic
sudo snap install kubectx --classic

# For Master
curl -sfL https://get.k3s.io | sh -s - --disable traefik server --cluster-init --tls-san *.akamir.com
mkdir ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown -R $(id -u):$(id -g) ~/.kube
echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc
source ~/.bashrc
MASTER_IP=$(kubectl get node $HOST_NAME -ojsonpath="{.status.addresses[0].address}")
NODE_TOKEN=$(sudo cat /var/lib/rancher/k3s/server/node-token)

echo $MASTER_IP
echo $NODE_TOKEN