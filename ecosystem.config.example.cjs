// PM2 Ecosystem Configuration Example
// Copy this file to ecosystem.config.js and customize for your server

module.exports = {
  apps: [
    {
      name: 'weblog-bridge',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logging
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Source control integration
      post_update: ['yarn install', 'yarn build']
    }
  ],

  deploy: {
    production: {
      user: 'YOUR_USERNAME',           // Replace with your server username
      host: 'your-server.com',         // Replace with your server hostname/IP
      ref: 'origin/main',
      repo: 'https://github.com/librenews/weblog.social.git',
      path: '/opt/weblog.social',      // Replace with your desired deployment path
      'pre-deploy-local': '',
      'post-deploy': '/home/YOUR_USER/.nvm/versions/node/vXX.XX.X/bin/yarn install && NODE_OPTIONS="--max_old_space_size=1024" /home/YOUR_USER/.nvm/versions/node/vXX.XX.X/bin/yarn build && ln -sf /home/YOUR_USER/weblog/shared/ecosystem.config.cjs ./ecosystem.config.cjs && /usr/local/bin/pm2 startOrRestart ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
