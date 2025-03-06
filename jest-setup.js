// Jest setup file
import '@testing-library/jest-dom';

// Add fetch polyfill for Node.js environment
global.fetch = require('node-fetch');

// Add any global test setup needed here

// Silence console errors during tests
console.error = jest.fn(); 