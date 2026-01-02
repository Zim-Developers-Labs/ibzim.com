import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import {
  reviews,
  paymentMethods,
  votes,
  fanStatus,
  users,
  sessions,
  notifications,
  songVotes,
  weeklyCharts,
} from '@/lib/server/db/schema';
import { getDemoData } from './demo-data';
import { sql } from 'drizzle-orm';
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

    console.log('\nCreating demo fan statuses...');
    for (const fanData of demoData.fanStatuses) {
      const user = createdUsers[fanData.userIndex];
      await db.insert(fanStatus).values({
        userId: user.id,
        artistProfileId: fanData.artistProfileId,
      });
      console.log(`  ✓ Created fan status for user ${user.id}`);
    }

    console.log('\nCreating demo song votes...');
    for (const songVoteData of demoData.songVotes) {
      const user = createdUsers[songVoteData.userIndex];
      await db.insert(songVotes).values({
        userId: user.id,
        songId: songVoteData.songId,
        voteType: songVoteData.voteType,
      });
      console.log(
        `  ✓ Created song vote for user ${user.id} on ${songVoteData.songId}`,
      );
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

    console.log('\nCreating demo weekly charts with calculated positions...');

    // Group chart entries by weekStartDate
    const chartsByWeek = new Map<
      string,
      { songId: string; weekStartDate: Date }[]
    >();
    for (const chartData of demoData.weeklyCharts) {
      const weekKey = chartData.weekStartDate.toISOString();
      if (!chartsByWeek.has(weekKey)) {
        chartsByWeek.set(weekKey, []);
      }
      chartsByWeek.get(weekKey)!.push(chartData);
    }

    // For each week, calculate positions based on upvote counts
    for (const [weekKey, entries] of chartsByWeek) {
      // Get upvote counts for each song from the database
      const songUpvoteCounts = await db
        .select({
          songId: songVotes.songId,
          upVoteCount:
            sql<number>`count(*) filter (where ${songVotes.voteType} = 'upvote')`.as(
              'upVoteCount',
            ),
          downVoteCount:
            sql<number>`count(*) filter (where ${songVotes.voteType} = 'downvote')`.as(
              'downVoteCount',
            ),
        })
        .from(songVotes)
        .groupBy(songVotes.songId);

      // Create a map of songId to net votes (upvotes - downvotes)
      const voteCountMap = new Map<string, number>();
      for (const row of songUpvoteCounts) {
        voteCountMap.set(row.songId, row.upVoteCount - row.downVoteCount);
      }

      // Sort songs by net vote count (descending) to determine positions
      const sortedSongs = entries
        .map((entry) => ({
          ...entry,
          netVotes: voteCountMap.get(entry.songId) || 0,
        }))
        .sort((a, b) => b.netVotes - a.netVotes);

      // Insert with calculated positions
      for (let i = 0; i < sortedSongs.length; i++) {
        const position = i + 1;
        await db.insert(weeklyCharts).values({
          songId: sortedSongs[i].songId,
          position,
          weekStartDate: sortedSongs[i].weekStartDate,
        });
        console.log(
          `  ✓ Created chart entry: position ${position} for song ${sortedSongs[i].songId.slice(0, 8)}... (week: ${weekKey.slice(0, 10)})`,
        );
      }
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(
      `   Created ${createdUsers.length} demo users with related data.`,
    );
    console.log(
      `   Created ${demoData.weeklyCharts.length} weekly chart entries.`,
    );
    console.log('   Demo users have emails starting with "demo-"');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
