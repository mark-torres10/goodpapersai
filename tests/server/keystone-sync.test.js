const { 
  syncPaperToKeystone,
  syncUpdateToKeystone,
  resetMocks,
  setMockErrors,
  getMockPapers,
  getMockUpdates
} = require('./keystone-sync.mock');

describe('KeystoneJS Sync Tests', () => {
  beforeEach(() => {
    resetMocks();
  });
  
  // Sample paper data for testing
  const testPaper = {
    title: 'Test Paper',
    authors: JSON.stringify(['Author One', 'Author Two']),
    journal: 'Test Journal',
    year: 2023,
    doi: '10.1234/test',
    url: 'https://example.com/paper',
    abstract: 'This is a test paper abstract.',
    isCurrentlyReading: false,
    readingStatus: 'want_to_read'
  };
  
  describe('Paper Sync', () => {
    test('Successfully syncs a paper to KeystoneJS', async () => {
      const keystonePaperId = await syncPaperToKeystone(testPaper);
      
      expect(keystonePaperId).toBeTruthy();
      expect(keystonePaperId).toContain('ks-');
      
      const papers = getMockPapers();
      expect(papers.length).toBe(1);
      expect(papers[0].id).toBe(keystonePaperId);
      expect(papers[0].title).toBe(testPaper.title);
      expect(papers[0].year).toBe(testPaper.year);
      expect(papers[0].readingStatus).toBe(testPaper.readingStatus);
    });
    
    test('Handles errors during paper sync', async () => {
      setMockErrors(true);
      
      await expect(syncPaperToKeystone(testPaper)).rejects.toThrow('Mock KeystoneJS sync error');
      
      const papers = getMockPapers();
      expect(papers.length).toBe(0);
    });
  });
  
  describe('Update Sync', () => {
    let keystonePaperId;
    
    beforeEach(async () => {
      // Create a paper in Keystone first
      setMockErrors(false);
      keystonePaperId = await syncPaperToKeystone(testPaper);
    });
    
    test('Successfully syncs an update to KeystoneJS', async () => {
      const testUpdate = {
        paperTitle: testPaper.title,
        message: 'Added to "Want to Read" list',
        timestamp: new Date().toISOString(),
        readingStatus: 'want_to_read'
      };
      
      await syncUpdateToKeystone(testUpdate, keystonePaperId);
      
      const updates = getMockUpdates();
      expect(updates.length).toBe(1);
      expect(updates[0].keystonePaperId).toBe(keystonePaperId);
      expect(updates[0].paperTitle).toBe(testUpdate.paperTitle);
      expect(updates[0].message).toBe(testUpdate.message);
      expect(updates[0].readingStatus).toBe(testUpdate.readingStatus);
    });
    
    test('Handles errors during update sync', async () => {
      const testUpdate = {
        paperTitle: testPaper.title,
        message: 'Added to "Want to Read" list',
        timestamp: new Date().toISOString(),
        readingStatus: 'want_to_read'
      };
      
      setMockErrors(true);
      
      await expect(syncUpdateToKeystone(testUpdate, keystonePaperId)).rejects.toThrow('Mock KeystoneJS sync error');
      
      const updates = getMockUpdates();
      expect(updates.length).toBe(0);
    });
  });
}); 