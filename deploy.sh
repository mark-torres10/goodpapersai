#!/bin/bash

# GoodPapers Deployment Script
# This script deploys the GoodPapers application to a production server

# Configuration variables
APP_DIR="/var/www/goodpapers"
REPO_DIR="${APP_DIR}/repo"
LOGS_DIR="${APP_DIR}/logs"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function for logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "${LOGS_DIR}/auto_deploy.log"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "${LOGS_DIR}/auto_deploy.log"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "${LOGS_DIR}/auto_deploy.log"
}

# Ensure log directory exists
mkdir -p "${LOGS_DIR}"

# Step 1: Install dependencies if needed
log "Installing server dependencies..."
cd "${REPO_DIR}" 
# Remove node_modules to ensure clean installation
rm -rf node_modules
npm install --no-fund --no-audit

# Explicitly install required packages for the server
log "Ensuring critical server dependencies are installed..."
npm install express cors axios fast-xml-parser sqlite3 body-parser dotenv --no-fund --no-audit

# Step 2: Install admin site dependencies
log "Installing admin site dependencies..."
cd "${REPO_DIR}/admin" && npm install --legacy-peer-deps --no-fund --no-audit

# Step 3: Build admin site
log "Building admin site..."
cd "${REPO_DIR}/admin" && npm run build

# Step 4: Install frontend dependencies
log "Installing frontend dependencies..."
cd "${REPO_DIR}/goodpapers" && npm install --legacy-peer-deps --no-fund --no-audit

# Step 5: Build frontend
log "Building frontend..."
cd "${REPO_DIR}/goodpapers" && npm run build

# Step 6: Restart services using PM2 ecosystem config
log "Restarting services..."
cd "${REPO_DIR}" && pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

log "Deployment completed!" 
