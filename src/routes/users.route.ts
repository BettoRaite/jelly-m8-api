import { Router } from "express";
import * as controller from "@/controller/users.controller";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import { createUserSchema } from "@/schemas/user.schema";
import z from "zod";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";
import { createProfileSchema } from "@/schemas/profile.schema";

const usersRouter: Router = Router();

// Create user
usersRouter.post(
  "/users",
  createAuthMiddleware("admin"),
  validate({ body: createUserSchema }),
  controller.handleCreateUser,
);

// Create user profile
usersRouter.post(
  "/users/:id/profile",
  createAuthMiddleware("admin"),
  validate({ body: createProfileSchema }),
  controller.handleCreateUser,
);
// Get all users
usersRouter.get(
  "/users",
  createAuthMiddleware("admin"),
  controller.handleGetUsers,
);
// Get user profile
usersRouter.get(
  "/users/:id/profile",
  createAuthMiddleware("admin", "user"),
  controller.handleGetUserSelf,
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

usersRouter.post(
  "/users/:id/profile",
  createAuthMiddleware("admin"),
  validate({ body: createProfileSchema }),
  controller.handleCreateUser,
);

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

usersRouter.delete(
  "/users/:id/profile",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleDeleteUser,
);

export default usersRouter;
