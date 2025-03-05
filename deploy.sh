#!/bin/bash

# GoodPapers Deployment Script
# This script deploys the GoodPapers application to a production server

# Configuration variables
SERVER_IP="161.35.180.213"
SSH_KEY="~/.ssh/goodpapers_digitalocean"
DEPLOY_DIR="/root/goodpapers-deploy"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function for logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Step 1: Ensure the deploy directory exists on the server
log "Ensuring deployment directory exists on server..."
ssh -i $SSH_KEY root@$SERVER_IP "mkdir -p $DEPLOY_DIR"
ssh -i $SSH_KEY root@$SERVER_IP "mkdir -p $DEPLOY_DIR/deploy"

# Step 2: Copy deployment files
log "Copying deployment files to server..."
rsync -avz -e "ssh -i $SSH_KEY" . root@$SERVER_IP:$DEPLOY_DIR/ --exclude node_modules --exclude .git --exclude admin/node_modules --exclude goodpapers/node_modules --exclude goodpapers/build

# Step 3: Explicitly copy deployment directory contents
log "Copying deployment scripts and configuration..."
rsync -avz -e "ssh -i $SSH_KEY" deploy/ root@$SERVER_IP:$DEPLOY_DIR/deploy/

# Step 4: Make scripts executable on the server
log "Making deployment scripts executable..."
ssh -i $SSH_KEY root@$SERVER_IP "chmod +x $DEPLOY_DIR/deploy/deploy.sh $DEPLOY_DIR/deploy/env_setup.sh"

# Step 5: Execute the deploy script on the server
log "Executing deployment script on server..."
ssh -i $SSH_KEY root@$SERVER_IP "cd $DEPLOY_DIR && bash deploy/deploy.sh"

log "Deployment completed!" 
