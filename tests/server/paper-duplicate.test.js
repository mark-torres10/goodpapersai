const { 
  createTestDatabase, 
  closeTestDatabase, 
  dbAll, 
  dbGet, 
  dbRun 
} = require('./db-utils');

describe('Paper Duplicate Checking Tests', () => {
  let db;
  
  // Sample paper data for testing
  const arxivPaper = {
    title: 'Test ArXiv Paper',
    authors: JSON.stringify(['Author One', 'Author Two']),
    journal: 'ArXiv Journal',
    year: 2023,
    doi: '10.1234/test',
    url: 'https://example.com/paper',
    arxiv_link: 'https://arxiv.org/abs/1234.5678',
    abstract: 'This is a test paper abstract.',
    is_currently_reading: 0,
    reading_status: 'want_to_read',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
  
  test('Insert paper with ArXiv link', async () => {
    // Insert paper
    const result = await dbRun(
      db,
      `INSERT INTO papers (
        title, authors, journal, year, doi, url, arxiv_link, abstract, 
        is_currently_reading, reading_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        arxivPaper.title,
        arxivPaper.authors,
        arxivPaper.journal,
        arxivPaper.year,
        arxivPaper.doi,
        arxivPaper.url,
        arxivPaper.arxiv_link,
        arxivPaper.abstract,
        arxivPaper.is_currently_reading,
        arxivPaper.reading_status,
        arxivPaper.created_at,
        arxivPaper.updated_at
      ]
    );
    
    expect(result.lastID).toBeTruthy();
    
    // Retrieve the paper and check ArXiv link
    const paper = await dbGet(db, 'SELECT * FROM papers WHERE arxiv_link = ?', [arxivPaper.arxiv_link]);
    
    expect(paper).toBeTruthy();
    expect(paper.arxiv_link).toBe(arxivPaper.arxiv_link);
    expect(paper.created_at).toBe(arxivPaper.created_at);
    expect(paper.updated_at).toBe(arxivPaper.updated_at);
  });
  
  test('Check for duplicate ArXiv paper', async () => {
    // Insert a paper first
    await dbRun(
      db,
      `INSERT INTO papers (
        title, authors, journal, year, doi, url, arxiv_link, abstract, 
        is_currently_reading, reading_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        arxivPaper.title,
        arxivPaper.authors,
        arxivPaper.journal,
        arxivPaper.year,
        arxivPaper.doi,
        arxivPaper.url,
        arxivPaper.arxiv_link,
        arxivPaper.abstract,
        arxivPaper.is_currently_reading,
        arxivPaper.reading_status,
        arxivPaper.created_at,
        arxivPaper.updated_at
      ]
    );
    
    // Check if paper exists
    const paper = await dbGet(db, 'SELECT * FROM papers WHERE arxiv_link = ?', [arxivPaper.arxiv_link]);
    expect(paper).toBeTruthy();
    
    // Try to insert again with the same ArXiv link
    const duplicatePaper = {
      ...arxivPaper,
      title: 'Different Title',
      year: 2024
    };
    
    // First check if a duplicate exists
    const existingPaper = await dbGet(db, 'SELECT * FROM papers WHERE arxiv_link = ?', [duplicatePaper.arxiv_link]);
    expect(existingPaper).toBeTruthy();
    expect(existingPaper.title).toBe(arxivPaper.title); // Should match the original
    
    // Update reading status instead of inserting
    const updatedStatus = 'finished_reading';
    const now = new Date().toISOString();
    
    await dbRun(
      db,
      `UPDATE papers 
       SET reading_status = ?, 
           is_currently_reading = ?,
           updated_at = ?
       WHERE id = ?`,
      [updatedStatus, 0, now, existingPaper.id]
    );
    
    // Check if the update worked
    const updatedPaper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [existingPaper.id]);
    expect(updatedPaper).toBeTruthy();
    expect(updatedPaper.reading_status).toBe(updatedStatus);
    expect(updatedPaper.updated_at).toBe(now);
    expect(updatedPaper.created_at).toBe(arxivPaper.created_at); // Created timestamp should not change
  });
  
  test('Update timestamp when changing paper status', async () => {
    // Insert a paper
    const initialTime = new Date(Date.now() - 86400000).toISOString(); // Yesterday
    
    await dbRun(
      db,
      `INSERT INTO papers (
        title, authors, journal, year, doi, url, arxiv_link, abstract, 
        is_currently_reading, reading_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        arxivPaper.title,
        arxivPaper.authors,
        arxivPaper.journal,
        arxivPaper.year,
        arxivPaper.doi,
        arxivPaper.url,
        arxivPaper.arxiv_link,
        arxivPaper.abstract,
        arxivPaper.is_currently_reading,
        arxivPaper.reading_status,
        initialTime, // Set initial time to yesterday
        initialTime
      ]
    );
    
    const paper = await dbGet(db, 'SELECT * FROM papers WHERE arxiv_link = ?', [arxivPaper.arxiv_link]);
    expect(paper).toBeTruthy();
    expect(paper.created_at).toBe(initialTime);
    expect(paper.updated_at).toBe(initialTime);
    
    // Update the paper status
    const newStatus = 'started_reading';
    const now = new Date().toISOString();
    
    await dbRun(
      db,
      `UPDATE papers 
       SET reading_status = ?, 
           is_currently_reading = ?,
           updated_at = ?
       WHERE id = ?`,
      [newStatus, 1, now, paper.id]
    );
    
    // Verify the timestamps
    const updatedPaper = await dbGet(db, 'SELECT * FROM papers WHERE id = ?', [paper.id]);
    expect(updatedPaper).toBeTruthy();
    expect(updatedPaper.created_at).toBe(initialTime); // Should not change
    expect(updatedPaper.updated_at).toBe(now); // Should be updated
    expect(updatedPaper.reading_status).toBe(newStatus);
  });
}); 