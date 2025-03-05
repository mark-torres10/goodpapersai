# GoodPapers Production Deployment

This document outlines how to deploy the GoodPapers application to a production environment using Digital Ocean.

## Architecture

The GoodPapers application consists of three main components:

1. **Frontend**: React application served statically
2. **API Server**: Node.js Express server
3. **Admin Interface**: KeystoneJS application

## Prerequisites

- Digital Ocean account
- Domain name (e.g., goodpapersai.com) registered with Namecheap
- GitHub repository with the GoodPapers code

## Deployment Process

### 1. Set Up Digital Ocean Droplet

- Create a Digital Ocean Droplet with Ubuntu 22.04
- Set up SSH keys for secure access
- Allocate appropriate resources (recommended: at least 2GB RAM, 1 CPU)

### 2. Configure Domain DNS at Namecheap

- Log in to your Namecheap account
- Go to Domain List > Manage for your domain
- Under Advanced DNS, add the following records:
  - Type: A Record, Host: @, Value: [Droplet IP], TTL: Automatic
  - Type: A Record, Host: www, Value: [Droplet IP], TTL: Automatic
  - Type: CNAME, Host: admin, Value: @, TTL: Automatic
  - Type: CNAME, Host: api, Value: @, TTL: Automatic

### 3. Server Configuration

The deployment script (`deploy.sh`) handles the following:

- Updates the system
- Installs necessary dependencies (Node.js, Nginx, etc.)
- Sets up the application directory structure
- Configures environment variables
- Sets up PM2 for process management
- Configures Nginx as a reverse proxy
- Sets up SSL certificates with Let's Encrypt

### 4. Continuous Deployment

GitHub Actions is set up to automatically deploy changes to the production server when code is pushed to the main branch. The workflow:

1. Checks out the code
2. Installs Digital Ocean CLI (doctl)
3. Sets up SSH access
4. Copies files to the server
5. Runs the deployment script

## Environment Variables

The following environment variables need to be set in GitHub secrets:

- `DIGITALOCEAN_ACCESS_TOKEN`: Your Digital Ocean API token
- `SSH_PRIVATE_KEY`: The private SSH key for server access
- `DROPLET_IP`: The IP address of your Digital Ocean Droplet

## Manual Deployment

If you need to deploy manually:

1. Connect to your server:
   ```
   ssh -i ~/.ssh/goodpapers_digitalocean root@[DROPLET_IP]
   ```

2. Navigate to the application directory:
   ```
   cd /var/www/goodpapers/repo
   ```

3. Run the deployment script:
   ```
   bash deploy.sh
   ```

## Monitoring

To monitor the running processes:

```
pm2 list
pm2 logs
```

## Troubleshooting

- Check Nginx logs: `/var/log/nginx/error.log`
- Check application logs: `pm2 logs`
- Verify Nginx configuration: `nginx -t`

## Backup and Restore

The database is stored at:
- `/var/www/goodpapers/repo/server/db/papers.db` (Server DB)
- `/var/www/goodpapers/repo/admin/goodpapers.db` (Admin DB)

Backup these files regularly to prevent data loss. 