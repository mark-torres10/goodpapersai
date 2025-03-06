const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 9000;
const WEBHOOK_SECRET = crypto.randomBytes(20).toString('hex'); // Generate a random secret
const DEPLOY_SCRIPT = '/root/deployment/auto_deploy.sh';
const LOG_FILE = '/var/www/goodpapers/logs/webhook.log';

// Ensure log directory exists
const logDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(logMessage.trim());
}

// Save the webhook secret to a file for reference
fs.writeFileSync('/root/deployment/webhook_secret.txt', WEBHOOK_SECRET);
log(`Webhook secret: ${WEBHOOK_SECRET}`);
log(`Webhook server starting on port ${PORT}`);
log(`Save this secret in your GitHub repository webhook settings!`);

// Create HTTP server
const server = http.createServer((req, res) => {
  log(`Received ${req.method} request to ${req.url}`);
  
  // Only accept POST requests to /webhook
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      log(`Received webhook payload: ${body.substring(0, 200)}...`);
      
      // Verify signature if secret is provided
      const signature = req.headers['x-hub-signature-256'];
      if (signature) {
        log(`Signature: ${signature}`);
      }
      
      if (WEBHOOK_SECRET && signature) {
        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = 'sha256=' + hmac.update(body).digest('hex');
        
        log(`Calculated digest: ${digest}`);
        
        if (signature !== digest) {
          log('Invalid signature');
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          return res.end('Invalid signature');
        }
        
        log('Signature valid');
      }
      
      try {
        const event = req.headers['x-github-event'];
        const payload = JSON.parse(body);
        
        log(`GitHub event: ${event}, ref: ${payload.ref || 'undefined'}`);
        
        // Only process push events to the main branch
        if (event === 'push' && (payload.ref === 'refs/heads/main' || payload.ref === 'refs/heads/master')) {
          log(`Received push event to ${payload.ref} branch from ${payload.repository?.full_name || 'unknown'}`);
          
          // Execute deployment script
          log('Executing deployment script...');
          exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
            if (error) {
              log(`Deployment error: ${error.message}`);
              return;
            }
            
            log('Deployment completed successfully');
            log(`stdout: ${stdout}`);
            
            if (stderr) {
              log(`stderr: ${stderr}`);
            }
          });
          
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Deployment started');
        } else {
          log(`Ignoring event: ${event}, ref: ${payload.ref || 'undefined'}`);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Event ignored');
        }
      } catch (error) {
        log(`Error processing webhook: ${error.message}`);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON payload');
      }
    });
  } else if ((req.method === 'GET' || req.method === 'HEAD') && req.url === '/webhook') {
    // Respond to GET and HEAD requests with a simple status message
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    if (req.method === 'GET') {
      res.end('GitHub webhook receiver is running');
    } else {
      res.end();
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
server.listen(PORT, () => {
  log(`Webhook server listening on port ${PORT}`);
}); 