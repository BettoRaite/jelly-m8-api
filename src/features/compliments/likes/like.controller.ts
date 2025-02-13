import type { Request, Response } from "express";
import likeService from "./like.service";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

export const handleCreateLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const complimentId = req.params["complimentId"] as unknown as number;
  const item = await likeService.getLike({
    complimentId,
    userId,
  });

  if (item) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Can't compliment same profile more than one time.",
    });
  }
  await likeService.createLike({
    complimentId: req.params["complimentId"] as unknown as number,
    userId,
  });
  res.status(httpStatus.CREATED).json({ message: "Like created successfully" });
};
export const handleGetLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const complimentId = req.params["complimentId"] as unknown as number;
  const item = await likeService.getLike({
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
