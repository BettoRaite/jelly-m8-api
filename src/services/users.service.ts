import { tryUploadUserProfileImage } from "./storage.service";
import type { CreateUserPayload } from "@/schemas/users.schema";
import { v4 as uuidv4 } from "uuid";
import db from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const createUser = async (
  payload: CreateUserPayload,
  imageFile?: Express.Multer.File,
) => {
  const { name, role } = payload;

  const profileImageUrl = await tryUploadUserProfileImage(payload, imageFile);
  const accessKey = uuidv4();

  await db.insert(users).values({
    name,
    role,
    accessKey,
    profileImageUrl,
  });
};

export const deleteUser = async (id: number) => {
  await db.delete(users).where(eq(users.id, id));
};

export const getUsers = async () =>
  await db.select().from(users).orderBy(users.id);
