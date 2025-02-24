import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./question.controller";
import { validateRequest } from "@/middleware/validate";
import { z } from "zod";
import { ensureResourceExists } from "@/middleware/ensureItemExists";

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
    query: z
      .object({
        userId: z.coerce.number().positive().optional(),
        isApproved: z.any().transform(() => true),
      })
      .optional(),
  }),
  controller.handleGetQuestions,
);

questionsRouter.patch(
  "/questions/:questionId",
  createAuthMiddleware("admin"),
  validateRequest({
    body: z.object({
      content: z.string(),
    }),
    params: z.object({
      questionId: z.coerce.number().positive(),
    }),
  }),
  ensureResourceExists("question"),
  controller.handleUpdateQuestion,
);

questionsRouter.delete(
  "/questions/:questionId",
  createAuthMiddleware("admin"),
  ensureResourceExists("question"),
  controller.handleDeleteQuestion,
);

export default questionsRouter;
