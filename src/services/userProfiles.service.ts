import db from "@/database";
import { UserProfilesTable } from "@/database/schema";
import { getRandSecret } from "@/lib/utils/random";
import logger from "@/middleware/logger";
import type { CreateUserProfilePayload } from "@/schemas/userProfile.schema";
import { eq } from "drizzle-orm";
import httpStatus from "http-status";

export const createUserProfile = async (
  userId: number,
  payload: CreateUserProfilePayload,
  imageUrl: string,
) => {
  await db.insert(UserProfilesTable).values({
    ...payload,
    userId,
    activationSecret: getRandSecret(),
    profileImageUrl: imageUrl,
  });
};

type OperationResult =
  | {
      isError: true;
      message?: string;
      status: number;
      data?: undefined;
    }
  | {
      isError?: false;
      message?: null;
      data: unknown;
    };

export const setProfilesActivation = async (
  activation: boolean,
): Promise<OperationResult> => {
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

export const deleteProfile = async (id: number): Promise<OperationResult> => {
  try {
    const exists = await getProfileById(id);
    if (!exists) {
      return {
        isError: true,
        message: "Profile with given id does not exist",
        status: httpStatus.NOT_FOUND,
      };
    }
    const { count } = await db.delete(profiles).where(eq(profiles.id, id));
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

const userProfilesService = {
  createUserProfile,
};
