const { 
  createTestDatabase, 
  closeTestDatabase, 
  dbAll, 
  dbGet, 
  dbRun 
} = require('./db-utils');

// Import fetch for Node.js environment
const fetch = require('node-fetch');

// Mock the actual server endpoints
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Mock the KeystoneJS sync module
jest.mock('../../server/keystone-sync', () => require('./keystone-sync.mock'));

const { 
  getMockPapers, 
  getMockUpdates, 
  resetMocks 
} = require('./keystone-sync.mock');

describe('End-to-End Tests: Express API with KeystoneJS Sync', () => {
  let db;
  let app;
  let server;
  const PORT = 3333; // Use a different port for testing
  
  // Initialize the Express app with test database
  beforeAll(async () => {
    // Create test database
    db = await createTestDatabase();
    
    // Create Express app
    app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    // Helper function to format a paper from DB
    const formatPaper = (paper) => {
      return {
        id: paper.id,
        title: paper.title,
        authors: JSON.parse(paper.authors),
        journal: paper.journal,
        year: paper.year,
        doi: paper.doi,
        url: paper.url,
        abstract: paper.abstract,
        isCurrentlyReading: paper.is_currently_reading === 1,
        readingStatus: paper.reading_status || 'add_to_library'
      };
    };
    
    // Set up API endpoints - simplified version of server/index.js
    
    // Get all papers
    app.get('/api/papers', async (req, res) => {
      try {
        const rows = await dbAll(db, 'SELECT * FROM papers');
        const papers = rows.map(formatPaper);
        res.json(papers);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    // Create a new paper
    app.post('/api/papers', async (req, res) => {
      try {
        const { title, authors, journal, year, doi, url, abstract, isCurrentlyReading, readingStatus } = req.body;
        
        if (!title || !authors || !year) {
          return res.status(400).json({ error: 'Title, authors, and year are required' });
        }
        
        const authorsSerialized = JSON.stringify(authors);
        
        // Insert the paper
        const result = await dbRun(
          db,
          `INSERT INTO papers (
            title, authors, journal, year, doi, url, abstract, 
            is_currently_reading, reading_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title, 
            authorsSerialized, 
            journal, 
            year, 
            doi, 
            url, 
            abstract, 
            isCurrentlyReading ? 1 : 0,
            readingStatus || 'add_to_library'
          ]
        );
        
        const paperId = result.lastID;
        
        // Determine the update message
        let updateMessage = 'Added to library';
        if (readingStatus) {
          switch (readingStatus) {
            case 'want_to_read':
              updateMessage = 'Added to "Want to Read" list';
              break;
            case 'started_reading':
              updateMessage = 'Started reading';
              break;
            case 'finished_reading':
              updateMessage = 'Finished reading';
              break;
          }
        }
        
        // Insert update
        const now = new Date().toISOString();
        
        await dbRun(
          db,
          `INSERT INTO updates (
            paper_id, paper_title, message, timestamp, reading_status
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            paperId, 
            title, 
            updateMessage, 
            now,
            readingStatus || 'add_to_library'
          ]
        );
        
        // Sync to KeystoneJS
        const keystoneSync = require('../../server/keystone-sync');
        
        const paper = {
          title,
          authors: authorsSerialized,
          journal,
          year,
          doi,
          url,
          abstract,
          isCurrentlyReading,
          readingStatus: readingStatus || 'add_to_library'
        };
        
        const keystonePaperId = await keystoneSync.syncPaperToKeystone(paper);
        
        const update = {
          paperTitle: title,
          message: updateMessage,
          timestamp: now,
          readingStatus: readingStatus || 'add_to_library'
        };
        
        await keystoneSync.syncUpdateToKeystone(update, keystonePaperId);
        
        // Return the created paper
        res.status(201).json({
          id: paperId,
          title,
          authors,
          journal,
          year,
          doi,
          url,
          abstract,
          isCurrentlyReading,
          readingStatus
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    
    // Start the server
    server = app.listen(PORT);
  });
  
  afterAll(async () => {
    // Close the database and server
    await closeTestDatabase(db);
    server.close();
  });
  
  beforeEach(async () => {
    // Clear database and mocks before each test
    await dbRun(db, 'DELETE FROM updates');
    await dbRun(db, 'DELETE FROM papers');
    resetMocks();
  });
  
  test('API creates a paper and syncs with KeystoneJS', async () => {
    const newPaper = {
      title: 'E2E Test Paper',
      authors: ['E2E Test Author'],
      year: 2023,
      journal: 'Journal of E2E Testing',
      abstract: 'This is a test paper for E2E testing.',
      url: 'https://example.com/e2e',
      readingStatus: 'want_to_read'
    };
    
    // POST to create the paper
    const response = await fetch(`http://localhost:${PORT}/api/papers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPaper)
    });
    
    expect(response.status).toBe(201);
    
    const responseData = await response.json();
    expect(responseData.title).toBe(newPaper.title);
    expect(responseData.readingStatus).toBe(newPaper.readingStatus);
    
    // Check that paper is in database
    const papers = await dbAll(db, 'SELECT * FROM papers');
    expect(papers.length).toBe(1);
    expect(papers[0].title).toBe(newPaper.title);
    expect(papers[0].reading_status).toBe(newPaper.readingStatus);
    
    // Check that update is in database
    const updates = await dbAll(db, 'SELECT * FROM updates');
    expect(updates.length).toBe(1);
    expect(updates[0].paper_title).toBe(newPaper.title);
    expect(updates[0].message).toBe('Added to "Want to Read" list');
    expect(updates[0].reading_status).toBe(newPaper.readingStatus);
    
    // Check that paper and update are in KeystoneJS
    const keystonePapers = getMockPapers();
    expect(keystonePapers.length).toBe(1);
    expect(keystonePapers[0].title).toBe(newPaper.title);
    expect(keystonePapers[0].readingStatus).toBe(newPaper.readingStatus);
    
    const keystoneUpdates = getMockUpdates();
    expect(keystoneUpdates.length).toBe(1);
    expect(keystoneUpdates[0].paperTitle).toBe(newPaper.title);
    expect(keystoneUpdates[0].message).toBe('Added to "Want to Read" list');
    expect(keystoneUpdates[0].readingStatus).toBe(newPaper.readingStatus);
  });
  
  test('API validates required fields', async () => {
    const invalidPaper = {
      title: 'Missing Fields Paper'
      // Missing required authors and year
    };
    
    // POST with invalid data
    const response = await fetch(`http://localhost:${PORT}/api/papers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPaper)
    });
    
    expect(response.status).toBe(400);
    
    const responseData = await response.json();
    expect(responseData.error).toBeTruthy();
    
    // Check that no paper was created
    const papers = await dbAll(db, 'SELECT * FROM papers');
    expect(papers.length).toBe(0);
    
    // Check that no KeystoneJS sync occurred
    const keystonePapers = getMockPapers();
    expect(keystonePapers.length).toBe(0);
  });
}); 