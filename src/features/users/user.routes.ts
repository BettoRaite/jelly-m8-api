import { Router } from "express";
import * as controller from "./user.controller";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import { createUserSchema } from "./user.schema";
import z from "zod";

const usersRouter: Router = Router();

// Create user
usersRouter.post(
  "/users",
  createAuthMiddleware("admin"),
  validate({ body: createUserSchema }),
  controller.handleCreateUser,
);

// Get all users
usersRouter.get(
  "/users",
  createAuthMiddleware("admin"),
  controller.handleGetUsers,
);
// Invalidate access token
usersRouter.patch(
  "/users/:id/access-secret/invalidate",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleInvalidateAccessKey,
);

// Detele user
usersRouter.delete(
  "/users/:id",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleDeleteUser,
);


export default usersRouter;
