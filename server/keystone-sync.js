// KeystoneJS Integration Service
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../admin/.env') });

// KeystoneJS GraphQL endpoint
const KEYSTONE_ENDPOINT = 'http://localhost:3002/api/graphql';
const KEYSTONE_AUTH_ENDPOINT = 'http://localhost:3002/api/session';

// Admin credentials for authenticated requests
const ADMIN_EMAIL = process.env.KEYSTONE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.KEYSTONE_ADMIN_PW || 'admin';

// Session token storage
let sessionToken = null;

/**
 * Authenticate with KeystoneJS admin API
 */
async function authenticateWithKeystone() {
  try {
    const response = await axios.post(KEYSTONE_AUTH_ENDPOINT, {
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (response.data && response.headers['set-cookie']) {
      const cookie = response.headers['set-cookie'][0];
      sessionToken = cookie.split(';')[0];
      console.log('Successfully authenticated with KeystoneJS');
      return true;
    } else {
      console.error('Failed to authenticate with KeystoneJS: No session token received');
      return false;
    }
  } catch (error) {
    console.error('Failed to authenticate with KeystoneJS:', error.message);
    return false;
  }
}

/**
 * Execute a GraphQL query/mutation with authentication
 */
async function executeGraphQL(query, variables = {}) {
  // Authenticate if we don't have a session token
  if (!sessionToken) {
    const authenticated = await authenticateWithKeystone();
    if (!authenticated) {
      throw new Error('Failed to authenticate with KeystoneJS');
    }
  }
  
  try {
    const response = await axios.post(
      KEYSTONE_ENDPOINT,
      { query, variables },
      { headers: { Cookie: sessionToken } }
    );
    
    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      throw new Error('GraphQL execution failed: ' + response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to execute GraphQL:', error.message);
    
    // If unauthorized, try to reauthenticate
    if (error.response && error.response.status === 401) {
      sessionToken = null;
      console.log('Session expired, reauthenticating...');
      return executeGraphQL(query, variables); // Retry after auth
    }
    
    throw error;
  }
}

/**
 * Create or update a paper in KeystoneJS
 */
async function syncPaperToKeystone(paper) {
  // First, check if paper already exists
  const findPaperQuery = `
    query FindPaper($title: String!, $year: Int!) {
      papers(where: { title: { equals: $title }, year: { equals: $year } }) {
        id
      }
    }
  `;
  
  try {
    const result = await executeGraphQL(findPaperQuery, {
      title: paper.title,
      year: paper.year
    });
    
    if (result.papers && result.papers.length > 0) {
      // Paper exists, update it
      const updatePaperMutation = `
        mutation UpdatePaper($id: ID!, $data: PaperUpdateInput!) {
          updatePaper(where: { id: $id }, data: $data) {
            id
            title
          }
        }
      `;
      
      await executeGraphQL(updatePaperMutation, {
        id: result.papers[0].id,
        data: {
          title: paper.title,
          authors: paper.authors,
          journal: paper.journal || '',
          year: paper.year,
          doi: paper.doi || '',
          url: paper.url || '',
          abstract: paper.abstract || '',
          isCurrentlyReading: paper.isCurrentlyReading || false
        }
      });
      
      console.log(`Paper updated in KeystoneJS: ${paper.title}`);
      return result.papers[0].id;
    } else {
      // Paper doesn't exist, create it
      const createPaperMutation = `
        mutation CreatePaper($data: PaperCreateInput!) {
          createPaper(data: $data) {
            id
            title
          }
        }
      `;
      
      const result = await executeGraphQL(createPaperMutation, {
        data: {
          title: paper.title,
          authors: paper.authors,
          journal: paper.journal || '',
          year: paper.year,
          doi: paper.doi || '',
          url: paper.url || '',
          abstract: paper.abstract || '',
          isCurrentlyReading: paper.isCurrentlyReading || false
        }
      });
      
      console.log(`Paper created in KeystoneJS: ${paper.title}`);
      return result.createPaper.id;
    }
  } catch (error) {
    console.error(`Failed to sync paper "${paper.title}" to KeystoneJS:`, error.message);
    throw error;
  }
}

/**
 * Create an update in KeystoneJS
 */
async function syncUpdateToKeystone(update, keystonePaperId) {
  try {
    const createUpdateMutation = `
      mutation CreateUpdate($data: UpdateCreateInput!) {
        createUpdate(data: $data) {
          id
          message
        }
      }
    `;
    
    // Prepare data object with any extra fields we want to include
    const updateData = {
      paperTitle: update.paperTitle,
      message: update.message,
      timestamp: update.timestamp,
      paper: { connect: { id: keystonePaperId } }
    };
    
    // If we have reading status, include it in an additional field in KeystoneJS
    if (update.readingStatus) {
      updateData.reading_status = update.readingStatus;
    }
    
    await executeGraphQL(createUpdateMutation, {
      data: updateData
    });
    
    console.log(`Update created in KeystoneJS: ${update.message}`);
  } catch (error) {
    console.error(`Failed to sync update "${update.message}" to KeystoneJS:`, error.message);
    throw error;
  }
}

module.exports = {
  syncPaperToKeystone,
  syncUpdateToKeystone
}; 