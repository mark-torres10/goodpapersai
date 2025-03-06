const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.join(__dirname, 'db', 'papers.db');
const db = new sqlite3.Database(dbPath);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'goodpapers-jwt-secret-key';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const CALLBACK_URL = process.env.NODE_ENV === 'production' 
  ? 'https://goodpapersai.com/api/auth/google/callback' 
  : 'http://localhost:3001/api/auth/google/callback';

// Helper function for database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Configure passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);
    
    if (existingUser) {
      // Update last login timestamp
      await dbRun(
        'UPDATE users SET last_login_timestamp = CURRENT_TIMESTAMP WHERE id = ?', 
        [existingUser.id]
      );
      return done(null, existingUser);
    }
    
    // If not, user needs to create an account
    return done(null, { 
      email: profile.emails[0].value,
      name: profile.displayName,
      needsRegistration: true
    });
  } catch (err) {
    console.error('Error in Google Strategy:', err);
    return done(err, null);
  }
}));

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  
  // Add user info to request
  req.user = decoded;
  next();
};

// Create a new user
const createUser = async (name, email) => {
  try {
    const result = await dbRun(
      'INSERT INTO users (name, email, last_login_timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [name, email]
    );
    
    if (result.lastID) {
      const newUser = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);
      return newUser;
    }
    
    throw new Error('Failed to create user');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = {
  passport,
  generateToken,
  verifyToken,
  isAuthenticated,
  createUser
}; 