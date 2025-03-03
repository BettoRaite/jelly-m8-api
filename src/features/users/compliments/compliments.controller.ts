import { getProfileBy } from "@/features/profiles/profile.service";
import { getCompliments } from "@/shared/services/compliment.service";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";

export const handleGetCompliments = async (req: Request, res: Response) => {
  // zod validated
  const paramsUserId = req.params["userId"] as unknown as number;
  const visibility = req.query["visibility"] as string;

  // Validate if the user is authorized to view private compliments
  if (!visibility || visibility === "private") {
    const { userId } = req.payload as JwtPayload;
    // Checking if user is in fact trying to retrieve own compliments
    if (userId !== paramsUserId) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "You are not authorized to view private compliments",
      });
    }
  }

  // Fetch the user profile
  const profile = await getProfileBy({ userId: paramsUserId });
  if (!profile) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User profile does not exist",
    });
  }
  const items = await getCompliments({
    queryOptions: {
      ...req.query,
      profileId: profile.id,
    },
  });
  res.status(httpStatus.OK).json({
    data: items,
  });
};
