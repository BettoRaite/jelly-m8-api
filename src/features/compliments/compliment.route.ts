import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./compliment.controller";
import { validateRequest } from "@/middleware/validate";
import { z } from "zod";

const complimentsRouter: Router = Router();

complimentsRouter.get(
  "/compliments",
  createAuthMiddleware("user", "admin"),
  validateRequest({
    query: z
      .object({
        title: z.string(),
      })
      .partial(),
  }),
  controller.handleGetCompliments,
);

export default complimentsRouter;
