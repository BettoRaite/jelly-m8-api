import { Router } from "express";
import * as controller from "@/controller/users.controller";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import { createUserSchema } from "@/schemas/users.schema";
import z from "zod";

const usersRouter: Router = Router();

usersRouter.post(
  "/users",
  createAuthMiddleware("admin"),
  validate({ body: createUserSchema }),
  controller.handleCreateUser
);

usersRouter.get(
  "/users",
  createAuthMiddleware("admin"),
  controller.handleGetUsers
);

usersRouter.patch(
  "/users/:id/access-token/invalidate",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleInvalidateAccessKey
);

usersRouter.delete(
  "/users/:id",
  createAuthMiddleware("admin"),
  validate({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),
  controller.handleDeleteUser
);

export default usersRouter;
