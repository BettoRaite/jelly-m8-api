import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import * as controller from "./like.controller";
import { ensureResourceExists } from "@/middleware/ensureItemExists";

const likesRouter: Router = Router();

likesRouter.post(
  "/compliments/:complimentId/likes",
  createAuthMiddleware("user", "admin"),
  ensureResourceExists("compliment"),
  controller.handleCreateLike,
);

likesRouter.get(
  "/compliments/:complimentId/likes",
  createAuthMiddleware("user", "admin"),
  ensureResourceExists("compliment"),
  controller.handleGetLike,
);

likesRouter.delete(
  "/compliments/:complimentId/likes",
  createAuthMiddleware("user", "admin"),
  ensureResourceExists("compliment"),
  controller.handleDeleteLike,
);

export default likesRouter;
