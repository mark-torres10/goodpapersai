const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { syncPaperToKeystone, syncUpdateToKeystone } = require('./keystone-sync');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://goodpapersai.com', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Debug middleware for tracking requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Request received`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// Connect to SQLite database
const dbPath = path.join(__dirname, 'db', 'papers.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the papers database');
    
    // Initialize database tables
    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      // Create papers table
      db.run(`
        CREATE TABLE IF NOT EXISTS papers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          authors TEXT NOT NULL,
          journal TEXT,
          year INTEGER NOT NULL,
          doi TEXT,
          url TEXT,
          arxiv_link TEXT,
          abstract TEXT,
          is_currently_reading INTEGER DEFAULT 0,
          reading_status TEXT DEFAULT 'add_to_library',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create updates table
      db.run(`
        CREATE TABLE IF NOT EXISTS updates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          paper_id INTEGER,
          paper_title TEXT NOT NULL,
          message TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          reading_status TEXT,
          FOREIGN KEY (paper_id) REFERENCES papers (id) ON DELETE CASCADE
        )
      `);
      
      console.log('Database tables initialized');
    });
  }
});

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
    arxivLink: paper.arxiv_link || '',
    abstract: paper.abstract,
    isCurrentlyReading: paper.is_currently_reading === 1,
    readingStatus: paper.reading_status || 'add_to_library',
    createdAt: paper.created_at || new Date().toISOString(),
    updatedAt: paper.updated_at || new Date().toISOString()
  };
};

// Helper function to create a URL-friendly slug from a paper title and year
const createPaperSlug = (title, year) => {
  return `${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${year}`;
};

// API endpoints
// Order is important! More specific routes should be declared first

// Get a paper by slug
app.get('/api/papers/slug/:slug', (req, res) => {
  const slugParts = req.params.slug.split('-');
  const year = slugParts.pop(); // Extract the year from the end
  
  db.get('SELECT * FROM papers WHERE year = ? AND title LIKE ?', 
    [year, `%${slugParts.join(' ')}%`], 
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Paper not found' });
      }
      
      res.json(formatPaper(row));
  });
});

// Get currently reading papers
app.get('/api/papers/reading/current', (req, res) => {
  db.all('SELECT * FROM papers WHERE is_currently_reading = 1', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const papers = rows.map(formatPaper);
    res.json(papers);
  });
});

// Get a single paper by ID
app.get('/api/papers/:id', (req, res) => {
  db.get('SELECT * FROM papers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.json(formatPaper(row));
  });
});

// Get all papers
app.get('/api/papers', (req, res) => {
  db.all('SELECT * FROM papers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const papers = rows.map(formatPaper);
    res.json(papers);
  });
});

// Get all updates
app.get('/api/updates', (req, res) => {
  db.all('SELECT * FROM updates ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const updates = rows.map(update => ({
      id: update.id,
      paperId: update.paper_id,
      paperTitle: update.paper_title,
      message: update.message,
      timestamp: new Date(update.timestamp),
      readingStatus: update.reading_status || 'add_to_library'
    }));
    
    res.json(updates);
  });
});

// Create a new paper
app.post('/api/papers', async (req, res) => {
  const { title, authors, journal, year, doi, url, abstract, isCurrentlyReading, readingStatus, arxivLink } = req.body;
  
  if (!title || !authors || !year) {
    return res.status(400).json({ error: 'Title, authors, and year are required' });
  }
  
  const authorsSerialized = JSON.stringify(authors);
  const now = new Date().toISOString();
  
  // Check if paper with same arxivLink already exists
  if (arxivLink) {
    db.get('SELECT * FROM papers WHERE arxiv_link = ?', [arxivLink], async (err, existingPaper) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (existingPaper) {
        // Paper already exists, return it with a flag indicating it's a duplicate
        return res.status(200).json({
          ...formatPaper(existingPaper),
          isDuplicate: true,
          message: 'This paper is already in your library.'
        });
      } else {
        // Paper doesn't exist, insert new paper
        insertNewPaper();
      }
    });
  } else {
    // No arxivLink provided, proceed with insert
    insertNewPaper();
  }
  
  function insertNewPaper() {
    const sql = `
      INSERT INTO papers (
        title, authors, journal, year, doi, url, arxiv_link, abstract, 
        is_currently_reading, reading_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      sql,
      [
        title, 
        authorsSerialized, 
        journal, 
        year, 
        doi, 
        url, 
        arxivLink || null, 
        abstract, 
        isCurrentlyReading ? 1 : 0, 
        readingStatus || 'add_to_library',
        now,
        now
      ],
      async function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const paperId = this.lastID;
        
        // Determine the update message based on reading status
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
        
        // Create a new update record
        const updateSql = `
          INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(
          updateSql,
          [paperId, title, updateMessage, now, readingStatus || 'add_to_library'],
          async function(err) {
            if (err) {
              console.error('Error creating update record:', err);
              // Still return success for the paper creation
            }
            
            // Sync to KeystoneJS
            try {
              const paper = {
                title,
                authors: authorsSerialized,
                journal,
                year,
                doi,
                url,
                arxivLink: arxivLink || null,
                abstract,
                isCurrentlyReading,
                readingStatus: readingStatus || 'add_to_library',
                createdAt: now,
                updatedAt: now
              };
              
              const keystonePaperId = await syncPaperToKeystone(paper);
              
              const update = {
                paperTitle: title,
                message: updateMessage,
                timestamp: now,
                readingStatus: readingStatus || 'add_to_library'
              };
              
              await syncUpdateToKeystone(update, keystonePaperId);
              
              console.log('Successfully synced paper and update to KeystoneJS');
            } catch (syncError) {
              console.error('Error syncing to KeystoneJS:', syncError);
              // Don't fail the API response if KeystoneJS sync fails
            }
            
            res.status(201).json({
              id: paperId,
              title,
              authors,
              journal,
              year,
              doi,
              url,
              arxivLink: arxivLink || null,
              abstract,
              isCurrentlyReading,
              readingStatus,
              createdAt: now,
              updatedAt: now
            });
          }
        );
      }
    );
  }
});

// Fetch paper from ArXiv
app.post('/api/papers/fetch-arxiv', async (req, res) => {
  try {
    const { arxivId } = req.body;
    
    if (!arxivId) {
      return res.status(400).json({ error: 'ArXiv ID is required' });
    }
    
    // Fetch from ArXiv API
    const axios = require('axios');
    const { XMLParser } = require('fast-xml-parser');
    
    const response = await axios.get(`https://export.arxiv.org/api/query?id_list=${arxivId}`);
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(response.data);
    
    if (!result.feed.entry) {
      return res.status(404).json({ error: 'No paper found with that ID' });
    }
    
    const entry = result.feed.entry;
    
    // Extract authors (could be single author or array)
    let authorsList = [];
    if (Array.isArray(entry.author)) {
      authorsList = entry.author.map(author => author.name);
    } else if (entry.author && entry.author.name) {
      authorsList = [entry.author.name];
    }
    
    // Extract year from published date
    const publishedDate = new Date(entry.published);
    const year = publishedDate.getFullYear();
    
    // Extract DOI if available
    let doi = undefined;
    if (entry.doi) {
      doi = entry.doi;
    }
    
    // Create or format the ArXiv URL
    const arxivUrl = `https://arxiv.org/abs/${arxivId}`;
    
    // Check if paper with this arxivLink already exists
    db.get('SELECT * FROM papers WHERE arxiv_link = ?', [arxivUrl], (err, existingPaper) => {
      if (err) {
        console.error('Error checking for existing paper:', err);
        // Continue with the API response even if there's an error checking for duplicates
      }
      
      const paper = {
        title: entry.title.trim(),
        authors: authorsList,
        abstract: entry.summary.trim(),
        year,
        doi,
        url: arxivUrl,
        arxivLink: arxivUrl, // Add the arxiv link
        journal: 'arXiv preprint'
      };
      
      // If the paper exists, add the duplicate flag and existing paper info
      if (existingPaper) {
        const formattedPaper = formatPaper(existingPaper);
        res.json({
          ...paper,
          isDuplicate: true,
          existingPaper: formattedPaper,
          message: 'This paper is already in your library.'
        });
      } else {
        res.json(paper);
      }
    });
  } catch (error) {
    console.error('Error fetching paper from ArXiv:', error);
    res.status(500).json({ error: 'Failed to fetch paper from ArXiv' });
  }
});

// Update a paper's reading status
app.patch('/api/papers/:id/reading-status', async (req, res) => {
  const { readingStatus } = req.body;
  const paperId = req.params.id;
  
  if (!readingStatus) {
    return res.status(400).json({ error: 'Reading status is required' });
  }
  
  const now = new Date().toISOString();
  
  // Get the paper first to check if it exists
  db.get('SELECT * FROM papers WHERE id = ?', [paperId], async (err, paper) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Update the paper's reading status and updated_at timestamp
    const sql = `
      UPDATE papers 
      SET reading_status = ?, 
          is_currently_reading = ?,
          updated_at = ?
      WHERE id = ?
    `;
    
    const isCurrentlyReading = readingStatus === 'started_reading' ? 1 : 0;
    
    db.run(
      sql,
      [readingStatus, isCurrentlyReading, now, paperId],
      async function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Determine the update message based on reading status
        let updateMessage;
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
          case 'add_to_library':
            updateMessage = 'Moved to library';
            break;
          default:
            updateMessage = 'Updated reading status';
        }
        
        // Create a new update record
        const updateSql = `
          INSERT INTO updates (paper_id, paper_title, message, timestamp, reading_status)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(
          updateSql,
          [paperId, paper.title, updateMessage, now, readingStatus],
          async function(err) {
            if (err) {
              console.error('Error creating update record:', err);
              // Still return success for the paper update
            }
            
            // Sync to KeystoneJS (if available)
            try {
              if (typeof syncPaperToKeystone === 'function') {
                const updatedPaper = {
                  ...paper,
                  readingStatus,
                  isCurrentlyReading: isCurrentlyReading === 1,
                  updatedAt: now
                };
                
                await syncPaperToKeystone(updatedPaper);
                
                const update = {
                  paperTitle: paper.title,
                  message: updateMessage,
                  timestamp: now,
                  readingStatus
                };
                
                await syncUpdateToKeystone(update, paper.keystone_id);
                
                console.log('Successfully synced paper update to KeystoneJS');
              }
            } catch (syncError) {
              console.error('Error syncing to KeystoneJS:', syncError);
              // Don't fail the API response if KeystoneJS sync fails
            }
            
            // Send back the updated paper
            db.get('SELECT * FROM papers WHERE id = ?', [paperId], (err, updatedPaper) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              
              res.json(formatPaper(updatedPaper));
            });
          }
        );
      }
    );
  });
});

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 