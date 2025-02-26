import type { Request, Response } from "express";
import likeService from "./like.service";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { ApiError } from "@/lib/errors";
export const handleCreateLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const complimentId = req.params["complimentId"] as unknown as number;

  try {
    await likeService.createLike({
      complimentId,
      userId,
    });
    res
      .status(httpStatus.CREATED)
      .json({ message: "Like created successfully" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while creating the like.",
    });
  }
};

export const handleGetLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const complimentId = req.params["complimentId"] as unknown as number;
  const [item] = await likeService.getLikes({
    complimentId,
    userId,
  });
  res.status(httpStatus.OK).json({
    data: item,
  });
};

export const handleDeleteLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  await likeService.deleteLike({
    complimentId: req.params["complimentId"] as unknown as number,
    userId,
  });
  res.status(httpStatus.OK).json({ message: "Like deleted successfully" });
};
