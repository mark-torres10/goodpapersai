# Server Configuration for GoodPapers

This document explains how server configuration is managed in the GoodPapers application, with a specific focus on eliminating hardcoded IP addresses and credentials.

## Server Configuration Helper

The project includes a centralized server configuration helper (`scripts/server-config.sh`) that provides consistent access to server details across all deployment and maintenance scripts.

### Key Features

- **No hardcoded IP addresses** - Server IP is obtained from multiple fallback sources
- **Consistent SSH/SCP access** - Standardized functions for server access
- **Secure credential handling** - Environment variables instead of hardcoded values
- **User-friendly prompts** - Interactive input when configuration is missing

## Using the Helper

To use the server configuration helper in your scripts:

```bash
# Source the configuration helper
source scripts/server-config.sh

# Now you have access to these variables and functions:
echo "Server IP: $SERVER_IP"

# Use these functions for consistent server access
ssh_to_server "your command here"
scp_to_server "local/file.txt" "/remote/path/file.txt"
server_status
```

## IP Address Resolution

The helper uses the following order to determine the server IP address:

1. Environment variable `DROPLET_IP`
2. Entry in `.env` file (DIGITAL_OCEAN_IP_ADDRESS=xxx.xxx.xxx.xxx)
3. Previously stored value in `server-ip.conf`
4. Interactive prompt if none of the above sources are available

## Configuration Files

The project uses several configuration files:

- `.env` - Primary environment variables including server IP and credentials
- `server-ip.conf` - Simple text file with just the IP address (created if needed)
- `ecosystem.config.js` - PM2 process manager configuration

## Scripts Using This Configuration

The following scripts use the server configuration helper:

- `fix-auth.sh` - Fixes authentication issues on the server
- `deploy-credentials.sh` - Deploys OAuth credentials to the server

## Best Practices

1. **Never hardcode IP addresses or credentials** in scripts or configuration files that are committed to the repository
2. **Always use the server-config.sh helper** when writing new deployment or maintenance scripts
3. **Store sensitive information** in environment variables or the `.env` file (excluded from Git)
4. **Create user-friendly fallbacks** when configuration is missing

## Adding New Server Scripts

When creating new scripts that need to interact with the server:

1. Source the server configuration helper at the beginning of your script
2. Use the provided functions instead of direct SSH/SCP commands
3. Handle graceful fallbacks if the helper isn't available
4. Add documentation for your script in this file

## Configuration Templates

For reference, here are the expected formats for configuration files:

### .env
```
DIGITAL_OCEAN_IP_ADDRESS=xxx.xxx.xxx.xxx
DIGITAL_OCEAN_PERSONAL_ACCESS_TOKEN=your_token_here
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### server-ip.conf
```
xxx.xxx.xxx.xxx
``` 