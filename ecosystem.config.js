module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Alumni-API',
      script    : './server.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'ubuntu',
      host : 'ec2-18-221-88-190.us-east-2.compute.amazonaws.com',
      ref  : 'origin/master',
      repo : 'git@github.com:ainc/alumni-app-ec2-server.git',
      key  : '~/.ssh/alumni-app-key.pem',
      path : '/home/ubuntu/',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }

  }
};
