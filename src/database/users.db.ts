import db from ".";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string | number) => {
  let parsedId = id as number;
  if (typeof id === "string") {
    parsedId = Number.parseInt(id);
  }
  return (await db.select().from(users).where(eq(users.id, parsedId)))[0];
};

export const getUserByName = async (name: string) => {
  return (await db.select().from(users).where(eq(users.name, name)))[0];
};

export const getUserByAccessKey = async (accessKey: string) => {
  return (
    await db.select().from(users).where(eq(users.accessKey, accessKey))
  )[0];
};
