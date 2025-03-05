import { config } from '@keystone-6/core';
import { lists } from './schema';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import 'dotenv/config'; // Import dotenv to load environment variables

// Define the authentication configuration
const sessionSecret = process.env.SESSION_SECRET || 'complex-secret-for-goodpapers-app';

// Define the auth configuration
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    skipKeystoneWelcome: true,
    // Use environment variables for initial admin user
    itemData: {
      name: 'Admin',
      email: process.env.KEYSTONE_ADMIN_USERNAME || 'admin',
      password: process.env.KEYSTONE_ADMIN_PW || 'admin',
    },
  },
});

// Define the Keystone config
export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: 'file:./goodpapers.db',
    },
    lists,
    session: statelessSessions({
      secret: sessionSecret,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    }),
    server: {
      port: 3002, // Use a different port to avoid conflicts
      cors: { origin: ['http://localhost:3000'], credentials: true },
    },
    // Additional configuration
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
); 