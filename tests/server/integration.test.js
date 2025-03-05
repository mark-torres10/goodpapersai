const { 
  createTestDatabase, 
  closeTestDatabase, 
  dbAll, 
  dbGet, 
  dbRun 
} = require('./db-utils');

// Mock the KeystoneJS sync module
jest.mock('../../server/keystone-sync', () => require('./keystone-sync.mock'));

const { 
  getMockPapers, 
  getMockUpdates, 
  resetMocks 
} = require('./keystone-sync.mock');

// Sample paper creation helpers
const samplePaper = {
  title: 'Integration Test Paper',
  authors: ['Dr. Test Author', 'Professor Integration'],
  year: 2023,
  journal: 'Journal of Testing',
  doi: '10.1234/integration',
  url: 'https://example.com/integration',
  abstract: 'This is a test abstract for integration testing.',
  isCurrentlyReading: false,
  readingStatus: 'want_to_read'
};

// Function that replicates the paper creation in the actual server
async function createPaper(db, paper, readingStatus = 'add_to_library') {
  const keystoneSync = require('../../server/keystone-sync');
  
  // Insert into papers table
  const authorsSerialized = JSON.stringify(paper.authors);
  const isCurrentlyReading = readingStatus === 'started_reading' ? 1 : 0;
  
  const paperResult = await dbRun(
    db,
    `INSERT INTO papers (
      title, authors, journal, year, doi, url, abstract, 
      is_currently_reading, reading_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paper.title,
      authorsSerialized,
      paper.journal,
      paper.year,
      paper.doi,
      paper.url,
      paper.abstract,
      isCurrentlyReading,
      readingStatus
    ]
  );
  
  const paperId = paperResult.lastID;
  
  // Determine update message
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
  
  // Insert into updates table
  const now = new Date().toISOString();
  
  await dbRun(
    db,
    `INSERT INTO updates (
      paper_id, paper_title, message, timestamp, reading_status
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      paperId,
      paper.title,
      updateMessage,
      now,
      readingStatus
    ]
  );
  
  // Sync to KeystoneJS
  const paperForSync = {
    title: paper.title,
    authors: authorsSerialized,
    journal: paper.journal,
    year: paper.year,
    doi: paper.doi,
    url: paper.url,
    abstract: paper.abstract,
    isCurrentlyReading: isCurrentlyReading === 1,
    readingStatus: readingStatus
  };
  
  const keystonePaperId = await keystoneSync.syncPaperToKeystone(paperForSync);
  
  const updateForSync = {
    paperTitle: paper.title,
    message: updateMessage,
    timestamp: now,
    readingStatus: readingStatus
  };
  
  await keystoneSync.syncUpdateToKeystone(updateForSync, keystonePaperId);
  
  return {
    paperId,
    keystonePaperId
  };
}

describe('Integration Tests: Database and KeystoneJS Sync', () => {
  let db;
  
  beforeAll(async () => {
    db = await createTestDatabase();
  });
  
  afterAll(async () => {
    await closeTestDatabase(db);
  });
  
  beforeEach(async () => {
    // Clear tables and mocks before each test
    await dbRun(db, 'DELETE FROM updates');
    await dbRun(db, 'DELETE FROM papers');
    resetMocks();
  });
  
  test('Creating a paper syncs with KeystoneJS', async () => {
    const { paperId, keystonePaperId } = await createPaper(db, samplePaper, 'want_to_read');
    
    // Verify paper is in database
    const paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [paperId]);
    expect(paper).toBeTruthy();
    expect(paper.title).toBe(samplePaper.title);
    expect(paper.reading_status).toBe('want_to_read');
    
    // Verify update is in database
    const updates = await dbAll(db, 'SELECT * FROM updates WHERE paper_id = ?', [paperId]);
    expect(updates.length).toBe(1);
    expect(updates[0].message).toBe('Added to "Want to Read" list');
    expect(updates[0].reading_status).toBe('want_to_read');
    
    // Verify paper is in KeystoneJS
    const keystonePapers = getMockPapers();
    expect(keystonePapers.length).toBe(1);
    expect(keystonePapers[0].id).toBe(keystonePaperId);
    expect(keystonePapers[0].title).toBe(samplePaper.title);
    expect(keystonePapers[0].readingStatus).toBe('want_to_read');
    
    // Verify update is in KeystoneJS
    const keystoneUpdates = getMockUpdates();
    expect(keystoneUpdates.length).toBe(1);
    expect(keystoneUpdates[0].keystonePaperId).toBe(keystonePaperId);
    expect(keystoneUpdates[0].message).toBe('Added to "Want to Read" list');
    expect(keystoneUpdates[0].readingStatus).toBe('want_to_read');
  });
  
  test('Different reading statuses are properly synced', async () => {
    const readingStatuses = [
      'add_to_library',
      'want_to_read',
      'started_reading',
      'finished_reading'
    ];
    
    const expectedMessages = [
      'Added to library',
      'Added to "Want to Read" list',
      'Started reading',
      'Finished reading'
    ];
    
    for (let i = 0; i < readingStatuses.length; i++) {
      const status = readingStatuses[i];
      const customPaper = {
        ...samplePaper,
        title: `Paper for ${status} test`,
      };
      
      await createPaper(db, customPaper, status);
      
      // Verify in database
      const papers = await dbAll(db, 'SELECT * FROM papers WHERE title = ?', [customPaper.title]);
      expect(papers.length).toBe(1);
      expect(papers[0].reading_status).toBe(status);
      
      if (status === 'started_reading') {
        expect(papers[0].is_currently_reading).toBe(1);
      } else {
        expect(papers[0].is_currently_reading).toBe(0);
      }
      
      // Verify update message
      const updates = await dbAll(db, 'SELECT * FROM updates WHERE paper_title = ?', [customPaper.title]);
      expect(updates.length).toBe(1);
      expect(updates[0].message).toBe(expectedMessages[i]);
      expect(updates[0].reading_status).toBe(status);
    }
    
    // Verify all papers and updates are in KeystoneJS
    const keystonePapers = getMockPapers();
    expect(keystonePapers.length).toBe(readingStatuses.length);
    
    const keystoneUpdates = getMockUpdates();
    expect(keystoneUpdates.length).toBe(readingStatuses.length);
    
    // Check that all statuses are represented in Keystone
    const keystoneStatuses = keystonePapers.map(p => p.readingStatus);
    for (const status of readingStatuses) {
      expect(keystoneStatuses).toContain(status);
    }
  });
}); 