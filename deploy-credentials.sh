#!/bin/bash

# Deploy OAuth credentials to production server

# Source the server configuration helper
if [ -f "scripts/server-config.sh" ]; then
  source scripts/server-config.sh
else
  echo "Error: server-config.sh not found. Using fallback method."
  
  # Get droplet IP from environment variable or use from .env file
  if [ -z "$DROPLET_IP" ]; then
    if [ -f ".env" ]; then
      DROPLET_IP=$(grep DIGITAL_OCEAN_IP_ADDRESS .env | cut -d'=' -f2)
    fi
    
    # If still not found, prompt user
    if [ -z "$DROPLET_IP" ]; then
      echo "Droplet IP not found in environment or .env file."
      read -p "Please enter the droplet IP address: " DROPLET_IP
    fi
  fi
  
  SERVER_IP=$DROPLET_IP
fi

echo "Using server IP: $SERVER_IP"

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found in current directory"
  exit 1
fi

echo "Reading credentials from local .env file..."

# Extract credentials from .env file
GOOGLE_CLIENT_ID=$(grep GOOGLE_CLIENT_ID .env | cut -d '=' -f2)
GOOGLE_CLIENT_SECRET=$(grep GOOGLE_CLIENT_SECRET .env | cut -d '=' -f2)
JWT_SECRET=$(grep JWT_SECRET .env | cut -d '=' -f2)
SESSION_SECRET=$(grep SESSION_SECRET .env | cut -d '=' -f2)

# Verify credentials were found
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "Error: Could not find Google OAuth credentials in .env file"
  exit 1
fi

# Create a temporary file with the credentials
cat > temp_env_update.txt << EOL
# Google OAuth credentials
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# JWT and Session Secrets
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
EOL

echo "Deploying OAuth credentials to production server..."
if type scp_to_server &>/dev/null; then
  scp_to_server "temp_env_update.txt" "/tmp/env_update.txt"
else
  scp -i ~/.ssh/goodpapers_digitalocean temp_env_update.txt root@${SERVER_IP}:/tmp/env_update.txt
fi

echo "Updating .env file on the server..."
if type ssh_to_server &>/dev/null; then
  ssh_to_server "
    cd /var/www/goodpapers/repo
    grep -v 'GOOGLE_CLIENT\\|JWT_SECRET\\|SESSION_SECRET' .env > .env.new
    cat /tmp/env_update.txt >> .env.new
    mv .env.new .env
    rm /tmp/env_update.txt
    
    # Restart services
    echo 'Restarting services...'
    pm2 delete all
    pm2 start ecosystem.config.js
    pm2 save
    
    # Check services status
    echo 'Service status:'
    pm2 status
  "
else
  ssh -i ~/.ssh/goodpapers_digitalocean root@${SERVER_IP} "
    cd /var/www/goodpapers/repo
    grep -v 'GOOGLE_CLIENT\\|JWT_SECRET\\|SESSION_SECRET' .env > .env.new
    cat /tmp/env_update.txt >> .env.new
    mv .env.new .env
    rm /tmp/env_update.txt
    
    # Restart services
    echo 'Restarting services...'
    pm2 delete all
    pm2 start ecosystem.config.js
    pm2 save
    
    # Check services status
    echo 'Service status:'
    pm2 status
  "
fi

# Clean up local temp file
rm temp_env_update.txt

echo "Credentials deployed and services restarted!" 