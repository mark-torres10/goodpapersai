const sqlite3 = require('sqlite3').verbose();

/**
 * Creates an in-memory SQLite database for testing
 */
function createTestDatabase() {
  const db = new sqlite3.Database(':memory:');
  
  return new Promise((resolve, reject) => {
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
          abstract TEXT,
          is_currently_reading INTEGER DEFAULT 0,
          reading_status TEXT DEFAULT 'add_to_library'
        )
      `, (err) => {
        if (err) reject(err);
      });
      
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
      `, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  });
}

/**
 * Close the database connection
 */
function closeTestDatabase(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Helper to run a query and get all results
 */
function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Helper to run a query and get a single result
 */
function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Helper to run a query without expecting results
 */
function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this); // Contains lastID and changes
    });
  });
}

module.exports = {
  createTestDatabase,
  closeTestDatabase,
  dbAll,
  dbGet,
  dbRun
}; 