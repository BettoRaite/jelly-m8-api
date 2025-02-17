import db from "@/database";
import {
  type UserProfileSelect,
  UserProfilesTable,
  type UserProfileInsert,
} from "@/database/schema";
import { getRandSecret } from "@/lib/utils/random";
import logger from "@/middleware/logger";
import type { CreateUserProfilePayload } from "./profile.schema";
import { and, eq } from "drizzle-orm";
import httpStatus from "http-status";
import storageService from "@/features/storage/storage.service";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import config from "@/lib/config/config";
import type { QueryConfig } from "@/lib/types/types";

export const createProfile = async (
  userId: number,
  payload: CreateUserProfilePayload,
  imageUrl = "",
) => {
  const activationSecret =
    config.node_env === "development" ? "unlock" : getRandSecret();
  let profileImageUrl = storageService.createLinkToLocalImageFile(imageUrl);
  if (config.node_env === "development" && payload.imageName) {
    profileImageUrl = storageService.createLinkToLocalImageFile(
      payload.imageName,
      {
        isLocal: true,
      },
    );
  }
  const item = await db
    .insert(UserProfilesTable)
    .values({
      ...payload,
      userId,
      activationSecret,
      profileImageUrl,
    })
    .returning();
  return item.at(0);
};

export const getProfiles = async (
  queryConfig: QueryConfig<UserProfileSelect>,
) => {
  const whereQuery = constructWhereQuery({
    table: UserProfilesTable,
    ...queryConfig,
  });

  return await db
    .select()
    .from(UserProfilesTable)
    .where(and(...whereQuery))
    .orderBy(UserProfilesTable.id)
    .limit(queryConfig.pagination?.pageSize ?? 100);
};

export const getProfileBy = async (
  queryOptions: Partial<UserProfileSelect>,
) => {
  try {
    const keys = Object.keys(queryOptions);
    if (keys.length === 0) {
      throw new Error(`query options is empty: ${queryOptions}`);
    }
    const whereQuery = [];
    for (const k of keys) {
      whereQuery.push(
        eq(
          UserProfilesTable[k as keyof UserProfileSelect],
          queryOptions[k as keyof UserProfileSelect] as number | string,
        ),
      );
    }
    return (
      await db
        .select()
        .from(UserProfilesTable)
        .where(and(...whereQuery))
    ).at(0);
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const updateProfile = async (
  userId: number,
  payload: Partial<Omit<UserProfileInsert, "id">>,
): Promise<void> => {
  await db
    .update(UserProfilesTable)
    .set({ ...payload })
    .where(eq(UserProfilesTable.userId, userId));
};

export const setProfilesActivation = async (activation: boolean) => {
  try {
    const { count } = await db.update(UserProfilesTable).set({
      isActivated: activation,
    });
    return {
      data: {
        count,
      },
    };
  } catch (error) {
    logger.error(error);
    return {
      isError: true,
      message: (error as Error).message,
      status: httpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export const setOneProfileActivation = async (id: number, state: boolean) => {
  await db
    .update(UserProfilesTable)
    .set({
      isActivated: state,
    })
    .where(eq(UserProfilesTable.id, id));
};

export const deleteProfile = async (
  queryOptions: Partial<UserProfileSelect>,
) => {
  const whereQuery = constructWhereQuery<UserProfileSelect>({
    table: UserProfilesTable,
    strict: true,
    queryOptions,
  });

  await db.delete(UserProfilesTable).where(and(...whereQuery));
};

const profileService = {
  createProfile,
  getProfileBy,
  deleteProfile,
  updateProfile,
};

export default profileService;
