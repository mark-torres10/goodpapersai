const { 
  createTestDatabase, 
  closeTestDatabase, 
  dbAll, 
  dbGet, 
  dbRun 
} = require('./db-utils');

describe('Database Operations Tests', () => {
  let db;
  
  // Sample paper data for testing
  const testPaper = {
    title: 'Test Paper',
    authors: JSON.stringify(['Author One', 'Author Two']),
    journal: 'Test Journal',
    year: 2023,
    doi: '10.1234/test',
    url: 'https://example.com/paper',
    abstract: 'This is a test paper abstract.',
    is_currently_reading: 0,
    reading_status: 'want_to_read'
  };
  
  beforeAll(async () => {
    db = await createTestDatabase();
  });
  
  afterAll(async () => {
    await closeTestDatabase(db);
  });
  
  beforeEach(async () => {
    // Clear tables before each test
    await dbRun(db, 'DELETE FROM updates');
    await dbRun(db, 'DELETE FROM papers');
  });
  
  describe('Paper CRUD Operations', () => {
    test('Create a paper', async () => {
      const result = await dbRun(
        db,
        `INSERT INTO papers (
          title, authors, journal, year, doi, url, abstract, 
          is_currently_reading, reading_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testPaper.title,
          testPaper.authors,
          testPaper.journal,
          testPaper.year,
          testPaper.doi,
          testPaper.url,
          testPaper.abstract,
          testPaper.is_currently_reading,
          testPaper.reading_status
        ]
      );
      
      expect(result.lastID).toBeTruthy();
      
      const paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [result.lastID]);
      expect(paper).toBeTruthy();
      expect(paper.title).toBe(testPaper.title);
      expect(paper.year).toBe(testPaper.year);
      expect(paper.reading_status).toBe(testPaper.reading_status);
    });
    
    test('Read a paper', async () => {
      // Insert a paper
      const insertResult = await dbRun(
        db,
        `INSERT INTO papers (
          title, authors, journal, year, doi, url, abstract, 
          is_currently_reading, reading_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testPaper.title,
          testPaper.authors,
          testPaper.journal,
          testPaper.year,
          testPaper.doi,
          testPaper.url,
          testPaper.abstract,
          testPaper.is_currently_reading,
          testPaper.reading_status
        ]
      );
      
      // Read the paper
      const paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [insertResult.lastID]);
      
      expect(paper).toBeTruthy();
      expect(paper.title).toBe(testPaper.title);
      expect(paper.authors).toBe(testPaper.authors);
      expect(paper.year).toBe(testPaper.year);
      expect(paper.reading_status).toBe(testPaper.reading_status);
    });
    
    test('Update a paper', async () => {
      // Insert a paper
      const insertResult = await dbRun(
        db,
        `INSERT INTO papers (
          title, authors, journal, year, doi, url, abstract, 
          is_currently_reading, reading_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testPaper.title,
          testPaper.authors,
          testPaper.journal,
          testPaper.year,
          testPaper.doi,
          testPaper.url,
          testPaper.abstract,
          testPaper.is_currently_reading,
          testPaper.reading_status
        ]
      );
      
      // Update the paper
      const updatedTitle = 'Updated Test Paper';
      const updatedReadingStatus = 'started_reading';
      
      await dbRun(
        db,
        'UPDATE papers SET title = ?, reading_status = ?, is_currently_reading = ? WHERE id = ?',
        [updatedTitle, updatedReadingStatus, 1, insertResult.lastID]
      );
      
      // Read the updated paper
      const paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [insertResult.lastID]);
      
      expect(paper).toBeTruthy();
      expect(paper.title).toBe(updatedTitle);
      expect(paper.reading_status).toBe(updatedReadingStatus);
      expect(paper.is_currently_reading).toBe(1);
    });
    
    test('Delete a paper', async () => {
      // Insert a paper
      const insertResult = await dbRun(
        db,
        `INSERT INTO papers (
          title, authors, journal, year, doi, url, abstract, 
          is_currently_reading, reading_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testPaper.title,
          testPaper.authors,
          testPaper.journal,
          testPaper.year,
          testPaper.doi,
          testPaper.url,
          testPaper.abstract,
          testPaper.is_currently_reading,
          testPaper.reading_status
        ]
      );
      
      // Verify the paper exists
      let paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [insertResult.lastID]);
      expect(paper).toBeTruthy();
      
      // Delete the paper
      await dbRun(db, 'DELETE FROM papers WHERE id = ?', [insertResult.lastID]);
      
      // Verify the paper is deleted
      paper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [insertResult.lastID]);
      expect(paper).toBeUndefined();
    });
  });
  
  describe('Update CRUD Operations', () => {
    let paperId;
    
    beforeEach(async () => {
      // Insert a paper for updates to reference
      const result = await dbRun(
        db,
        `INSERT INTO papers (
          title, authors, journal, year, doi, url, abstract, 
          is_currently_reading, reading_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testPaper.title,
          testPaper.authors,
          testPaper.journal,
          testPaper.year,
          testPaper.doi,
          testPaper.url,
          testPaper.abstract,
          testPaper.is_currently_reading,
          testPaper.reading_status
        ]
      );
      
      paperId = result.lastID;
    });
    
    test('Create an update', async () => {
      const updateMessage = 'Added to "Want to Read" list';
      const timestamp = new Date().toISOString();
      
      const result = await dbRun(
        db,
        'INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status) VALUES (?, ?, ?, ?, ?)',
        [paperId, testPaper.title, updateMessage, timestamp, testPaper.reading_status]
      );
      
      expect(result.lastID).toBeTruthy();
      
      const update = await dbGet(db, 'SELECT * FROM updates WHERE id = ?', [result.lastID]);
      expect(update).toBeTruthy();
      expect(update.paper_id).toBe(paperId);
      expect(update.message).toBe(updateMessage);
      expect(update.reading_status).toBe(testPaper.reading_status);
    });
    
    test('Read updates', async () => {
      // Insert multiple updates
      const updateMessages = [
        'Added to "Want to Read" list',
        'Started reading',
        'Finished reading'
      ];
      
      const readingStatuses = [
        'want_to_read',
        'started_reading',
        'finished_reading'
      ];
      
      for (let i = 0; i < updateMessages.length; i++) {
        await dbRun(
          db,
          'INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status) VALUES (?, ?, ?, ?, ?)',
          [
            paperId, 
            testPaper.title, 
            updateMessages[i], 
            new Date().toISOString(),
            readingStatuses[i]
          ]
        );
      }
      
      // Read all updates
      const updates = await dbAll(db, 'SELECT * FROM updates');
      
      expect(updates).toBeTruthy();
      expect(updates.length).toBe(3);
      expect(updates.map(u => u.message)).toEqual(expect.arrayContaining(updateMessages));
      expect(updates.map(u => u.reading_status)).toEqual(expect.arrayContaining(readingStatuses));
    });
    
    test('Update an update', async () => {
      // Insert an update
      const initialMessage = 'Added to "Want to Read" list';
      const timestamp = new Date().toISOString();
      
      const insertResult = await dbRun(
        db,
        'INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status) VALUES (?, ?, ?, ?, ?)',
        [paperId, testPaper.title, initialMessage, timestamp, 'want_to_read']
      );
      
      // Update the update record
      const updatedMessage = 'Started reading';
      const updatedReadingStatus = 'started_reading';
      
      await dbRun(
        db,
        'UPDATE updates SET message = ?, reading_status = ? WHERE id = ?',
        [updatedMessage, updatedReadingStatus, insertResult.lastID]
      );
      
      // Read the updated record
      const update = await dbGet(db, 'SELECT * FROM updates WHERE id = ?', [insertResult.lastID]);
      
      expect(update).toBeTruthy();
      expect(update.message).toBe(updatedMessage);
      expect(update.reading_status).toBe(updatedReadingStatus);
    });
    
    test('Delete an update', async () => {
      // Insert an update
      const message = 'Added to "Want to Read" list';
      const timestamp = new Date().toISOString();
      
      const insertResult = await dbRun(
        db,
        'INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status) VALUES (?, ?, ?, ?, ?)',
        [paperId, testPaper.title, message, timestamp, 'want_to_read']
      );
      
      // Verify the update exists
      let update = await dbGet(db, 'SELECT * FROM updates WHERE id = ?', [insertResult.lastID]);
      expect(update).toBeTruthy();
      
      // Delete the update
      await dbRun(db, 'DELETE FROM updates WHERE id = ?', [insertResult.lastID]);
      
      // Verify the update is deleted
      update = await dbGet(db, 'SELECT * FROM updates WHERE id = ?', [insertResult.lastID]);
      expect(update).toBeUndefined();
    });
    
    test('Foreign key constraint works when deleting a paper', async () => {
      // Insert an update
      const message = 'Added to "Want to Read" list';
      const timestamp = new Date().toISOString();
      
      await dbRun(
        db,
        'INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status) VALUES (?, ?, ?, ?, ?)',
        [paperId, testPaper.title, message, timestamp, 'want_to_read']
      );
      
      // Verify the update exists
      const updates = await dbAll(db, 'SELECT * FROM updates WHERE paper_id = ?', [paperId]);
      expect(updates.length).toBeGreaterThan(0);
      
      // Delete the paper
      await dbRun(db, 'DELETE FROM papers WHERE id = ?', [paperId]);
      
      // Verify the update is also deleted due to CASCADE
      const remainingUpdates = await dbAll(db, 'SELECT * FROM updates WHERE paper_id = ?', [paperId]);
      expect(remainingUpdates.length).toBe(0);
    });
  });
}); 