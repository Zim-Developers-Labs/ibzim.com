'use server';

import { getCurrentRank } from '@/components/ranking/ranks';
import { db, notifications, users } from '@/lib/server/db';
import { eq } from 'drizzle-orm';

interface ActionResponse {
  error?: string;
  done?: boolean;
}

export async function incrementUserIP(
  userId: number,
  username: string,
  newIp: number,
  oldIp: number,
): Promise<ActionResponse> {
  try {
    await db.update(users).set({ ip: newIp }).where(eq(users.id, userId));

    const oldRank = getCurrentRank(oldIp);
    const newRank = getCurrentRank(newIp);

    // If rank has changed, add a notification
    if (oldRank.name !== newRank.name) {
      await addRankNotification(userId, username, newRank.name);
    }

    return {
      done: true,
    };
  } catch (err) {
    return {
      error: `${err}`,
    };
  }
}

async function addRankNotification(
  userId: number,
  username: string,
  rankName: string,
): Promise<void> {
  await db.insert(notifications).values({
    userId,
    description: `Congratulations! You've reached a new rank: ${rankName}`,
    icon: rankName,
    type: 'withButtonLink',
    payloadForType: [
      {
        buttonLinkUrl: `/${username}`,
        buttonLinkText: 'View Profile',
      },
    ],
  });
}
