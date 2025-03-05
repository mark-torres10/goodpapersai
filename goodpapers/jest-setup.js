// This file sets up Jest to handle TypeScript and React properly

// Add jest-dom matchers
require('@testing-library/jest-dom');

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue("")
  })
);

// Mock for styled-components
jest.mock('styled-components', () => {
  const originalModule = jest.requireActual('styled-components');
  return {
    ...originalModule,
    css: (...args) => args,
    createGlobalStyle: (...args) => args,
    keyframes: (...args) => args,
  };
}); 