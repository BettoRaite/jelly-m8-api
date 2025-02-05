import { paramsProfileIdSchema } from "./profile.schema";
import type { NextFunction, Response, Request } from "express";
import profileService from "./profile.service";
import httpStatus from "http-status";

export const ensureProfileExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { data, success } = paramsProfileIdSchema.safeParse(req.params);
  if (!success) {
    return res.status(httpStatus.BAD_REQUEST);
  }
  const exists = await profileService.getProfileBy({
    id: data.profileId as number,
  });
  if (!exists) {
    return res.status(httpStatus.NOT_FOUND);
  }
  next();
};
