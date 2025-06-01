import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { env } from '@/env.js';
import { db } from '@/server/db';
import { sessions, users, type User as DbUser } from '@/server/db/schema';
import { Google } from 'arctic';
import { absoluteUrl } from '../utils';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (/* attributes */) => {
    return {};
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      googleId: attributes.googleId,
      githubId: attributes.githubId,
      emailVerified: attributes.emailVerified,
      avatar: attributes.avatar,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      fullName: attributes.fullName,
      username: attributes.username,
      country: attributes.country,
      city: attributes.city,
      dateOfBirth: attributes.dateOfBirth,
      phoneNumber: attributes.phoneNumber,
      phoneNumberVerified: attributes.phoneNumberVerified,
      profileCompleted: attributes.profileCompleted,
      organizerProfileCreated: attributes.organizerProfileCreated,
      communicationSettings: attributes.communicationSettings,
      role: attributes.role,
      deletedAt: attributes.deletedAt,
    };
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    name: 'session',

    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: env.NODE_ENV === 'production',
    },
  },
});

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  absoluteUrl('/sign-in/google/callback'),
);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseSessionAttributes = object;
type DatabaseUserAttributes = Omit<DbUser, 'hashedPassword'>;
