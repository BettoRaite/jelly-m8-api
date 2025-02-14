import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  unique,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

// Users Table with enum
export const UsersTable = pgTable("UsersTable", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  userRole: varchar({ enum: ["admin", "user"] })
    .default("user")
    .notNull(),
  accessSecret: varchar("access_token", { length: 255 }).notNull(),
});

// User Profiles Table with enum
export const UserProfilesTable = pgTable(
  "UserProfilesTable",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      }),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    gender: varchar({
      enum: ["male", "female"],
    }).notNull(),
    biography: text("biography").notNull(),
    isActivated: boolean().default(false),
    activationSecret: varchar({ length: 255 }).notNull(),
    profileImageUrl: varchar("profile_image_url", { length: 500 }).notNull(),
  },
  (t) => [
    {
      userProfileConstraint: unique().on(t.id, t.userId),
    },
  ],
);

// Compliments Table
export const ComplimentsTable = pgTable(
  "ComplimentsTable",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", {
      length: 255,
    }).notNull(),
    content: text().notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => UsersTable.id),
    profileId: integer("profile_id")
      .notNull()
      .references(() => UserProfilesTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isAdmin: boolean("is_admin").default(false),
    likes: integer().default(0).notNull(),
  },
  (t) => [
    {
      userProfileConstraint: unique().on(t.userId, t.profileId),
    },
  ],
);

// Likes Table
export const LikesTable = pgTable(
  "LikesTable",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }), // User who liked,
    complimentId: integer("compliment_id")
      .references(() => ComplimentsTable.id, { onDelete: "cascade" })
      .notNull(), // Liked compliment (optional)
    // Timestamp of the like
  },
  (t) => ({
    // Ensure a user can only like a profile or compliment once
    uniqueLikeConstraint: unique().on(t.userId, t.complimentId),
  }),
);

export const QuestionsTable = pgTable("QuestionsTable", {
  id: serial("id").primaryKey(),
  content: varchar({ length: 255 }).notNull(),
  userId: integer()
    .references(() => UsersTable.id, { onDelete: "cascade" })
    .notNull(),
  isApproved: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Type Definitions
export type UserInsert = typeof UsersTable.$inferInsert;
export type UserSelect = typeof UsersTable.$inferSelect;

export type UserProfileInsert = typeof UserProfilesTable.$inferInsert;
export type UserProfileSelect = typeof UserProfilesTable.$inferSelect;

export type ComplimentInsert = typeof ComplimentsTable.$inferInsert;
export type ComplimentSelect = typeof ComplimentsTable.$inferSelect;

export type QuestionInsert = typeof QuestionsTable.$inferInsert;
export type QuestionSelect = typeof QuestionsTable.$inferSelect;

export type LikeInsert = typeof LikesTable.$inferInsert;
export type LikeSelect = typeof LikesTable.$inferSelect;

export type UserRole = UserSelect["userRole"];
export type UserGender = UserProfileSelect["gender"];
