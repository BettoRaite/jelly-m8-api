import type { CreateUserPayload } from "@/schemas/users.schema";
import { v4 as uuidv4 } from "uuid";
import db from "@/database";
import { UserTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import config from "@/lib/config/config";

export const createUser = async (payload: CreateUserPayload) => {
  const { name: username, role } = payload;
  const accessKey = uuidv4();
  await db.insert(UserTable).values({
    username,
    userRole: role,
    accessSecret: accessKey,
  });
};

export const deleteUser = async (id: number) => {
  await db.delete(UserTable).where(eq(UserTable.id, id));
};

export const getUsers = async () =>
  await db.select().from(UserTable).orderBy(UserTable.id);

export const getUserById = async (id: string | number) => {
  let parsedId = id as number;
  if (typeof id === "string") {
    parsedId = Number.parseInt(id);
  }
  return (
    await db.select().from(UserTable).where(eq(UserTable.id, parsedId))
  ).at(0);
};

export const getUserByName = async (name: string) => {
  return (await db.select().from(UserTable).where(eq(UserTable.name, name))).at(
    0,
  );
};

export const getUserByAccessKey = async (accessKey: string) => {
  return (
    await db.select().from(UserTable).where(eq(UserTable.accessKey, accessKey))
  )[0];
};
