import type { TypedRequest } from "@/lib/types/types";
import {
  type ParamsComplimentId,
  paramsComplimentIdSchema,
} from "./compliment.schema";
import type { NextFunction, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import complimentService from "./compliment.service";
import httpStatus from "http-status";

export const isComplimentOwner = async (
  req: TypedRequest<unknown, unknown, ParamsComplimentId>,
  res: Response,
  next: NextFunction,
) => {
  const complimentId = req.params.complimentId as number;
  const { userRole, userId } = req.payload as JwtPayload;
  if (userRole === "admin") {
    return next();
  }
  const ownsCompliment = await complimentService.getComplimentBy({
    userId,
    id: complimentId,
  });
  if (!ownsCompliment) {
    return res.status(httpStatus.FORBIDDEN);
  }
  next();
};

export const ensureComplimentExists = async (
  req: TypedRequest<unknown, unknown, ParamsComplimentId>,
  res: Response,
  next: NextFunction,
) => {
  const { data, success } = paramsComplimentIdSchema.safeParse(req.params);
  if (!success) {
    return res.status(httpStatus.BAD_REQUEST);
  }
  const exists = await complimentService.getComplimentBy({
    id: data.complimentId,
  });
  if (!exists) {
    return res.status(httpStatus.NOT_FOUND);
  }
  next();
};
