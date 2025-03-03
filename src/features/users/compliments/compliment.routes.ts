import { Router } from "express";
import { validateRequest } from "@/middleware/validate";
import { z } from "zod";
import { handleGetCompliments } from "./compliments.controller";
import createAuthMiddleware from "@/middleware/auth";

const userComplimentsRouter: Router = Router();

userComplimentsRouter.get(
  "/users/:userId/compliments",
  createAuthMiddleware("admin", "user"),
  validateRequest({
    query: z
      .object({
        visibility: z.enum(["public", "private"]),
      })
      .partial(),
    params: z.object({
      userId: z.coerce.number().positive(),
    }),
  }),
  handleGetCompliments,
);

export default userComplimentsRouter;
