import type { Request, Response } from "express";
import complimentService from "./compliment.service";
import httpStatus from "http-status";
import type { TypedRequest } from "@/lib/types/types";
import type {
  CreateComplimentPayload,
  ParamsComplimentId,
  UpdateComplimentPayload,
} from "./compliment.schema";
import type { ParamsProfileId } from "../profile.schema";
import type { JwtPayload } from "jsonwebtoken";

export const handleCreateCompliment = async (
  req: TypedRequest<CreateComplimentPayload, unknown, ParamsProfileId>,
  res: Response,
) => {
  const payload = req.body as CreateComplimentPayload;
  const profileId = req.params.profileId as number;
  const { userId, userRole } = req.payload as JwtPayload;

  if (userRole !== "admin") {
    const hasComplimented = await complimentService.getComplimentBy({
      userId,
      profileId,
    });
    if (hasComplimented) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Compliment for given profile already exists",
      });
    }
  }

  await complimentService.createCompliment({
    userId,
    profileId,
    ...payload,
  });
  res.status(httpStatus.CREATED).json({
    message: "Successfully create compliment",
  });
};

export const handleGetCompliments = async (req: Request, res: Response) => {
  const profileId = req.params["profileId"] as unknown as number;
  const items = await complimentService.getCompliments({
    profileId,
  });
  res.status(httpStatus.OK).json({
    data: items,
  });
};

export const handleGetCompliment = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;

  const compliment = await complimentService.getComplimentBy({
    userId,
  });
  console.log(compliment);
  res.status(httpStatus.OK).json({
    data: compliment,
  });
};

export const handleUpdateCompliment = async (
  req: TypedRequest<UpdateComplimentPayload, unknown, ParamsComplimentId>,
  res: Response,
) => {
  const payload = req.body as UpdateComplimentPayload;
  const { complimentId } = req.params as ParamsComplimentId;

  await complimentService.updateCompliment(complimentId, {
    ...payload,
  });
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
