import httpStatus from "http-status";
import type { Request, Response } from "express";

export const handleUnderwork = (_: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "This route is not finished yet",
  });
};
