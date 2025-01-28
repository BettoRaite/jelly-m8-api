import { Router } from "express";
import * as controller from "@/controller/users.controller";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import { createUserSchema } from "@/schemas/users.schema";
import z from "zod";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";

const usersRouter: Router = Router();

const upload = multer({ storage: storageConfig });
usersRouter.post(
  "/users",
  createAuthMiddleware("admin"),
  upload.single("profileImage"),
  validate({ body: createUserSchema }),
  controller.handleCreateUser,
);

usersRouter.get(
  "/users",
  createAuthMiddleware("admin"),
  controller.handleGetUsers,
);

usersRouter.get(
  "/users/me",
  createAuthMiddleware("admin", "user"),
  controller.handleGetUserSelf,
);

usersRouter.patch(
  "/users/:id/access-token/invalidate",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleInvalidateAccessKey,
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

export default usersRouter;
