/**
 * Mock implementation of the KeystoneJS sync functionality for testing
 */

let mockPapers = [];
let mockUpdates = [];
let mockErrors = false;

/**
 * Reset the mock data
 */
function resetMocks() {
  mockPapers = [];
  mockUpdates = [];
  mockErrors = false;
}

/**
 * Set the mock to throw errors
 */
function setMockErrors(shouldError) {
  mockErrors = shouldError;
}

/**
 * Get all mock papers
 */
function getMockPapers() {
  return [...mockPapers];
}

/**
 * Get all mock updates
 */
function getMockUpdates() {
  return [...mockUpdates];
}

/**
 * Mock for syncPaperToKeystone
 */
async function syncPaperToKeystone(paper) {
  if (mockErrors) {
    throw new Error('Mock KeystoneJS sync error');
  }
  
  // Generate a fake Keystone ID
  const id = `ks-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Store the paper in our mock
  mockPapers.push({
    id,
    ...paper
  });
  
  return id;
}

/**
 * Mock for syncUpdateToKeystone
 */
async function syncUpdateToKeystone(update, keystonePaperId) {
  if (mockErrors) {
    throw new Error('Mock KeystoneJS sync error');
  }
  
  // Generate a fake Keystone ID
  const id = `ks-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Store the update in our mock
  mockUpdates.push({
    id,
    keystonePaperId,
    ...update
  });
  
  return id;
}

module.exports = {
  syncPaperToKeystone,
  syncUpdateToKeystone,
  resetMocks,
  setMockErrors,
  getMockPapers,
  getMockUpdates
}; 