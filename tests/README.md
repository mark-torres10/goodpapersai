# GoodPapers Tests

This directory contains automated tests for the GoodPapers application.

## Server Tests

The server tests are located in the `server` directory and test the database operations, KeystoneJS synchronization, and API functionality.

### Running the Tests

```bash
npm run test:server
```

### Test Files

- **db-operations.test.js**: Tests basic CRUD operations (Create, Read, Update, Delete) on the SQLite database for papers and updates.
- **keystone-sync.test.js**: Tests the synchronization functionality between the SQLite database and KeystoneJS.
- **integration.test.js**: Tests the integration between database operations and KeystoneJS synchronization.
- **e2e.test.js**: End-to-end tests of the API with a mini Express server that mimics the production server.

### Test Utilities

- **db-utils.js**: Utility functions for creating an in-memory database, running queries, and closing connections.
- **keystone-sync.mock.js**: Mock implementation of the KeystoneJS synchronization module for testing purposes.

## Features Tested

1. **Paper CRUD Operations**
   - Creating papers
   - Reading papers
   - Updating papers
   - Deleting papers

2. **Update CRUD Operations**
   - Creating updates
   - Reading updates
   - Updating updates
   - Deleting updates
   - Foreign key constraints (cascade delete)

3. **KeystoneJS Synchronization**
   - Paper synchronization
   - Update synchronization
   - Error handling during synchronization

4. **Reading Status Feature**
   - Different reading statuses are properly stored in the database
   - Updates reflect the current reading status
   - KeystoneJS synchronization includes reading status

5. **API Validation**
   - Required fields validation
   - Error handling

## Mocking Strategy

Instead of making actual network requests to KeystoneJS, we use a mock implementation that:

1. Stores papers and updates in memory
2. Can simulate errors
3. Provides functions to check what was "synced"

This allows us to verify that the sync functionality works correctly without requiring a running KeystoneJS instance. 