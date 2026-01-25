import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import {
  reviews,
  paymentMethods,
  votes,
  users,
  sessions,
  notifications,
} from '@/lib/server/db/schema';
import { getDemoData } from './demo-data';
import { devConString } from '@/lib/constants';

// Load environment variables
dotenv.config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL;

if (!connectionString || process.env.NODE_ENV === 'development') {
  connectionString = devConString;
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${host}:${port}/sql`;
  };
}

const sqlClient = neon(connectionString);
const db = drizzle({ client: sqlClient });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    console.log('Creating demo users...');
    const createdUsers: { id: number; email: string }[] = [];

    const demoData = getDemoData();

    for (let i = 0; i < demoData.users.length; i++) {
      const userData = demoData.users[i];
      const fullName = `${userData.firstName} ${userData.lastName}`;

      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          fullName,
          username: userData.username,
          phoneNumber: userData.phoneNumber,
          emailVerified: userData.emailVerified,
          phoneNumberVerified: userData.phoneNumberVerified,
          recoveryCode: `DEMO-RECOVERY-${i + 1}-${Date.now()}`,
          accessLevel: userData.accessLevel,
          ip: userData.ip,
        })
        .returning({ id: users.id, email: users.email });

      createdUsers.push(user);
      console.log(`  ✓ Created user: ${userData.email}`);
    }

    console.log('\nCreating demo sessions...');
    for (const sessionData of demoData.sessions) {
      const user = createdUsers[sessionData.userIndex];
      await db.insert(sessions).values({
        id: `demo-session-${user.id}-${sessionData.deviceType}-${Date.now()}`,
        userId: user.id,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        twoFactorVerified: sessionData.twoFactorVerified,
        deviceType: sessionData.deviceType,
        deviceName: sessionData.deviceName,
        browserName: sessionData.browserName,
        browserVersion: sessionData.browserVersion,
        ipAddress: sessionData.ipAddress,
        location: sessionData.location,
        userAgent: 'Mozilla/5.0 (Demo User Agent)',
      });
      console.log(
        `  ✓ Created ${sessionData.deviceType} session for user ${user.id}`,
      );
    }

    console.log('\nCreating demo notifications...');
    for (const notifData of demoData.notifications) {
      const user = createdUsers[notifData.userIndex];
      await db.insert(notifications).values({
        userId: user.id,
        description: notifData.description,
        icon: notifData.icon,
        type: notifData.type,
        isRead: notifData.isRead,
        payloadForIcon: { demo: true },
        payloadForType: { buttonText: 'Learn More', buttonLink: '/demo' },
      });
      console.log(`  ✓ Created notification for user ${user.id}`);
    }

    console.log('\nCreating demo reviews...');
    for (const reviewData of demoData.reviews) {
      const reviewer = createdUsers[reviewData.reviewerIndex];
      const target = createdUsers[reviewData.targetIndex];
      await db.insert(reviews).values({
        reviewerId: reviewer.id,
        profileId: `profile-${target.id}`,
        rating: reviewData.rating,
        comment: reviewData.comment,
        recommended:
          reviewData.recommended === 'yes'
            ? 'yes'
            : reviewData.recommended === 'no'
              ? 'no'
              : 'neutral',
      });
      console.log(
        `  ✓ Created review from user ${reviewer.id} for profile-${target.id}`,
      );
    }

    console.log('\nCreating demo payment methods...');
    for (const paymentData of demoData.paymentMethods) {
      const user = createdUsers[paymentData.userIndex];
      await db.insert(paymentMethods).values({
        userId: user.id,
        provider: paymentData.provider,
        type: paymentData.type,
        maskedNumber: paymentData.maskedNumber,
        token: `demo-token-${user.id}-${Date.now()}`,
        isDefault: true,
        expiryDate: paymentData.expiryDate,
        metadata: { demo: true },
      });
      console.log(`  ✓ Created payment method for user ${user.id}`);
    }

    console.log('\nCreating demo votes...');
    for (const voteData of demoData.votes) {
      const user = createdUsers[voteData.userIndex];
      await db.insert(votes).values({
        userId: user.id,
        nomineeId: voteData.nomineeId,
        titleId: voteData.titleId,
        categoryId: voteData.categoryId,
      });
      console.log(`  ✓ Created vote for user ${user.id}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(
      `   Created ${createdUsers.length} demo users with related data.`,
    );
    console.log('   Demo users have emails starting with "demo-"');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
