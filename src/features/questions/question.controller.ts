import type { Request, Response } from "express";
import questionService from "./question.service";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

export const handleCreateQuestion = async (req: Request, res: Response) => {
  const { userId, userRole } = req.payload as JwtPayload;
  const content = req.body["content"];
  if (userRole !== "admin") {
    // get number of question like 10
  }
  await questionService.createQuestion({
    userId,
    isApproved: userRole === "admin",
    content,
  });
  res.status(httpStatus.CREATED).json({
    message: "Successfully created a new question",
  });
};

export const handleGetQuestions = async (req: Request, res: Response) => {
  await questionService.getQuestions({});
};
