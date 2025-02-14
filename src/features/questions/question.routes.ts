import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./question.controller";
import { validateRequest } from "@/middleware/validate";
import { ensureResourceExists } from "@/middleware/ensureItemExists";
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
  controller.handleCreateQuestion,
);

export default questionsRouter;
