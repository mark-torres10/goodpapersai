#!/bin/bash

# Script to fix Google OAuth authentication issues

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Source the server configuration helper
if [ -f "scripts/server-config.sh" ]; then
  source scripts/server-config.sh
else
  echo -e "${RED}Error: server-config.sh not found. Using fallback method.${NC}"
  
  # Get droplet IP from environment variable or use from .env file
  if [ -z "$DROPLET_IP" ]; then
    if [ -f ".env" ]; then
      DROPLET_IP=$(grep DIGITAL_OCEAN_IP_ADDRESS .env | cut -d'=' -f2)
    fi
    
    # If still not found, prompt user
    if [ -z "$DROPLET_IP" ]; then
      echo -e "${YELLOW}Droplet IP not found in environment or .env file.${NC}"
      read -p "Please enter the droplet IP address: " DROPLET_IP
    fi
  fi
  
  SERVER_IP=$DROPLET_IP
fi

echo -e "${GREEN}Starting OAuth authentication fix on server ${SERVER_IP}...${NC}"

# Copy the updated ecosystem.config.js to the server
echo -e "${YELLOW}Copying updated ecosystem.config.js to server...${NC}"
if type scp_to_server &>/dev/null; then
  scp_to_server "ecosystem.config.js" "/var/www/goodpapers/repo/"
else
  scp -i ~/.ssh/goodpapers_digitalocean ecosystem.config.js root@${SERVER_IP}:/var/www/goodpapers/repo/
fi

# SSH into the server and execute commands
echo -e "${YELLOW}Restarting services with updated configuration...${NC}"
if type ssh_to_server &>/dev/null; then
  ssh_to_server << 'EOF'
cd /var/www/goodpapers/repo

# Ensure we're in the right directory
if [ ! -f ecosystem.config.js ]; then
  echo -e "${RED}Error: ecosystem.config.js not found in the current directory${NC}"
  exit 1
fi

# Make sure the .env file has the correct permissions
chmod 644 .env

# Debug: Show .env file (excluding secrets)
echo "Checking environment variables (excluding secrets):"
grep -v "SECRET\|PASSWORD" .env | grep -v "^$"

# Restart the server with the updated configuration
echo "Restarting PM2 services..."
pm2 delete goodpapers-server || true
pm2 start ecosystem.config.js --only goodpapers-server

# Check if the server started correctly
sleep 3
pm2 status

# Check the logs for any errors
echo "Last 10 lines of server error log:"
tail -n 10 /var/www/goodpapers/logs/server-error.log
EOF
else
  ssh -i ~/.ssh/goodpapers_digitalocean root@${SERVER_IP} << 'EOF'
cd /var/www/goodpapers/repo

# Ensure we're in the right directory
if [ ! -f ecosystem.config.js ]; then
  echo -e "${RED}Error: ecosystem.config.js not found in the current directory${NC}"
  exit 1
fi

# Make sure the .env file has the correct permissions
chmod 644 .env

# Debug: Show .env file (excluding secrets)
echo "Checking environment variables (excluding secrets):"
grep -v "SECRET\|PASSWORD" .env | grep -v "^$"

# Restart the server with the updated configuration
echo "Restarting PM2 services..."
pm2 delete goodpapers-server || true
pm2 start ecosystem.config.js --only goodpapers-server

# Check if the server started correctly
sleep 3
pm2 status

# Check the logs for any errors
echo "Last 10 lines of server error log:"
tail -n 10 /var/www/goodpapers/logs/server-error.log
EOF
fi

echo -e "${GREEN}Authentication fix completed.${NC}"
echo -e "${YELLOW}Check the output above for any errors.${NC}" 