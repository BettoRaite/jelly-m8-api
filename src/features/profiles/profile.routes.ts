import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import * as controller from "./profile.controller";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";
import { createUserProfileSchema } from "./profile.schema";
import { createComplimentSchema } from "../compliments/compliment.schema";
import { z } from "zod";

const upload = multer({ storage: storageConfig });
const profilesRouter: Router = Router();

// Create user profile
profilesRouter.post(
  "/users/:id/profile",
  createAuthMiddleware("admin", "user"),
  upload.single("imageFile"),
  validate({ body: createUserProfileSchema }),
  controller.handleCreateProfile,
);

// Get user profile
profilesRouter.get(
  "/users/:id/profile",
  createAuthMiddleware("admin", "user"),
  upload.single("imageFile"),
  controller.handleGetProfiles,
);

profilesRouter.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("user", "admin"),
  validate({
    body: createComplimentSchema,
  }),
  controller.handleAddComplimentToProfile,
);

profilesRouter.post(
  "/profiles/activate",
  createAuthMiddleware("admin"),
  controller.handleActivateProfiles,
);

profilesRouter.get(
  "/profiles",
  validate({
    query: z.object({
      gender: z.enum(["male", "female"]).optional(),
    }),
  }),
  controller.handleGetProfiles,
);

profilesRouter.get(
  "/profiles/:profileId/compliments",
  controller.handleGetProfileCompliments,
);

profilesRouter.patch(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  controller.handleUpdateProfile,
);

profilesRouter.delete(
  "/users/:userId/profile",
  createAuthMiddleware("admin"),
  controller.handleDeleteProfile,
);

export default profilesRouter;
