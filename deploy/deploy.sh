#!/bin/bash

# GoodPapers Deployment Script
# This script deploys the GoodPapers application to a production server

# Exit on any error
set -e

# Source the environment setup functions
DEPLOY_DIR=$(dirname "$0")
source "$DEPLOY_DIR/env_setup.sh"

# Configuration variables
APP_NAME="goodpapers"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="goodpapersai.com"
NODE_ENV="production"
SERVER_PORT=3001
ADMIN_PORT=3002
FRONTEND_PORT=3000

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

# Step 1: Update system and install dependencies
log "Updating system and installing dependencies..."
apt update
# Skip upgrade to avoid lock issues
# apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx curl git build-essential

# Ensure Node.js is installed
if ! command -v node &> /dev/null; then
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Step 2: Create application directory
log "Creating application directory..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs

# Step 3: Copy files
log "Copying files to application directory..."
mkdir -p $APP_DIR/repo
cp -r /root/goodpapers-deploy/* $APP_DIR/repo/

# Ensure the deploy directory exists on the server
mkdir -p $APP_DIR/repo/deploy

# Step 4: Install dependencies and build the application
log "Installing server dependencies..."
cd $APP_DIR/repo
npm install --production --legacy-peer-deps

log "Installing frontend dependencies..."
cd $APP_DIR/repo/goodpapers
npm install --production --legacy-peer-deps
# Install serve for static file serving
npm install -g serve

# Create temporary build environment
create_build_env "$APP_DIR/repo/goodpapers"

# Run build with CI=false to ignore warnings
CI=false npm run build

log "Installing admin dependencies..."
cd $APP_DIR/repo/admin
npm install --production --legacy-peer-deps

# Create temporary build environment
create_build_env "$APP_DIR/repo/admin"

# Apply custom schema for admin to fix relationship issues
apply_custom_schema "$APP_DIR/repo/admin" "$APP_DIR/repo/deploy"

# Run build with CI=false to ignore warnings
NODE_ENV=production CI=false npm run build

# Step 5: Create environment files
log "Creating environment files..."
cd $APP_DIR/repo

# Main .env file
cat > .env << EOL
PORT=$SERVER_PORT
NODE_ENV=$NODE_ENV
EOL

# Create admin environment with secrets
create_admin_env "$APP_DIR/repo/admin"

# Step 6: Set up process manager (PM2)
log "Setting up process manager..."
npm install -g pm2

# Create PM2 configuration
create_pm2_config "$APP_DIR" "$APP_NAME" "$NODE_ENV" "$SERVER_PORT" "$ADMIN_PORT" "$FRONTEND_PORT"

# Start the applications
log "Starting applications with PM2..."
pm2 start $APP_DIR/ecosystem.config.js
pm2 save
pm2 startup

# Step 7: Configure NGINX
log "Configuring NGINX..."
create_nginx_config "$DOMAIN" "$FRONTEND_PORT" "$SERVER_PORT" "$ADMIN_PORT"

# Test NGINX configuration
nginx -t

# Restart NGINX
systemctl restart nginx

# Step 8: Set up SSL certificate
log "Setting up SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email markptorres1@gmail.com

# Step 9: Set up firewall
log "Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow ssh
ufw --force enable

log "Deployment complete! Your application is now running at https://$DOMAIN"
log "Admin interface is available at https://$DOMAIN/admin"
log "API is available at https://$DOMAIN/api"

# Display Keystone admin credentials
cd "$APP_DIR/repo/admin"
ADMIN_PW=$(grep KEYSTONE_ADMIN_PW .env | cut -d = -f2)
log "Keystone admin username: admin"
log "Keystone admin password: $ADMIN_PW" 