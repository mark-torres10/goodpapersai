#!/usr/bin/env node

/**
 * Google OAuth Setup Guide
 * 
 * This script guides you through the process of setting up
 * Google OAuth credentials for GoodPapers.
 */

console.log('\x1b[36m%s\x1b[0m', '🔐 GoodPapers Google OAuth Setup Guide 🔐');
console.log('\n');

console.log('Follow these steps to set up Google OAuth for your GoodPapers application:');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '1. Go to the Google Cloud Console:');
console.log('   https://console.cloud.google.com/');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '2. Create a new project or select an existing one');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '3. Navigate to "APIs & Services" > "Credentials"');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '4. Click "CREATE CREDENTIALS" and select "OAuth client ID"');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '5. If prompted, configure the OAuth consent screen:');
console.log('   - User Type: External');
console.log('   - App name: GoodPapers');
console.log('   - User support email: Your email');
console.log('   - Developer contact information: Your email');
console.log('   - Add the "email" and "profile" scopes');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '6. Create OAuth client ID:');
console.log('   - Application type: Web application');
console.log('   - Name: GoodPapers');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '7. Add the following Authorized JavaScript origins:');
console.log('   - http://localhost:3000');
console.log('   - https://goodpapersai.com');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '8. Add the following Authorized redirect URIs:');
console.log('   - http://localhost:3001/api/auth/google/callback');
console.log('   - https://goodpapersai.com/api/auth/google/callback');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '9. Click "CREATE" and note your Client ID and Client Secret');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '10. Add these credentials to your .env file:');
console.log('    GOOGLE_CLIENT_ID=your-client-id');
console.log('    GOOGLE_CLIENT_SECRET=your-client-secret');
console.log('\n');

console.log('\x1b[32m%s\x1b[0m', '✅ You\'re all set! Your Google OAuth credentials are now ready to use.');
console.log('\n'); 