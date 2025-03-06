#!/bin/bash

# Script to apply authentication fixes on the production server

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Applying authentication fixes for GoodPapers...${NC}"

# Update the code
echo -e "${YELLOW}Pulling latest code from GitHub...${NC}"
git pull

# Install any missing dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
cd goodpapers && npm install && cd ..

# Restart the server
echo -e "${YELLOW}Restarting the application with PM2...${NC}"
pm2 restart ecosystem.config.js

# Check if the server is running
echo -e "${YELLOW}Checking server status...${NC}"
pm2 status

echo -e "${GREEN}Fixes applied! Please test the authentication now.${NC}"
echo -e "${YELLOW}Important: Make sure to update your .env file with real Google OAuth credentials!${NC}"
echo -e "You can run: ${GREEN}nano .env${NC} to edit your environment variables." 