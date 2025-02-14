import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./compliment.controller";
import { validateRequest } from "@/middleware/validate";
import { z } from "zod";
import { createSortValidation } from "@/lib/utils/schema";
import type { ComplimentSelect } from "@/database/schema";

const complimentsRouter: Router = Router();

complimentsRouter.get(
  "/compliments",
  createAuthMiddleware("user", "admin"),
  validateRequest({
    query: z
      .object({
        title: z.string(),
        asc: createSortValidation<ComplimentSelect>("likes", "createdAt"),
        desc: createSortValidation<ComplimentSelect>("likes", "createdAt"),
      })
      .partial(),
  }),
  controller.handleGetCompliments,
);

export default complimentsRouter;
