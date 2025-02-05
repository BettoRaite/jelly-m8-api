import type { Request, Response } from "express";
import httpStatus from "http-status";
import type {
  CreateUserProfilePayload,
  ParamsProfileId,
  ProfileActivationPayload,
  // profileActivationSchema,
} from "./profile.schema";
import type { TypedRequest } from "@/lib/types/types";
// import type { JwtPayload } from "jsonwebtoken";
import * as profileService from "./profile.service";
import * as userService from "../users/user.service";

export const handleCreateProfile = async (
  req: TypedRequest<
    CreateUserProfilePayload,
    unknown,
    {
      id: number;
    }
  >,
  res: Response,
) => {
  const payload = req.body as CreateUserProfilePayload;
  const userId = req.params.id as number;

  const storedUser = await userService.getUserBy({
    id: userId,
  });

  if (!storedUser) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "user with given id does not exist",
    });
  }

  const exists = await profileService.getProfileBy({
    id: userId,
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
    ...req.query,
  });
  res.status(httpStatus.OK).json({
    data: profiles,
  });
};

export const handleGetProfile = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      profileId: number;
    }
  >,
  res: Response,
) => {
  const profile = await profileService.getProfileBy({
    id: req.params.profileId as number,
    isActivated: true,
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

// export const handleUpdateProfile = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const payload = req.body as Partial<CreateProfilePayload>;
//   const profile = await profileService.getProfileById(id as string);
//   if (!profile) {
//     return res.status(httpStatus.NOT_FOUND).json({
//       message: "Profile with such id does not exist",
//     });
//   }
//   if (!hasAtLeastOneField(payload)) {
//     return res.status(httpStatus.NO_CONTENT).json({
//       message: "Nothing to update",
//     });
//   }
//   await db
//     .update(profiles)
//     .set({
//       ...payload,
//     })
//     .where(eq(profiles.id, id as unknown as number));

//   res.status(httpStatus.OK).json({ message: "Successfully updated profile" });
// };

export const handleActivateProfile = async (
  req: TypedRequest<ProfileActivationPayload, unknown, ParamsProfileId>,
  res: Response,
) => {
  const { activationSecret } = req.body;
  // Check if activation secret is correct
  const profile = await profileService.getProfileBy({
    activationSecret: activationSecret as string,
  });
  if (!profile) {
    return res.status(httpStatus.UNAUTHORIZED);
  }
  await profileService.setOneProfileActivation(profile.id, true);
  res.status(httpStatus.OK).json({
    message: "Successfully activated profile",
  });
};

// Deactivation is handled by admin
export const handleDeactivateProfile = async (
  req: TypedRequest<unknown, unknown, ParamsProfileId>,
  res: Response,
) => {
  await profileService.setOneProfileActivation(
    req.params.profileId as number,
    false,
  );
  res.status(httpStatus.OK).json({
    message: "Successfully deactivated profile",
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
