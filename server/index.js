const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, 'db', 'papers.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the papers database');
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
    abstract: paper.abstract,
    isCurrentlyReading: paper.is_currently_reading === 1
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
      timestamp: new Date(update.timestamp)
    }));
    
    res.json(updates);
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