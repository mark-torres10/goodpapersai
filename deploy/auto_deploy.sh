#!/bin/bash

# Auto-deployment script for GoodPapers
# This script pulls the latest code from the main branch and deploys it

set -e

# Configuration
APP_DIR="/var/www/goodpapers"
REPO_DIR="$APP_DIR/repo"
LOG_FILE="$APP_DIR/logs/auto_deploy.log"

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Ensure log directory exists
mkdir -p "$APP_DIR/logs"

log "Starting auto-deployment process"

# Initialize Git repository if not already done
if [ ! -d "$REPO_DIR/.git" ]; then
  log "Git repository not found in $REPO_DIR. Initializing..."
  # Check if the repo directory exists but is not a git repo
  if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR"
    git init
    git remote add origin https://github.com/mark-torres10/goodpapersai.git
  else
    # Directory doesn't exist, clone the repo
    log "Creating repository directory and cloning from GitHub..."
    mkdir -p "$REPO_DIR"
    cd "$REPO_DIR"
    git clone https://github.com/mark-torres10/goodpapersai.git .
  fi
else
  # Pull the latest changes
  log "Pulling latest changes from main branch"
  cd "$REPO_DIR"
  git fetch --all
  git reset --hard origin/main
fi

# Run the deployment script
log "Running deployment script"
cd "$REPO_DIR"
# Make sure the deploy script is executable
chmod +x deploy/deploy.sh
bash deploy/deploy.sh

# Restart PM2 services
log "Restarting services"
pm2 reload all

log "Auto-deployment completed successfully" 