# GoodPapers

GoodPapers is a research paper management application for scholars and researchers. It allows users to add, organize, and track their reading progress on academic papers.

## Authentication Features

GoodPapers now includes a complete user authentication system:

- **Google OAuth Authentication**: Users can log in with their Google accounts
- **User Management**: New users can create accounts with their name and email
- **Protected Routes**: Application content is only accessible to authenticated users
- **Session Management**: JWT-based authentication with secure HTTP-only cookies

## Setup Instructions

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install frontend dependencies
cd goodpapers && npm install
```

### 2. Set up Google OAuth Credentials

Run the setup script to get guided instructions for creating OAuth credentials:

```bash
npm run setup:oauth
```

After obtaining your Google OAuth credentials, add them to the `.env` file in the project root:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### 3. Start the Application

```bash
# Start the server (in one terminal)
npm start

# Start the frontend (in another terminal)
cd goodpapers && npm start
```

## Authentication Flow

1. Users visit the site and are redirected to `/login`
2. The login page provides a "Sign in with Google" button
3. After successful Google authentication:
   - If the user already exists, they are logged in and redirected to `/home`
   - If the user is new, they are redirected to `/create-account` to complete registration
4. Once authenticated, users have access to all protected routes

## Development Notes

- The authentication is implemented using Passport.js with Google OAuth2 strategy
- JWTs are stored in HTTP-only cookies for secure client-side storage
- User data is stored in the SQLite database
- Protected routes are managed through a `ProtectedRoute` component in React

## Production Deployment

When deploying to production, make sure to:

1. Use real, secure values for `JWT_SECRET` and `SESSION_SECRET`
2. Configure Google OAuth with the production domain
3. Set `NODE_ENV=production` in your environment variables

## Running the Application

### UI (Frontend)
