import type { Request, Response } from "express";
import httpStatus from "http-status";
import type {
  CreateUserProfilePayload,
  ProfileActivationPayload,
  // profileActivationSchema,
} from "./profile.schema";
import type { TypedRequest } from "@/lib/types/types";
import * as profileService from "./profile.service";
import { createLinkToLocalImageFile } from "@/features/storage/storage.service";
import type { UserGender, UserProfileInsert } from "@/database/schema";
import { formatObjectLikeQuery } from "@/database/helpers/constructWhereQuery";

export const handleCreateProfile = async (
  req: TypedRequest<
    CreateUserProfilePayload,
    unknown,
    {
      userId: number;
    }
  >,
  res: Response,
) => {
  const payload = req.body as CreateUserProfilePayload;
  const userId = req.params.userId as number;

  const exists = await profileService.getProfileBy({
    userId,
  });
  if (exists) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Profile with given id already exists",
    });
  }

  await profileService.createProfile(
    userId,
    payload,
    req.file?.filename as string,
  );

  res.status(httpStatus.CREATED).json({
    message: "Successfully created a user profile",
  });
};

// Will need to join the compliments with the
export const handleGetProfiles = async (req: Request, res: Response) => {
  const profiles = await profileService.getProfiles({
    queryOptions: formatObjectLikeQuery(
      req.query as Record<string, string | number>,
      "displayName",
    ),
    operators: {
      displayName: "ilike",
    },
  });

  res.status(httpStatus.OK).json({
    data: profiles,
  });
};

export const handleGetProfile = async (
  req: TypedRequest<
    unknown,
    {
      gender: UserGender;
    },
    {
      userId: number;
    }
  >,
  res: Response,
) => {
  const profile = await profileService.getProfileBy({
    userId: req.params.userId as number,
  });
  res.status(httpStatus.OK).json({
    data: profile,
  });
};

export const handleActivateProfiles = async (_: Request, res: Response) => {
  const rowsAffected = await profileService.setProfilesActivation(true);
  if (!rowsAffected) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  res.status(httpStatus.OK).json({
    message: "Successfully activated all profiles",
  });
};

export const handleDeactivateProfiles = async (_: Request, res: Response) => {
  const rowsAffected = await profileService.setProfilesActivation(false);
  if (!rowsAffected) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  res.status(httpStatus.OK).json({
    message: "Successfully deactivated all profiles",
  });
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
  const userId = req.params["userId"] as unknown as number;
  const payload = req.body as Partial<Omit<UserProfileInsert, "id" | "userId">>;
  if (req.file) {
    payload.profileImageUrl = createLinkToLocalImageFile(req.file.filename);
  }
  await profileService.updateProfile(userId, payload);

  res.status(httpStatus.OK).json({ message: "Successfully updated profile" });
};

export const handleActivateProfile = async (
  req: TypedRequest<
    ProfileActivationPayload,
    unknown,
    {
      userId: number;
    }
  >,
  res: Response,
) => {
  const userId = req.params.userId as number;
  const { activationSecret } = req.body as ProfileActivationPayload;
  const exists = await profileService.getProfileBy({
    activationSecret,
  });
  if (!exists) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: "Invalid activation secret",
    });
  }
  await profileService.updateProfile(userId, {
    isActivated: true,
  });
  res.status(httpStatus.OK).json({
    message: "Successfully activated profile",
  });
};

export const handleDeleteProfile = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      userId: number;
    }
  >,
  res: Response,
) => {
  const userId = req.params.userId as number;
  const exists = await profileService.getProfileBy({
    userId,
  });
  if (!exists) {
    return res.status(httpStatus.NOT_FOUND);
  }
  await profileService.deleteProfile({
    userId,
  });

  res.status(httpStatus.OK).json({
    message: "Successfully delete user profile",
  });
};
