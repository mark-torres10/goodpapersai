#!/bin/bash

# Create a temporary .env file to skip type checking during build
create_build_env() {
  local target_dir=$1
  
  echo "Creating build environment in $target_dir"
  
  # Navigate to the target directory
  cd $target_dir
  
  # Create a temporary .env file to skip type checking during build
  echo "SKIP_PREFLIGHT_CHECK=true" > .env
  echo "TSC_COMPILE_ON_ERROR=true" >> .env
  echo "DISABLE_ESLINT_PLUGIN=true" >> .env
}

# Creates a production environment file for the admin application
create_admin_env() {
  local admin_dir=$1
  
  # Generate random secrets
  local admin_pw=$(openssl rand -base64 16)
  local session_secret=$(openssl rand -base64 32)
  
  # Create the .env file
  cat > $admin_dir/.env << EOL
KEYSTONE_ADMIN_USERNAME=admin
KEYSTONE_ADMIN_PW=$admin_pw
SESSION_SECRET=$session_secret
DATABASE_URL=file:./goodpapers.db
EOL

  echo "Admin password: $admin_pw"
}

# Creates the PM2 ecosystem config
create_pm2_config() {
  local app_dir=$1
  local app_name=$2
  local node_env=$3
  local server_port=$4
  local admin_port=$5
  local frontend_port=$6
  
  cat > $app_dir/ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: '$app_name-server',
      script: '$app_dir/repo/server/index.js',
      env: {
        NODE_ENV: '$node_env',
        PORT: $server_port
      }
    },
    {
      name: '$app_name-admin',
      script: 'npm',
      args: 'start',
      cwd: '$app_dir/repo/admin',
      env: {
        NODE_ENV: '$node_env',
        PORT: $admin_port
      }
    },
    {
      name: '$app_name-frontend-serve',
      script: 'npx',
      args: 'serve -s build -l $frontend_port',
      cwd: '$app_dir/repo/goodpapers'
    }
  ]
};
EOL

  echo "PM2 configuration created at $app_dir/ecosystem.config.js"
}

# Creates the nginx configuration
create_nginx_config() {
  local domain=$1
  local frontend_port=$2
  local server_port=$3
  local admin_port=$4
  
  cat > /etc/nginx/sites-available/$domain << EOL
server {
    listen 80;
    server_name $domain www.$domain;
    
    location / {
        proxy_pass http://localhost:$frontend_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:$server_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /admin {
        proxy_pass http://localhost:$admin_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

  # Enable the site
  ln -sf /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/
  
  echo "Nginx configuration created for $domain"
}

# Apply the custom schema for admin
apply_custom_schema() {
  local admin_dir=$1
  local deploy_dir=$2
  
  # Copy the deploy_schema.ts to the admin directory
  cp $deploy_dir/deploy_schema.ts $admin_dir/schema.ts
  
  echo "Custom schema applied to $admin_dir/schema.ts"
} 