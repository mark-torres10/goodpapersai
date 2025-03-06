#!/bin/bash

# Debug and fix Google OAuth authentication issues

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

echo -e "${GREEN}Starting OAuth authentication debug on server ${SERVER_IP}...${NC}"

# Copy the updated ecosystem.config.js to the server
echo -e "${YELLOW}Copying updated ecosystem.config.js to server...${NC}"
if type scp_to_server &>/dev/null; then
  scp_to_server "ecosystem.config.js" "/var/www/goodpapers/repo/"
else
  scp -i ~/.ssh/goodpapers_digitalocean ecosystem.config.js root@${SERVER_IP}:/var/www/goodpapers/repo/
fi

# SSH into the server and execute commands
echo -e "${YELLOW}Running authentication debug process...${NC}"
if type ssh_to_server &>/dev/null; then
  ssh_to_server "
    cd /var/www/goodpapers/repo
    
    # Ensure we're in the right directory
    if [ ! -f ecosystem.config.js ]; then
      echo -e \"${RED}Error: ecosystem.config.js not found in the current directory${NC}\"
      exit 1
    fi
    
    # Make sure the .env file has the correct permissions
    chmod 644 .env
    
    # Debug: Show .env file (excluding secrets)
    echo 'Checking environment variables (excluding secrets):'
    grep -v \"SECRET\\|PASSWORD\" .env | grep -v \"^$\"
    
    # Print the Google credentials (masked for security)
    echo 'Google Client ID (first/last few chars):'
    GOOGLE_ID=\$(grep GOOGLE_CLIENT_ID .env | cut -d '=' -f2)
    if [ ! -z \"\$GOOGLE_ID\" ]; then
      echo \"\${GOOGLE_ID:0:8}...\${GOOGLE_ID: -8}\"
    else
      echo 'Not found!'
    fi
    
    # Create a test script to verify environment variables
    echo -e \"${YELLOW}Creating env test script...${NC}\"
    cat > test-env.js << 'EOF'
    console.log('Testing environment variables:');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'FOUND' : 'NOT FOUND');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'FOUND' : 'NOT FOUND');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'FOUND' : 'NOT FOUND');
    console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'FOUND' : 'NOT FOUND');
    EOF
    
    # Run the test script with PM2 to check if it can access env vars
    echo -e \"${YELLOW}Testing PM2 environment variable loading...${NC}\"
    pm2 start test-env.js --env-from-file=./.env --no-autorestart
    sleep 2
    pm2 logs test-env --lines 20
    pm2 delete test-env
    
    # Restart the server with the updated configuration
    echo -e \"${YELLOW}Restarting PM2 services with debug mode...${NC}\"
    pm2 delete goodpapers-server || true
    
    # Start the server with explicit environment loading
    DEBUG=* pm2 start server/index.js \\
      --name goodpapers-server \\
      --env-from-file=./.env \\
      --max-memory-restart=300M \\
      --restart-delay=3000 \\
      --max-restarts=10 \\
      --exp-backoff-restart-delay=100 \\
      --no-watch \\
      --merge-logs \\
      --log-date-format='YYYY-MM-DD HH:mm:ss Z' \\
      --time \\
      --error-file=/var/www/goodpapers/logs/server-error.log \\
      --output-file=/var/www/goodpapers/logs/server-out.log
    
    # Check if the server started correctly
    sleep 3
    pm2 status
    
    # Check the logs for any errors
    echo -e \"${YELLOW}Last 20 lines of server output:${NC}\"
    pm2 logs goodpapers-server --lines 20
  "
else
  ssh -i ~/.ssh/goodpapers_digitalocean root@${SERVER_IP} "
    cd /var/www/goodpapers/repo
    
    # Ensure we're in the right directory
    if [ ! -f ecosystem.config.js ]; then
      echo -e \"${RED}Error: ecosystem.config.js not found in the current directory${NC}\"
      exit 1
    fi
    
    # Make sure the .env file has the correct permissions
    chmod 644 .env
    
    # Debug: Show .env file (excluding secrets)
    echo 'Checking environment variables (excluding secrets):'
    grep -v \"SECRET\\|PASSWORD\" .env | grep -v \"^$\"
    
    # Print the Google credentials (masked for security)
    echo 'Google Client ID (first/last few chars):'
    GOOGLE_ID=\$(grep GOOGLE_CLIENT_ID .env | cut -d '=' -f2)
    if [ ! -z \"\$GOOGLE_ID\" ]; then
      echo \"\${GOOGLE_ID:0:8}...\${GOOGLE_ID: -8}\"
    else
      echo 'Not found!'
    fi
    
    # Create a test script to verify environment variables
    echo -e \"${YELLOW}Creating env test script...${NC}\"
    cat > test-env.js << 'EOF'
    console.log('Testing environment variables:');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'FOUND' : 'NOT FOUND');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'FOUND' : 'NOT FOUND');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'FOUND' : 'NOT FOUND');
    console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'FOUND' : 'NOT FOUND');
    EOF
    
    # Run the test script with PM2 to check if it can access env vars
    echo -e \"${YELLOW}Testing PM2 environment variable loading...${NC}\"
    pm2 start test-env.js --env-from-file=./.env --no-autorestart
    sleep 2
    pm2 logs test-env --lines 20
    pm2 delete test-env
    
    # Restart the server with the updated configuration
    echo -e \"${YELLOW}Restarting PM2 services with debug mode...${NC}\"
    pm2 delete goodpapers-server || true
    
    # Start the server with explicit environment loading
    DEBUG=* pm2 start server/index.js \\
      --name goodpapers-server \\
      --env-from-file=./.env \\
      --max-memory-restart=300M \\
      --restart-delay=3000 \\
      --max-restarts=10 \\
      --exp-backoff-restart-delay=100 \\
      --no-watch \\
      --merge-logs \\
      --log-date-format='YYYY-MM-DD HH:mm:ss Z' \\
      --time \\
      --error-file=/var/www/goodpapers/logs/server-error.log \\
      --output-file=/var/www/goodpapers/logs/server-out.log
    
    # Check if the server started correctly
    sleep 3
    pm2 status
    
    # Check the logs for any errors
    echo -e \"${YELLOW}Last 20 lines of server output:${NC}\"
    pm2 logs goodpapers-server --lines 20
  "
fi

echo -e "${GREEN}Authentication debug completed.${NC}"
echo -e "${YELLOW}Check the output above for any errors.${NC}" 