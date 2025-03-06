// Jest setup file for server tests

// Add fetch polyfill for Node.js environment
global.fetch = require('node-fetch');

// Any other server-specific test setup can go here 