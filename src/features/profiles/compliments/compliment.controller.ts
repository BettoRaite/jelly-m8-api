import type { Request, Response } from "express";
import complimentService from "@/shared/services/compliment.service";
import httpStatus from "http-status";
import type { QuerySort, TypedRequest } from "@/lib/types/types";
import type {
  CreateComplimentPayload,
  ParamsComplimentId,
  UpdateComplimentPayload,
} from "./compliment.schema";
import type { ParamsProfileId } from "../profile.schema";
import type { JwtPayload } from "jsonwebtoken";
import type { ComplimentInsert } from "@/database/schema";

export const handleCreateCompliment = async (
  req: TypedRequest<CreateComplimentPayload, unknown, ParamsProfileId>,
  res: Response,
) => {
  const payload = req.body as CreateComplimentPayload;
  const profileId = req.params.profileId as number;
  const { userId, userRole } = req.payload as JwtPayload;

  if (userRole !== "admin") {
    const items = await complimentService.getCompliments({
      queryOptions: {
        userId,
        profileId,
      },
    });
    if (items.length === 3) {
      return res.status(httpStatus.CONFLICT).json({
        message: "You can't write more then 3 compliments for a given user",
      });
    }
  }
  await complimentService.createCompliment({
    userId,
    profileId,
    ...payload,
    isAdmin: userRole === "admin",
  });
  res.status(httpStatus.CREATED).json({
    message: "Successfully created compliment",
  });
};

export const handleGetCompliments = async (req: Request, res: Response) => {
  const profileId = req.params["profileId"] as unknown as number;

  const items = await complimentService.getCompliments({
    queryOptions: {
      profileId,
      ...req.query,
      visibility: "public",
    },
    sorting: req.query as QuerySort<unknown>,
  });
  res.status(httpStatus.OK).json({
    data: items,
  });
};

export const handleGetCompliment = async (req: Request, res: Response) => {
  const complimentId = req.params["complimentId"] as unknown as number;

  const items = await complimentService.getCompliments({
    queryOptions: {
      id: complimentId,
    },
  });
  res.status(httpStatus.OK).json({
    data: items[0],
  });
};

export const handleUpdateCompliment = async (
  req: TypedRequest<UpdateComplimentPayload, unknown, ParamsComplimentId>,
  res: Response,
) => {
  const payload = req.body as UpdateComplimentPayload;
  const { complimentId } = req.params as ParamsComplimentId;

  await complimentService.updateCompliment(
    complimentId,
    payload as ComplimentInsert,
  );
  res.status(httpStatus.OK).json({
    message: "Successfully updated compliment",
  });
};

export const handleDeleteCompliment = async (
  req: TypedRequest<unknown, unknown, ParamsComplimentId>,
  res: Response,
) => {
  const { complimentId } = req.params as ParamsComplimentId;

  await complimentService.deleteCompliment(complimentId);
  res.status(httpStatus.OK).json({
    message: "Successfully deleted compliment",
  });
};
