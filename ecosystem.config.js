module.exports = {
  apps: [
    {
      name: 'topdesign',
      script: './server.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Process management
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,

      // Monitoring
      watch: false, // Set to true for development auto-restart
      ignore_watch: ['node_modules', 'logs', 'data'],

      // Advanced
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 10000,

      // Health check
      health_check_grace_period: 30000,

      // Auto-restart on failure
      autorestart: true,

      // Don't start if crashed too much
      exp_backoff_restart_delay: 100
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/topdesign-website.git',
      path: '/var/www/topdesign',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/topdesign-website.git',
      path: '/var/www/topdesign-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};
