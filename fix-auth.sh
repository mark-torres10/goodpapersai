#!/bin/bash

# Fix Google OAuth authentication issues

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

# First, copy the updated files to the server
echo -e "${YELLOW}Copying updated files to server...${NC}"

if type scp_to_server &>/dev/null; then
  scp_to_server "ecosystem.config.js" "/var/www/goodpapers/repo/"
  scp_to_server "server/auth.js" "/var/www/goodpapers/repo/server/"
else
  scp -i ~/.ssh/goodpapers_digitalocean ecosystem.config.js root@${SERVER_IP}:/var/www/goodpapers/repo/
  scp -i ~/.ssh/goodpapers_digitalocean server/auth.js root@${SERVER_IP}:/var/www/goodpapers/repo/server/
fi

# SSH into the server and execute commands
echo -e "${YELLOW}Running authentication fix process...${NC}"
if type ssh_to_server &>/dev/null; then
  ssh_to_server "
    cd /var/www/goodpapers/repo
    
    # Install dotenv if it's not already installed
    npm list dotenv || npm install dotenv --save
    
    # Ensure we're in the right directory
    if [ ! -f ecosystem.config.js ]; then
      echo -e \"${RED}Error: ecosystem.config.js not found in the current directory${NC}\"
      exit 1
    fi
    
    # Make sure the .env file has the correct permissions
    chmod 644 .env
    
    # Temporarily move .env to root directory where PM2 will look for it
    cp .env .env.backup
    
    # Explicitly set environment variables in the PM2 configuration
    echo -e \"${YELLOW}Creating direct PM2 config with environment variables...${NC}\"
    cat > ecosystem.direct.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'goodpapers-server',
      script: 'server/index.js',
      max_memory_restart: '300M',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        GOOGLE_CLIENT_ID: '$(grep GOOGLE_CLIENT_ID .env | cut -d'=' -f2)',
        GOOGLE_CLIENT_SECRET: '$(grep GOOGLE_CLIENT_SECRET .env | cut -d'=' -f2)',
        JWT_SECRET: '$(grep JWT_SECRET .env | cut -d'=' -f2 || echo \"goodpapers-jwt-secret-key\")',
        SESSION_SECRET: '$(grep SESSION_SECRET .env | cut -d'=' -f2 || echo \"goodpapers-session-secret\")'
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/server-error.log\",
      out_file: \"/var/www/goodpapers/logs/server-out.log\"
    },
    {
      name: 'goodpapers-admin',
      script: 'npm',
      args: 'start',
      cwd: './admin',
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/admin-error.log\",
      out_file: \"/var/www/goodpapers/logs/admin-out.log\"
    },
    {
      name: 'goodpapers-frontend-serve',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: './goodpapers',
      max_memory_restart: '300M',
      restart_delay: 3000,
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/frontend-error.log\",
      out_file: \"/var/www/goodpapers/logs/frontend-out.log\"
    }
  ]
};
EOF
    
    # Restart the server with the direct environment config
    echo -e \"${YELLOW}Restarting PM2 services...${NC}\"
    pm2 delete goodpapers-server || true
    pm2 start ecosystem.direct.config.js
    
    # Check if the server started correctly
    sleep 3
    pm2 status
    
    # Check the logs for any errors
    echo -e \"${YELLOW}Checking server logs for errors...${NC}\"
    tail -n 20 /var/www/goodpapers/logs/server-error.log
    echo -e \"${YELLOW}Checking server output logs...${NC}\"
    tail -n 20 /var/www/goodpapers/logs/server-out.log
  "
else
  ssh -i ~/.ssh/goodpapers_digitalocean root@${SERVER_IP} "
    cd /var/www/goodpapers/repo
    
    # Install dotenv if it's not already installed
    npm list dotenv || npm install dotenv --save
    
    # Ensure we're in the right directory
    if [ ! -f ecosystem.config.js ]; then
      echo -e \"${RED}Error: ecosystem.config.js not found in the current directory${NC}\"
      exit 1
    fi
    
    # Make sure the .env file has the correct permissions
    chmod 644 .env
    
    # Temporarily move .env to root directory where PM2 will look for it
    cp .env .env.backup
    
    # Explicitly set environment variables in the PM2 configuration
    echo -e \"${YELLOW}Creating direct PM2 config with environment variables...${NC}\"
    cat > ecosystem.direct.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'goodpapers-server',
      script: 'server/index.js',
      max_memory_restart: '300M',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        GOOGLE_CLIENT_ID: '$(grep GOOGLE_CLIENT_ID .env | cut -d'=' -f2)',
        GOOGLE_CLIENT_SECRET: '$(grep GOOGLE_CLIENT_SECRET .env | cut -d'=' -f2)',
        JWT_SECRET: '$(grep JWT_SECRET .env | cut -d'=' -f2 || echo \"goodpapers-jwt-secret-key\")',
        SESSION_SECRET: '$(grep SESSION_SECRET .env | cut -d'=' -f2 || echo \"goodpapers-session-secret\")'
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/server-error.log\",
      out_file: \"/var/www/goodpapers/logs/server-out.log\"
    },
    {
      name: 'goodpapers-admin',
      script: 'npm',
      args: 'start',
      cwd: './admin',
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/admin-error.log\",
      out_file: \"/var/www/goodpapers/logs/admin-out.log\"
    },
    {
      name: 'goodpapers-frontend-serve',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: './goodpapers',
      max_memory_restart: '300M',
      restart_delay: 3000,
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: \"/var/www/goodpapers/logs/frontend-error.log\",
      out_file: \"/var/www/goodpapers/logs/frontend-out.log\"
    }
  ]
};
EOF
    
    # Restart the server with the direct environment config
    echo -e \"${YELLOW}Restarting PM2 services...${NC}\"
    pm2 delete goodpapers-server || true
    pm2 start ecosystem.direct.config.js
    
    # Check if the server started correctly
    sleep 3
    pm2 status
    
    # Check the logs for any errors
    echo -e \"${YELLOW}Checking server logs for errors...${NC}\"
    tail -n 20 /var/www/goodpapers/logs/server-error.log
    echo -e \"${YELLOW}Checking server output logs...${NC}\"
    tail -n 20 /var/www/goodpapers/logs/server-out.log
  "
fi

echo -e "${GREEN}Authentication fix completed.${NC}"
echo -e "${YELLOW}Check the output above for any errors.${NC}"
echo -e "${GREEN}You can now try to log in using Google authentication.${NC}" 