#!/bin/bash

MASTER_IP=$1
NODE_TOKEN=$2
if [ -z "$MASTER_IP" or -z "$NODE_TOKEN" ]
then
    echo "MASTER_IP and NODE_Token should be passed as arguments"
    exit 1
fi

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
# For Master
curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$NODE_TOKEN sh -s -
