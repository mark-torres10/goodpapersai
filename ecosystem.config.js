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
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      exp_backoff_restart_delay: 100,
      watch: false,
      merge_logs: true,
      error_file: "/var/www/goodpapers/logs/server-error.log",
      out_file: "/var/www/goodpapers/logs/server-out.log",
      env_file: '.env'
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
      error_file: "/var/www/goodpapers/logs/admin-error.log",
      out_file: "/var/www/goodpapers/logs/admin-out.log"
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
      error_file: "/var/www/goodpapers/logs/frontend-error.log",
      out_file: "/var/www/goodpapers/logs/frontend-out.log"
    }
  ]
}; 