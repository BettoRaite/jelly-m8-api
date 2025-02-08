import { Router } from "express";
import * as controller from "./user.controller";
import createAuthMiddleware from "@/middleware/auth";
import { validateRequest } from "@/middleware/validate";
import { createUserSchema } from "./user.schema";
import z from "zod";
import { ensureResourceExists } from "@/middleware/ensureItemExists";

const usersRouter: Router = Router();

// Create user
usersRouter.post(
  "/users",
  createAuthMiddleware("admin"),
  validateRequest({ body: createUserSchema }),
  controller.handleCreateUser,
);

// Get all users
usersRouter.get(
  "/users",
  createAuthMiddleware("admin"),
  controller.handleGetUsers,
);
//  Get user
usersRouter.get(
  "/users/:userId",
  createAuthMiddleware("admin"),
  ensureResourceExists("user", {
    returnResourceResponse: true,
  }),
);
// Get currently authenticated user
usersRouter.get(
  "/users/current",
  createAuthMiddleware("admin", "user"),
  controller.handleGetCurrentUser,
);
// Invalidate access token
usersRouter.patch(
  "/users/:id/access-secret/invalidate",
  createAuthMiddleware("admin"),
  validateRequest({
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
  validateRequest({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleDeleteUser,
);

export default usersRouter;
