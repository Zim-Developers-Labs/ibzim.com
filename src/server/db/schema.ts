import { relations } from 'drizzle-orm';
import {
  pgTableCreator,
  serial,
  boolean,
  index,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { DATABASE_PREFIX as prefix } from '@/lib/constants';

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    googleId: varchar('google_id', { length: 21 }).unique(),
    githubId: varchar('github_id', { length: 21 }).unique(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    hashedPassword: varchar('hashed_password', { length: 255 }),
    avatar: varchar('avatar', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date(),
    ),
    fullName: varchar('full_name', { length: 32 }).notNull(),
    username: varchar('username', { length: 48 }).unique().notNull(),
    phoneNumber: varchar('phone_number', { length: 15 }),
    phoneNumberVerified: boolean('phone_number_verified')
      .default(false)
      .notNull(),
    country: varchar('country', { length: 100 }),
    city: varchar('city', { length: 100 }),
    dateOfBirth: timestamp('date_of_birth'),
    profileCompleted: boolean('profile_completed').default(false),
    organizerProfileCreated: boolean('organizer_profile_created').default(
      false,
    ),
    role: varchar('role', { length: 8 }),
    communicationSettings: jsonb('communication_settings').default({
      preferences: {
        ads: true,
        account: true,
        notifications: true,
      },
    }),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    emailIdx: index('user_email_idx').on(t.email),
    googleIdx: index('user_google_idx').on(t.googleId),
    githubIdx: index('user_github_idx').on(t.githubId),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const organizerProfiles = pgTable(
  'organizer_profiles',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 32 }),
    email: varchar('email', { length: 255 }).unique(),
    emailVerified: boolean('email_verified').default(false),
    whatsappPhoneNumber: varchar('whatsapp_phone_number', { length: 15 }),
    whatsappPhoneNumberVerified: boolean(
      'whatsapp_phone_number_verified',
    ).default(false),
    callsPhoneNumber: varchar('calls_phone_number', { length: 15 }),
    callsPhoneNumberVerified: boolean('calls_phone_number_verified').default(
      false,
    ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    profileCompleted: boolean('profile_completed').default(false),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    userIdx: index('profile_user_idx').on(t.userId),
  }),
);

export type OrganizerProfile = typeof organizerProfiles.$inferSelect;
export type NewOrganizerProfile = typeof organizerProfiles.$inferInsert;

export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 21 }).notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (t) => ({
    userIdx: index('session_user_idx').on(t.userId),
  }),
);

export const emailVerificationCodes = pgTable(
  'email_verification_codes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 21 }).unique().notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    code: varchar('code', { length: 8 }).notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (t) => ({
    userIdx: index('verification_code_user_idx').on(t.userId),
    emailIdx: index('verification_code_email_idx').on(t.email),
  }),
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: varchar('id', { length: 40 }).primaryKey(),
    userId: varchar('user_id', { length: 21 }).notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (t) => ({
    userIdx: index('password_token_user_idx').on(t.userId),
  }),
);

export const comments = pgTable(
  'comments',
  {
    commentId: varchar('comment_id', { length: 21 }).primaryKey(),
    articleId: varchar('article_id', { length: 50 }).notNull(),
    userId: varchar('user_id', { length: 21 }).notNull(),
    commentText: text('comment_text').notNull(),
    parentCommentId: varchar('parent_comment_id', { length: 21 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
    likesCount: integer('likes_count').default(0).notNull(),
    dislikesCount: integer('dislikes_count').default(0).notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    articleIdx: index('comment_article_idx').on(t.articleId),
    userIdx: index('comment_user_idx').on(t.userId),
    parentCommentIdx: index('comment_parent_comment_idx').on(t.parentCommentId),
    articleUserIdx: index('comment_article_user_idx').on(t.articleId, t.userId),
  }),
);

export type CommentType = typeof comments.$inferSelect;
export type NewCommentType = typeof comments.$inferInsert;

export const commentReactions = pgTable(
  'comment_reactions',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    userId: varchar('user_id', { length: 21 }).notNull(),
    commentId: varchar('comment_id', { length: 21 }).notNull(),
    reaction: varchar('reaction', { length: 10 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    commentIdx: index('comment_reaction_comment_idx').on(t.commentId),
    userIdx: index('comment_reaction_user_idx').on(t.userId),
    userCommentReactionIdx: index('user_comment_reaction_idx').on(
      t.userId,
      t.commentId,
      t.reaction,
    ),
  }),
);

export type CommentLike = typeof commentReactions.$inferSelect;
export type NewCommentLike = typeof commentReactions.$inferInsert;

export const actionTakenEnum = pgEnum('action_taken', [
  'none',
  'hidden',
  'deleted',
]);
export const statusEnum = pgEnum('comment_report_status', [
  'pending',
  'reviewed',
  'resolved',
]);

export const commentReports = pgTable(
  'comment_reports',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    commentId: varchar('comment_id', { length: 21 })
      .notNull()
      .references(() => comments.commentId),
    reporterId: varchar('reporter_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    reason: varchar('reason').notNull(),
    status: statusEnum('comment_report_status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    reviewedBy: varchar('reviewed_by', { length: 21 }).references(
      () => users.id,
    ),
    reviewedAt: timestamp('reviewed_at'),
    actionTaken: actionTakenEnum('action_taken'),
  },
  (t) => ({
    reportStatusIdx: index('comment_report_status_idx').on(
      t.status,
      t.createdAt,
    ),
  }),
);

export type CommentReport = typeof commentReports.$inferSelect;
export type NewCommentReport = typeof commentReports.$inferInsert;

export const articleClaps = pgTable(
  'article_claps',
  {
    articleId: varchar('article_id').notNull(),
    userId: varchar('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },

  (table) => ({
    articleUserClapIdx: index('article_user_clap_idx').on(
      table.articleId,
      table.userId,
      table.createdAt,
    ),
    pk: primaryKey({ columns: [table.articleId, table.userId] }),
  }),
);

export type ArticleClap = typeof commentReports.$inferSelect;
export type NewArticleClap = typeof commentReports.$inferInsert;

export const savedArticles = pgTable(
  'saved_articles',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    articleId: varchar('article_id').notNull(),
    savedAt: timestamp('saved_at').defaultNow().notNull(),
  },
  (t) => ({
    userArticleIdx: index('user_article_idx').on(t.userId, t.articleId),
  }),
);

export type SavedArticle = typeof savedArticles.$inferSelect;
export type NewSavedArticle = typeof savedArticles.$inferInsert;

export const achievementStatusEnum = pgEnum('achievement_status', [
  'locked',
  'pending',
  'completed',
  'claimed',
]);

export const userAchievements = pgTable(
  'user_achievements',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    achievementId: varchar('achievement_id', { length: 3 }).notNull(),
    status: achievementStatusEnum('achievement_status')
      .notNull()
      .default('locked'),
    completedAt: timestamp('completed_at'),
    claimedAt: timestamp('claimed_at'),
  },
  (t) => ({
    userIdIdx: index('user_achievement_user_id_idx').on(t.userId),
    achievementIdIdx: index('user_achievement_achievement_id_idx').on(
      t.achievementId,
    ),
    userStatusIdx: index('user_achievement_status_idx').on(t.userId, t.status),
  }),
);

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export const requestStatusEnum = pgEnum('request_status', [
  'pending',
  'verified',
  'rejected',
]);

export const followVerificationRequests = pgTable(
  'follow_verification_requests',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    platformName: varchar('platform_name', { length: 50 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    requestDate: timestamp('request_date').notNull().defaultNow(),
    userAchievementId: varchar('user_achievement_id', { length: 21 })
      .notNull()
      .references(() => userAchievements.id),
    status: requestStatusEnum('request_status').notNull().default('pending'),
  },
  (t) => ({
    userStatusIdx: index('follow_verification_user_status_idx').on(
      t.userId,
      t.status,
      t.requestDate,
    ),
  }),
);

export type FollowVerificationRequest =
  typeof followVerificationRequests.$inferSelect;
export type NewFollowVerificationRequest =
  typeof followVerificationRequests.$inferInsert;

// Add this enum for event types
export const eventTypeEnum = pgEnum('event_type', [
  'party',
  'conference',
  'competition',
  'workshop',
  'meeting',
  'social',
  'training',
  'webinar',
  'concert',
  'festival',
  'show',
  'exhibition',
  'chat',
  'awards',
  'chillout',
]);

export const eventCategoryEnum = pgEnum('event_category', [
  'holiday',
  'business',
  'tech',
  'community',
  'school',
  'music',
  'religious',
  'public',
  'ibzim',
  'casual',
  'sports',
]);

// Add this enum for event priority
export const eventPriorityEnum = pgEnum('event_priority', [
  'high',
  'medium',
  'low',
]);

export const eventLocationTypeEnum = pgEnum('event_location_type', [
  'virtual',
  'physical',
]);

export const eventRecurrenceEnum = pgEnum('event_recurrence', [
  'none',
  'monthly',
  'yearly',
]);

export const events = pgTable(
  'events',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    approved: boolean('approved').default(false).notNull(),
    approvalExpiry: timestamp('approval_expiry'),
    title: varchar('title', { length: 255 }).notNull(),
    ticketsLink: varchar('tickets_link', { length: 300 }),
    startTime: varchar('start_time', { length: 10 }),
    startDate: timestamp('start_date').notNull(),
    endTime: varchar('end_time', { length: 10 }),
    endDate: timestamp('end_date'),
    type: eventTypeEnum('event_type'),
    category: eventCategoryEnum('event_category').notNull(),
    description: text('description'),
    pricingDetails: text('pricing_details'),
    location: varchar('location', { length: 255 }),
    locationType: eventLocationTypeEnum('event_location_type'),
    locationLink: varchar('location_link', { length: 300 }),
    priority: eventPriorityEnum('event_priority').default('low').notNull(),
    eventOrganizerId: varchar('event_organizer_id', { length: 21 }).references(
      () => organizerProfiles.id,
    ),
    recurrence: eventRecurrenceEnum('event_recurrence')
      .default('none')
      .notNull(),
    pricingTiers: varchar('pricing_tiers'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    organizerIdx: index('event_organizer_idx').on(t.eventOrganizerId),
    dateIdx: index('event_date_idx').on(t.startDate),
    typeIdx: index('event_type_idx').on(t.type),
    categoryIdx: index('event_category_idx').on(t.category),
    priorityIdx: index('event_priority_idx').on(t.priority),
    organizerDateIdx: index('event_organizer_date_idx').on(
      t.eventOrganizerId,
      t.startDate,
    ),
  }),
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export const answers = pgTable(
  'answers',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    questionId: varchar('question_id', { length: 21 }).notNull(),
    userName: varchar('user_name', { length: 50 }).notNull(),
    content: text('content').notNull(),
    likesCount: integer('likes_count').default(0).notNull(),
    tool: varchar('tool', { length: 50 }).notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => ({
    questionIdx: index('answer_question_idx').on(t.questionId),
    questionUserIdx: index('answer_question_user_idx').on(t.questionId),
  }),
);

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;

export const answerLikes = pgTable(
  'answer_likes',
  {
    answerId: varchar('answer_id').notNull(),
    userId: varchar('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },

  (table) => ({
    answerUserLikeIdx: index('answer_user_like_idx').on(
      table.answerId,
      table.userId,
      table.createdAt,
    ),
    pk: primaryKey({ columns: [table.answerId, table.userId] }),
  }),
);

export type AnswerLike = typeof answerLikes.$inferSelect;
export type NewAnswerLike = typeof answerLikes.$inferInsert;

// ----------------------- Add All Relationships Here------------------------------------- //

export const followVerificationRequestsRelations = relations(
  followVerificationRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [followVerificationRequests.userId],
      references: [users.id],
    }),
    userAchievement: one(userAchievements, {
      fields: [followVerificationRequests.userAchievementId],
      references: [userAchievements.id],
    }),
  }),
);

export const savedArticlesRelations = relations(savedArticles, ({ one }) => ({
  user: one(users, {
    fields: [savedArticles.userId],
    references: [users.id],
  }),
}));

// Add relations for the events table
export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(organizerProfiles, {
    fields: [events.eventOrganizerId],
    references: [organizerProfiles.id],
  }),
}));

// Update the userRelations to include events
export const userRelations = relations(users, ({ many }) => ({
  achievements: many(userAchievements),
  followVerificationRequests: many(followVerificationRequests),
  organizedEvents: many(events), // Add this line
}));

export const commentReportRelations = relations(commentReports, ({ one }) => ({
  comment: one(comments, {
    fields: [commentReports.commentId],
    references: [comments.commentId],
  }),
  reporter: one(users, {
    fields: [commentReports.reporterId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [commentReports.reviewedBy],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
  }),
);

export const organizerProfilesRelations = relations(
  organizerProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [organizerProfiles.userId],
      references: [users.id],
    }),
  }),
);

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, {
    fields: [answers.userName],
    references: [users.fullName],
  }),
}));

// ----------------------- End of Relationships------------------------------------- //
