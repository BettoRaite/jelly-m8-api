import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// Users Table
export const UserTable = pgTable("User", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  userRole: varchar("user_role", { length: 10 }).notNull(),
  accessSecret: varchar("access_token", { length: 255 }).notNull(),
});

// Profiles Table
export const UserProfileTable = pgTable("UserProfile", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => UserTable.id), // Foreign key referencing UserTable
  displayName: varchar("display_name", { length: 100 }).notNull(),
  gender: varchar("user_role", { length: 10 }).notNull(),
  biography: text("biography").notNull(),
  isActivated: boolean("is_active").default(false),
  profileImageUrl: varchar("profile_image_url", { length: 500 }).notNull(),
});

// Compliments Table
export const ComplimentTable = pgTable(
  "Compliment",
  {
    id: serial("id").primaryKey(),
    messageContent: text("message_content").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => UserTable.id),
    profileId: integer("profile_id")
      .notNull()
      .references(() => UserProfileTable.id),
  },
  (t) => [
    {
      userProfileConstraint: unique().on(t.userId, t.profileId),
    },
  ],
);

// Type Definitions
export type UserInsert = typeof UserTable.$inferInsert; // Type for inserting a user
export type UserSelect = typeof UserTable.$inferSelect; // Type for selecting a user

export type UserProfileInsert = typeof UserProfileTable.$inferInsert; // Type for inserting a user profile
export type UserProfileSelect = typeof UserProfileTable.$inferSelect; // Type for selecting a user profile

export type ComplimentInsert = typeof ComplimentTable.$inferInsert; // Type for inserting a compliment
export type ComplimentSelect = typeof ComplimentTable.$inferSelect; // Type for selecting a compliment
