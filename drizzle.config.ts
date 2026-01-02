import { defineConfig } from 'drizzle-kit';
import { DATABASE_PREFIX, devConString } from './src/lib/constants';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL not found in environment');
}

if (process.env.NODE_ENV === 'development') {
  connectionString = devConString;
}

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  tablesFilter: [`${DATABASE_PREFIX}_*`],
});
