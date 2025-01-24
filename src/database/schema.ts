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
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  profileImageUrl: varchar({ length: 500 }),
  role: varchar("role", { length: 10 }).notNull(),
  accessKey: varchar("access_key", { length: 255 }).notNull(),
});

// Profiles Table
export const profiles = pgTable("profiles", {
  // Changed from girlProfiles to profiles
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  isActivated: boolean().default(false),
});

// Compliments Table
export const compliments = pgTable(
  "compliments",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    profileId: integer("profile_id") // Changed from girlProfileId to profileId
      .notNull()
      .references(() => profiles.id), // Updated reference to profiles
  },
  (t) => [
    {
      userIdProfileIdConstrain: unique().on(t.userId, t.profileId),
    },
  ]
);

export type UsersInsert = typeof users.$inferInsert; // Type for inserting a user
export type UsersSelect = typeof users.$inferSelect; // Type for selecting a user

export type ProfilesInsert = typeof profiles.$inferInsert; // Type for inserting a profile
export type ProfilesSelect = typeof profiles.$inferSelect; // Type for selecting a profile

export type ComplimentsInsert = typeof compliments.$inferInsert; // Type for inserting a compliment
export type ComplimentsSelect = typeof compliments.$inferSelect; // Type for selecting a compliment
