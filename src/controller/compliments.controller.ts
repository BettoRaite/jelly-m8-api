import {
  checkUserComplimentOwnership,
  getComplimentById,
} from "@/database/compliments.db";
import type { TypedRequest } from "../lib/types/types";
import httpStatus from "http-status";
import type { Response } from "express";
import type { CreateComplimentPayload } from "@/schemas/compliment.schema";
import db from "@/database";
import { compliments } from "@/database/schema";
import type { JwtPayload } from "jsonwebtoken";

export const handleUpdateCompliment = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      complimentId: number;
    }
  >,
  res: Response
) => {
  const { complimentId } = req.params;
  const payload = req.body as Partial<CreateComplimentPayload>;
  const { userId, role } = req.payload as JwtPayload;

  // Adding super power to admin
  if (role === "admin") {
    const compliment = getComplimentById(complimentId as number);
    if (!compliment) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Compliment with given id does not exist",
      });
    }
  } else {
    // To avoid cases in which another user has unauthorized access to the resource
    // We check whether the resource belongs to the current user
    const ownsCompliment = await checkUserComplimentOwnership(
      userId as number,
      complimentId as number
    );
    if (!ownsCompliment) {
      return res.status(httpStatus.FORBIDDEN).json({
        message:
          "You do not have permission to access this compliment, or it may not exist",
      });
    }
  }

  if (Object.values(payload).length === 0) {
    return res.status(httpStatus.NO_CONTENT).json({
      message: "No field to update",
    });
  }

  await db.update(compliments).set({
    ...payload,
  });
  res.status(httpStatus.OK).json({
    message: "Successfully updated compliment",
  });
};

export const handleDeleteCompliment = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      complimentId: number;
    }
  >,
  res: Response
) => {
  const { complimentId } = req.params;
  const { userId, role } = req.payload as JwtPayload;
  if (role === "admin") {
    const compliment = getComplimentById(complimentId as number);
    if (!compliment) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Compliment with given id does not exist",
      });
    }
  } else {
    // To avoid cases in which another user has unauthorized access to the resource
    // We check whether the resource belongs to the current user
    const ownsCompliment = await checkUserComplimentOwnership(
      userId as number,
      complimentId as number
    );
    if (!ownsCompliment) {
      return res.status(httpStatus.FORBIDDEN).json({
        message:
          "You do not have permission to access this compliment, or it may not exist",
      });
    }
  }
  await db.delete(compliments);
  res.status(httpStatus.OK).json({
    message: "Successfully deleted compliment",
  });
};
