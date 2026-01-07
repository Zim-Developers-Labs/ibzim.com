import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { users } from '@/lib/server/db/schema';
import { neon, neonConfig } from '@neondatabase/serverless';
import { inArray, like } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { songIds } from './demo-data';
import { devConString } from '@/lib/constants';

// Load environment variables

let connectionString = process.env.DATABASE_URL;

if (!connectionString || process.env.NODE_ENV === 'development') {
  connectionString = devConString;
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${host}:${port}/sql`;
  };
}

const sql = neon(connectionString);
const db = drizzle({ client: sql });

async function clear() {
  console.log('🧹 Starting demo data cleanup...\n');

  try {
    // Find all demo users first
    const demoUsers = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(like(users.email, 'demo-%'));

    if (demoUsers.length === 0) {
      console.log('No demo data found to clear.');
      return;
    }

    const demoUserIds = demoUsers.map((u) => u.id);

    console.log(`Found ${demoUsers.length} demo user(s) to remove.\n`);

    const usersDeleted = await db
      .delete(users)
      .where(like(users.email, 'demo-%'))
      .returning({ id: users.id });
    console.log(`  ✓ Deleted ${usersDeleted.length} user(s)`);

    console.log('\n✅ Demo data cleanup completed successfully!');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

clear();
