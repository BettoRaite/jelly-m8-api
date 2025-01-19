import { eq } from "drizzle-orm";
import db from ".";
import { profiles } from "./schema"; // Changed from girlProfiles to profiles

export const getProfileById = async (id: number | string) => {
  let parsedId = id as number;
  if (typeof id === "string") {
    parsedId = Number.parseInt(id);
  }
  // Changed function name
  return (await db.select().from(profiles).where(eq(profiles.id, parsedId)))[0]; // Added return statement
};

export const getProfileByName = async (
  name: string // Changed function name
) => (await db.select().from(profiles).where(eq(profiles.name, name)))[0]; // Updated reference to profiles
