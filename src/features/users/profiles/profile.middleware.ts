import type { NextFunction, Response, Request } from "express";
import profileService from "./profile.service";
import httpStatus from "http-status";
import type { UpdateProfilePayload } from "./profile.schema";

/**
 * Middleware to ensure that a user's profile exists along with some authorization
 */
export const ensureUserProfileExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Extract userId from request parameters (assuming it's already validated)
  const userId = Number(req.params["userId"]);

  // Check if the profile exists
  const profile = await profileService.getProfileBy({ userId });

  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User profile not found",
    });
  }

  if (req.payload?.userRole !== "admin" && profile.userId !== userId) {
    return res.status(httpStatus.FORBIDDEN);
  }
  next();
};

export const stripUnmodifiableFields = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  if (req.payload?.userRole !== "admin") {
    const { activationSecret, isActivated, ...modifiableFields } =
      req.body as UpdateProfilePayload;
    req.body = modifiableFields;
  }
  next();
};
