import db from "@/database";
import { compliments, profiles, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { getProfileById, getProfileByName } from "@/database/profiles.db";
import type { CreateProfilePayload } from "@/schemas/profiles.schema";
import type { TypedRequest } from "@/lib/types/types";
import type { JwtPayload } from "jsonwebtoken";
import type { CreateComplimentPayload } from "@/schemas/compliment.schema";
import * as profilesService from "@/services/profiles.service";
import { hasAtLeastOneField } from "@/lib/utils/object";
import { tryUploadProfileImage } from "@/services/storage.service";

export const handleCreateProfile = async (req: Request, res: Response) => {
  const payload = req.body as CreateProfilePayload;
  const profile = await getProfileByName(payload.name);
  if (profile) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Profile with such name already exists",
    });
  }
  const { bio = "", name = "", isActivated = false } = payload;
  const profileImageUrl = await tryUploadProfileImage(payload, req.file);

  await db.insert(profiles).values({
    bio,
    name,
    isActivated,
    profileImageUrl: profileImageUrl ?? "",
  });
  res
    .status(httpStatus.CREATED)
    .json({ message: "Successfully created profile" });
};

export const handleAddComplimentToProfile = async (
  req: TypedRequest<any, any, { profileId: number }>,
  res: Response,
) => {
  const { userId, role } = req.payload as JwtPayload;
  const payload = req.body as CreateComplimentPayload;
  const { profileId } = req.params;
  const profile = await getProfileById(profileId as number);
  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Profile with given id does not exist",
    });
  }
  // We want to avoid user adding more than one compliment per profile
  const result = await db
    .select()
    .from(compliments)
    .where(
      and(
        eq(compliments.userId, userId),
        eq(compliments.profileId, profileId as number),
      ),
    );
  if (result.length > 0 && role !== "admin") {
    return res.status(httpStatus.CONFLICT).json({
      message: "You can't add more than one compliment per profile",
    });
  }
  await db.insert(compliments).values({
    content: payload.content,
    profileId: profileId as number,
    userId,
  });
  res.status(httpStatus.CREATED).json({
    message: "Successfully created a new compliment",
  });
};

export const handleActivateProfiles = async (_: Request, res: Response) => {
  const rowsAffected = await profilesService.setProfilesActivation(true);
  if (!rowsAffected) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  res.status(httpStatus.OK).json({
    message: "Successfully activated all profiles",
  });
};

export const handleDeactivateProfiles = async (_: Request, res: Response) => {
  const rowsAffected = await profilesService.setProfilesActivation(false);
  if (!rowsAffected) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  res.status(httpStatus.OK).json({
    message: "Successfully deactivated all profiles",
  });
};

// Will need to join the compliments with the
export const handleGetProfiles = async (_: Request, res: Response) => {
  const result = await db.select().from(profiles);
  res.status(httpStatus.OK).json({
    data: result,
  });
};

export const handleGetProfileCompliments = async (
  req: TypedRequest<any, any, { profileId: number }>,
  res: Response,
) => {
  const { profileId } = req.params;
  const profile = await getProfileById(profileId as number);
  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Profile with given id does not exist",
    });
  }
  const result = await db
    .select({
      id: compliments.id,
      content: compliments.content,
      author: {
        id: users.id,
        name: users.name,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(compliments)
    .where(eq(compliments.profileId, profileId as number))
    .innerJoin(users, eq(users.id, compliments.userId));
  res.status(httpStatus.OK).json({
    data: result,
  });
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as Partial<CreateProfilePayload>;
  const profile = await getProfileById(id as string);
  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Profile with such id does not exist",
    });
  }
  if (!hasAtLeastOneField(payload)) {
    return res.status(httpStatus.NO_CONTENT).json({
      message: "Nothing to update",
    });
  }
  await db
    .update(profiles)
    .set({
      ...payload,
    })
    .where(eq(profiles.id, id as unknown as number));

  res.status(httpStatus.OK).json({ message: "Successfully updated profile" });
};

export const handleDeleteProfile = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      profileId: number;
    }
  >,
  res: Response,
) => {
  const { profileId } = req.params;
  const result = await profilesService.deleteProfile(profileId as number);
  if (result.isError) {
    res.status(result.status).json({
      message: result.message,
    });
  }
  res.status(httpStatus.OK).json({
    data: result.data,
  });
};
