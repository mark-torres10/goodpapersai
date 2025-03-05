# GoodPapers Deployment

This directory contains scripts and configuration files for deploying the GoodPapers application to a production server.

## Structure

- `deploy.sh` - Main deployment script (in the project root)
- `deploy/` - Directory containing all deployment-related files
  - `deploy_schema.ts` - Simplified Keystone schema for production
  - `env_setup.sh` - Utility functions for environment setup
  - `deploy.sh` - Server-side deployment script

## Deployment Process

The deployment process is organized into two parts:

1. **Local execution** - Run the main `deploy.sh` script from your local machine
2. **Server execution** - The server-side `deploy/deploy.sh` script that is executed on the remote server

### How to Deploy

1. Make sure your SSH key for the server is properly set up at `~/.ssh/goodpapers_digitalocean`
2. Update any configuration if needed (server IP, domain name, etc.)
3. Run the deployment script from the project root:

```bash
./deploy.sh
```

This will:
- Copy all project files to the server
- Execute the server-side deployment script
- Set up the environment, install dependencies, and start the services

### Server Configuration

The server-side script handles:

- Installing necessary software (Node.js, Nginx, Certbot)
- Setting up the application directory
- Installing dependencies
- Building the application components (frontend, admin, server)
- Configuring Nginx as a reverse proxy
- Setting up SSL with Certbot
- Configuring the firewall
- Starting the application with PM2

## Customizing the Deployment

If you need to customize the deployment process:

1. Edit the utility functions in `env_setup.sh`
2. Modify the schema in `deploy_schema.ts` if database schema changes
3. Update the server-side `deploy.sh` script for different installation steps
4. Adjust the main `deploy.sh` script for different deployment targets

## Troubleshooting

Common issues and solutions:

- **Schema conflicts**: The simplified schema in `deploy_schema.ts` fixes relationship issues that may occur during build
- **Build errors**: Environment variables in `.env` are set to skip type checking and ignore ESLint errors
- **Package lock issues**: If apt processes are locked, dpkg configuration may need fixing with `dpkg --configure -a` 