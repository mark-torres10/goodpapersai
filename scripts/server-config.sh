#!/bin/bash

# Server configuration helper script
# This script is meant to be sourced by other scripts

# Function to get the server IP address
get_server_ip() {
  # First try from environment variable
  if [ ! -z "$DROPLET_IP" ]; then
    echo "$DROPLET_IP"
    return 0
  fi
  
  # Then try from .env file
  if [ -f ".env" ]; then
    local ip_from_env=$(grep DIGITAL_OCEAN_IP_ADDRESS .env | cut -d'=' -f2 | tr -d ' ')
    if [ ! -z "$ip_from_env" ]; then
      echo "$ip_from_env"
      return 0
    fi
  fi
  
  # If IP is still not found, check if it's stored in a config file
  if [ -f "server-ip.conf" ]; then
    local ip_from_conf=$(cat server-ip.conf | tr -d ' ')
    if [ ! -z "$ip_from_conf" ]; then
      echo "$ip_from_conf"
      return 0
    fi
  fi
  
  # Prompt user if still not found
  echo "Server IP address not found in any configuration." >&2
  echo "Please enter the server IP address:" >&2
  read -p "> " input_ip
  
  # Store for future use
  echo "$input_ip" > server-ip.conf
  echo "$input_ip"
}

# Function to establish SSH connection with correct key
ssh_to_server() {
  local ip=$(get_server_ip)
  local ssh_key="${SSH_KEY_PATH:-~/.ssh/goodpapers_digitalocean}"
  
  # Ensure the key has correct permissions
  chmod 600 "$ssh_key" 2>/dev/null
  
  ssh -i "$ssh_key" root@"$ip" "$@"
}

# Function to copy files to server
scp_to_server() {
  local source="$1"
  local dest="$2"
  local ip=$(get_server_ip)
  local ssh_key="${SSH_KEY_PATH:-~/.ssh/goodpapers_digitalocean}"
  
  # Ensure the key has correct permissions
  chmod 600 "$ssh_key" 2>/dev/null
  
  scp -i "$ssh_key" "$source" root@"$ip":"$dest"
}

# Function to get server status
server_status() {
  echo "Checking server status..."
  ssh_to_server "pm2 status; echo 'Server disk usage:'; df -h /var/www"
}

# Export server IP as a variable if this script is sourced
export SERVER_IP=$(get_server_ip)

# Only show this message if the script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "Server IP: $SERVER_IP"
  echo "SSH Key: ${SSH_KEY_PATH:-~/.ssh/goodpapers_digitalocean}"
  echo ""
  echo "This script is designed to be sourced by other scripts:"
  echo "  source scripts/server-config.sh"
  echo ""
  echo "Available functions:"
  echo "  get_server_ip      - Returns the server IP address"
  echo "  ssh_to_server      - Establishes SSH connection"
  echo "  scp_to_server      - Copies files to the server"
  echo "  server_status      - Shows server status information"
fi 