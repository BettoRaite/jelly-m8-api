import type { Request, Response } from "express";
import likeService from "./like.service";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

export const handleCreateLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  await likeService.createLike({
    complimentId: req.params["complimentId"] as unknown as number,
    userId,
  });
  res.status(httpStatus.CREATED);
};
export const handleGetLike = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const item = await likeService.getLike({
    complimentId: req.params["complimentId"] as unknown as number,
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
  res.status(httpStatus.OK);
};
