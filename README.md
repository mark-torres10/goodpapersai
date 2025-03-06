# Goodpapers AI

Goodreads, but for academic literature.

## Running the Application

### UI (Frontend)

1. Navigate to the `goodpapers` directory
2. Run `npm start`
3. The UI will be available at `http://localhost:3000`

### Server (Backend)

1. Navigate to the `goodpapers` directory
2. Run `node server/index.js`
3. The API server will run on `http://localhost:3001`

### Admin Interface

1. Navigate to the `goodpapers/admin` directory
2. Run `npm run dev`
3. The admin interface will be available at `http://localhost:3002`

## Deployment

The application can be deployed to a production server using the deployment scripts in the `deploy/` directory.

### Deployment Structure

- `deploy.sh` - Main deployment script (in the project root)
- `deploy/` - Directory containing all deployment-related files
  - `deploy_schema.ts` - Simplified Keystone schema for production
  - `env_setup.sh` - Utility functions for environment setup
  - `deploy.sh` - Server-side deployment script
  - `README.md` - Documentation for the deployment process
  - `auto_deploy.sh` - Script for automatic deployment from GitHub
  - `webhook.js` - Webhook listener for GitHub events
  - `webhook.service` - Systemd service for the webhook

### Manual Deployment

To manually deploy the application:

1. Make sure your SSH key for the server is properly set up at `~/.ssh/goodpapers_digitalocean`
2. Run the deployment script from the project root:

```bash
./deploy.sh
```

### Continuous Deployment

The repository is set up with continuous deployment through GitHub Actions. Whenever you push to the `main` branch, the changes are automatically deployed to the production server.

#### GitHub Configuration

For the GitHub Actions workflow to function, the following secrets need to be set in the repository:

1. `SSH_PRIVATE_KEY` - The private SSH key for accessing the server 
2. `DROPLET_IP` - The IP address of the Digital Ocean droplet (161.35.180.213)

For more detailed information about the deployment process, see [deploy/README.md](deploy/README.md) and [PRODUCTION.md](PRODUCTION.md).
