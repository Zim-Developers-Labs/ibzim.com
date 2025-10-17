'use server';

import { db, notifications } from '@/lib/server/db';
import { NotificationType } from '@/types';
import { desc, eq } from 'drizzle-orm';

export async function getUserNotifications(
  userId: number,
): Promise<NotificationType[] | []> {
  const userNotifications = await db
    .select({
      _id: notifications.id,
      description: notifications.description,
      _createdAt: notifications.createdAt,
      icon: notifications.icon,
      payloadForIcon: notifications.payloadForIcon,
      type: notifications.type,
      payloadForType: notifications.payloadForType,
      isRead: notifications.isRead,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  if (!userNotifications || userNotifications.length === 0) {
    return [];
  }

  return userNotifications.map((n) => ({
    ...n,
    _id: String(n._id),
    _createdAt: n._createdAt.toISOString(),
    icon: n.icon as NotificationType['icon'],
    type: n.type as NotificationType['type'],
    payloadForIcon: n.payloadForIcon
      ? JSON.parse(String(n.payloadForIcon))
      : undefined,
    payloadForType: n.payloadForType
      ? JSON.parse(String(n.payloadForType))
      : undefined,
    isRead: Boolean(n.isRead),
  }));
}
