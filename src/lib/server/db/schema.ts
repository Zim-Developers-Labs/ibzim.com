import {
  serial,
  text,
  integer,
  index,
  boolean,
  pgTableCreator,
  varchar,
  timestamp,
  jsonb,
  pgEnum,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { DATABASE_PREFIX as prefix } from '../../constants';

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

// User table
export const users = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    googleId: varchar('google_id', { length: 21 }).unique(),
    fullName: varchar('full_name', { length: 32 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }).unique(),
    avatar: varchar('avatar', { length: 255 }),
    username: text('username').notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    emailVerified: boolean('email_verified').notNull().default(false),
    phoneNumberVerified: boolean('phone_number_verified')
      .notNull()
      .default(false),
    totpKey: text('totp_key'),
    recoveryCode: text('recovery_code').notNull(),
    accessLevel: integer('access_level').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date()),
    ip: integer('ip').notNull().default(0),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    emailIndex: index('email_index').on(table.email),
    usernameIndex: index('username_index').on(table.username),
    googleIdx: index('user_google_idx').on(table.googleId),
  }),
);

// Session table
export const sessions = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    expiresAt: integer('expires_at').notNull(),
    twoFactorVerified: boolean('two_factor_verified').notNull().default(false),
    // Device and browser information
    deviceType: varchar('device_type', { length: 50 }), // 'desktop', 'mobile', 'tablet'
    deviceName: varchar('device_name', { length: 100 }), // 'Windows PC', 'iPhone 15', etc.
    browserName: varchar('browser_name', { length: 50 }), // 'Chrome', 'Safari', 'Firefox'
    browserVersion: varchar('browser_version', { length: 20 }),
    // Activity tracking
    lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
    ipAddress: varchar('ip_address', { length: 45 }), // IPv4 or IPv6
    userAgent: text('user_agent'), // Full user agent string for reference
    // Location (optional)
    location: varchar('location', { length: 100 }), // City, Country
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIndex: index('session_user_id_idx').on(table.userId),
    lastActiveIndex: index('session_last_active_idx').on(table.lastActiveAt),
  }),
);

// Email verification request table
export const emailVerificationRequests = pgTable('email_verification_request', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at').notNull(),
});

// Phone number verification request table
export const phoneNumberVerificationRequests = pgTable(
  'phone_number_verification_request',
  {
    id: text('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    phoneNumber: text('phone_number').notNull(),
    code: text('code').notNull(),
    expiresAt: integer('expires_at').notNull(),
  },
);

// Password reset session table
export const passwordResetSessions = pgTable('password_reset_session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  twoFactorVerified: boolean('two_factor_verified').notNull().default(false),
});

export const notifications = pgTable(
  'notification',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    description: text('description').notNull(),
    icon: varchar('icon', { length: 20 }).notNull(), // 'info', 'warning', 'error', 'success', 'user', 'users', 'award', 'ib', 'article'
    payloadForIcon: jsonb('payload_for_icon'), // Flexible JSON storage for icon payload
    type: varchar('type', { length: 30 }).notNull(), // 'withButtonLink', 'withSocialButtons', 'globalGeneral', 'userGeneral'
    payloadForType: jsonb('payload_for_type'), // Stores button links, social links, etc.
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIndex: index('notification_user_id_idx').on(table.userId),
  }),
);

// Add the recommended enum
export const recommendedEnum = pgEnum('recommended', ['yes', 'no', 'neutral']);

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    reviewerId: integer('reviewer_id')
      .notNull()
      .references(() => users.id),
    profileId: varchar('profile_id', { length: 50 }).notNull(),
    rating: decimal('rating').notNull(),
    comment: text('comment'),
    recommended: recommendedEnum('recommended').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    reviewerIdx: index('review_reviewer_idx').on(t.reviewerId),
    profileIdx: index('review_profile_idx').on(t.profileId),
    ratingIdx: index('review_rating_idx').on(t.rating),
  }),
);

export const paymentMethods = pgTable(
  'payment_methods',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 50 }).notNull(), // 'stripe', 'peyapeya', 'ecocash'
    type: varchar('type', { length: 50 }).notNull(), // 'card', 'fantasy-points', 'mobile_money'
    maskedNumber: varchar('masked_number', { length: 20 }).notNull(), // '**** **** **** 4242'
    token: text('token').notNull(), // Tokenized payment method for reuse
    isDefault: boolean('is_default').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true), // Soft delete capability
    expiryDate: varchar('expiry_date', { length: 7 }), // 'MM/YY' format for cards
    metadata: jsonb('metadata'), // Store provider-specific data
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index('payment_method_user_id_idx').on(table.userId),
    providerIndex: index('payment_method_provider_idx').on(table.provider),
    isDefaultIndex: index('payment_method_is_default_idx').on(table.isDefault),
  }),
);

export const checkoutTokens = pgTable(
  'checkout_tokens',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    interval: varchar('interval', { length: 20 }).notNull(), // 'one-time', 'monthly', 'yearly'
    plan: varchar('plan', { length: 50 }).notNull(), // Plan identifier
    amount: decimal('amount').notNull(), // Amount in cents or smallest currency unit
    currency: varchar('currency', { length: 3 }).notNull().default('USD'), // ISO 4217 currency code
    status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'completed', 'expired', 'cancelled'
    paymentMethodId: integer('payment_method_id').references(
      () => paymentMethods.id,
      { onDelete: 'set null' },
    ),
    metadata: jsonb('metadata'), // Store checkout-specific data (items, order info, etc.)
    expiresAt: timestamp('expires_at').notNull(),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index('checkout_token_user_id_idx').on(table.userId),
    tokenIndex: index('checkout_token_token_idx').on(table.token),
    statusIndex: index('checkout_token_status_idx').on(table.status),
    expiresAtIndex: index('checkout_token_expires_at_idx').on(table.expiresAt),
  }),
);

export const votes = pgTable(
  'votes',
  {
    id: serial('id').primaryKey(),
    voterId: integer('voter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    nomineeId: varchar('nominee_id').notNull(),
    titleId: varchar('title_id', { length: 21 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    voterIdIndex: index('votes_voter_id_idx').on(table.voterId),
    nomineeIdIndex: index('votes_nominee_id_idx').on(table.nomineeId),
    titleIdIndex: index('votes_title_id_idx').on(table.titleId),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  emailVerificationRequests: many(emailVerificationRequests),
  passwordResetSessions: many(passwordResetSessions),
  paymentMethods: many(paymentMethods),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const emailVerificationRequestsRelations = relations(
  emailVerificationRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationRequests.userId],
      references: [users.id],
    }),
  }),
);

export const passwordResetSessionsRelations = relations(
  passwordResetSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetSessions.userId],
      references: [users.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export const checkoutTokensRelations = relations(checkoutTokens, ({ one }) => ({
  user: one(users, {
    fields: [checkoutTokens.userId],
    references: [users.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [checkoutTokens.paymentMethodId],
    references: [paymentMethods.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  voter: one(users, {
    fields: [votes.voterId],
    references: [users.id],
  }),
  nominee: one(users, {
    fields: [votes.nomineeId],
    references: [users.id],
  }),
}));
