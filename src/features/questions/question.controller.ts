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
  const items = await questionService.getQuestions({
    queryOptions: req.query,
  });
  res.status(httpStatus.OK).json({
    data: items,
  });
};

export const handleUpdateQuestion = async (req: Request, res: Response) => {
  questionService.updateQuestion(
    req.params["questionId"] as unknown as number,
    {
      content: req.body.content,
    },
  );
  res.status(httpStatus.OK).json({
    message: "Successfully deleted question",
  });
};

export const handleDeleteQuestion = async (req: Request, res: Response) => {
  await questionService.deleteQuestion(
    req.params["questionId"] as unknown as number,
  );
  res.status(httpStatus.OK).json({
    message: "Successfully deleted question",
  });
};
