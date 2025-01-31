import db from "@/database";
import { type UserProfileSelect, UserProfilesTable } from "@/database/schema";
import { getRandSecret } from "@/lib/utils/random";
import logger from "@/middleware/logger";
import type { CreateUserProfilePayload } from "./profile.schema";
import { and, eq } from "drizzle-orm";
import httpStatus from "http-status";
import storageService from "../storage/storage.service";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";

export const createProfile = async (
  userId: number,
  payload: CreateUserProfilePayload,
  imageUrl: string,
) => {
  await db.insert(UserProfilesTable).values({
    ...payload,
    userId,
    activationSecret: getRandSecret(),
    profileImageUrl: storageService.createLinkToLocalImageFile(imageUrl),
  });
};

export const getProfiles = async (queryOptions: Partial<UserProfileSelect>) => {
  const whereQuery = [];
  for (const k of Object.keys(queryOptions)) {
    whereQuery.push(
      eq(
        UserProfilesTable[k as keyof UserProfileSelect],
        queryOptions[k as keyof UserProfileSelect] as number | string,
      ),
    );
  }
  return await db
    .select()
    .from(UserProfilesTable)
    .where(and(...whereQuery));
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
  getProfileBy,
  deleteProfile,
};

export default profileService;
