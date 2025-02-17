import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./question.controller";
import { validateRequest } from "@/middleware/validate";
import { z } from "zod";

const questionsRouter: Router = Router();

questionsRouter.post(
  "/questions",
  createAuthMiddleware("admin", "user"),
  validateRequest({
    body: z.object({
      content: z.string().trim().min(3).max(255),
    }),
  }),
  controller.handleCreateQuestion,
);

questionsRouter.get(
  "/questions",
  validateRequest({
    query: z.object({
      userId: z.coerce.number().positive(),
      isApproved: z.any().transform(() => true),
    }),
  }),
  controller.handleGetQuestions,
);

questionsRouter.patch(
  "/questions/:questionId",
  createAuthMiddleware("admin", "user"),
  validateRequest({
    query: z.object({
      userId: z.coerce.number().positive(),
    }),
    body: z.object({
      content: z.string(),
    }),
  }),
  controller.handleGetQuestions,
);

questionsRouter.delete(
  "/questions/:questionId",
  createAuthMiddleware("admin", "user"),
  validateRequest({
    query: z.object({
      userId: z.coerce.number().positive(),
      isApproved: z.any().transform(() => true),
    }),
  }),
  controller.handleGetQuestions,
);

export default questionsRouter;
