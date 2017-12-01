module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: 'alumni-app-ec2-server',
    script: './server.js'
  }],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      key  : '~/.ssh/alumni-app-key.pem',
      user: 'ubuntu',
      host: 'ec2-18-221-88-190.us-east-2.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:ainc/alumni-app-ec2-server.git',
      path: '/home/ubuntu/alumni-app-ec2-server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
