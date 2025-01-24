import db from "@/database";
import { users } from "@/database/schema";
import { getUserById, getUserByName } from "@/database/users.db";
import config from "@/lib/config/config";
import type { CreateUserPayload } from "@/schemas/users.schema";
import { tryUploadUserProfileImage } from "@/services/storage.service";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";

export const handleCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body as CreateUserPayload;
  const { name = "dddd", role = "user" } = payload;
  const { file } = req;
  const storedUser = await getUserByName(name);
  if (storedUser) {
    return res.status(httpStatus.CONFLICT).json({
      message: "user with given name already exists",
    });
  }

  if (file) {
    const profileImageUrl = await tryUploadUserProfileImage(file, payload);
  }

  const accessKey = uuidv4();
  await db.insert(users).values({
    name,
    role,
    accessKey,
    profileImageUrl: config.supabase.default_profile_image_url,
  });

  // Sending back user access key
  res.status(httpStatus.CREATED).json({
    message: "Successfully created user",
    data: {
      accessKey,
    },
  });
};

export const handleGetUsers = async (_: Request, res: Response) => {
  const result = await db.select().from(users);
  res.status(httpStatus.OK).json({
    data: result,
  });
};

export const handleGetUserSelf = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const user = await getUserById(userId);
  if (!user) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  user.accessKey = undefined as unknown as string;
  res.status(httpStatus.OK).json({
    data: user,
  });
};

export const handleInvalidateAccessKey = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  // Making sure that user actually exists
  const user = await getUserById(id as string);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  const accessKey = uuidv4();
  // To invalidate user session we simply update access token
  await db
    .update(users)
    .set({
      accessKey,
    })
    .where(eq(users.id, id as unknown as number));
  // Sending back new access key
  res.status(httpStatus.OK).json({
    message: "Successfully invalidated user access key",
    data: {
      accessKey,
    },
  });
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id as string);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  await db.delete(users).where(eq(users.id, id as unknown as number));
  res.status(httpStatus.OK).json({
    message: "Successfully deleted user",
  });
};
