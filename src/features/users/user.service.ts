import db from "@/database";
import {
  type UserSelect,
  UsersTable,
  type UserInsert,
} from "@/database/schema";
import { and, eq } from "drizzle-orm";
import logger from "@/middleware/logger";
import type { CreateUserPayload } from "./user.schema";
import { getRandSecret } from "@/lib/utils/random";

export const createUser = async (payload: CreateUserPayload) => {
  if (!payload.accessSecret) {
    payload.accessSecret = getRandSecret();
  }
  await db.insert(UsersTable).values({
    ...(payload as UserInsert),
  });
};

export const invalidateUserAccessSecret = async (id: number) => {
  const accessSecret = getRandSecret();
  // To invalidate user session we simply update access token
  await db
    .update(UsersTable)
    .set({
      accessSecret,
    })
    .where(eq(UsersTable.id, id as unknown as number));
};

export const getUsers = async () =>
  await db.select().from(UsersTable).orderBy(UsersTable.id);

export const getUserById = async (id: string | number) => {
  let parsedId = id as number;
  if (typeof id === "string") {
    parsedId = Number.parseInt(id);
  }
  return (
    await db.select().from(UsersTable).where(eq(UsersTable.id, parsedId))
  ).at(0);
};

export const getUserByName = async (name: string) => {
  return (
    await db.select().from(UsersTable).where(eq(UsersTable.username, name))
  ).at(0);
};

export const getUserByAccessSecret = async (accessSecret: string) => {
  return (
    await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.accessSecret, accessSecret))
  ).at(0);
};

export const getUserByRole = async (accessSecret: string) => {
  return (
    await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.accessSecret, accessSecret))
  ).at(0);
};

export const getUserBy = async (queryColumns: Partial<UserSelect>) => {
  try {
    const keys = Object.keys(queryColumns);
    if (keys.length === 0) {
      throw new Error(`no query columns: ${queryColumns}`);
    }
    const whereQuery = [];
    for (const k of keys) {
      whereQuery.push(
        eq(
          UsersTable[k as keyof UserSelect],
          queryColumns[k as keyof UserSelect] as number | string,
        ),
      );
    }
    return (
      await db
        .select()
        .from(UsersTable)
        .where(and(...whereQuery))
    ).at(0);
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const deleteUser = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.id, id));
};

const userService = {
  getUserBy,
  getUsers,
  createUser,
  deleteUser,
};
export default userService;
