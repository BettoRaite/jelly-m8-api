import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  unique,
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
export const UserProfilesTable = pgTable("UserProfilesTable", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => UsersTable.id),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  gender: varchar({
    enum: ["male", "female"],
  }).notNull(),
  biography: text("biography").notNull(),
  isActivated: boolean("is_active").default(false),
  activationSecret: varchar({ length: 255 }).notNull(),
  profileImageUrl: varchar("profile_image_url", { length: 500 }).notNull(),

}, (t) => [
  {
    userProfileConstraint: unique().on(t.id, t.userId),
  },
],);

// Compliments Table
export const ComplimentsTable = pgTable(
  "ComplimentsTable",
  {
    id: serial("id").primaryKey(),
    messageContent: text("message_content").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => UsersTable.id),
    profileId: integer("profile_id")
      .notNull()
      .references(() => UserProfilesTable.id),
  },
  (t) => [
    {
      userProfileConstraint: unique().on(t.userId, t.profileId),
    },
  ],
);

// Type Definitions
export type UserInsert = typeof UsersTable.$inferInsert;
export type UserSelect = typeof UsersTable.$inferSelect;

export type UserProfileInsert = typeof UserProfilesTable.$inferInsert;
export type UserProfileSelect = typeof UserProfilesTable.$inferSelect;

export type ComplimentInsert = typeof ComplimentsTable.$inferInsert;
export type ComplimentSelect = typeof ComplimentsTable.$inferSelect;

export type UserRole = UserSelect["userRole"];
export type UserGender = UserProfileSelect["gender"];
