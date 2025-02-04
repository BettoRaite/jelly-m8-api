import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
// import { validateRequest } from "@/middleware/validate";
import * as controller from "./profile.controller";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";
import {
  createUserProfileSchema,
  paramsProfileIdSchema,
  profileActivationSchema,
} from "./profile.schema";
import { createComplimentSchema } from "../compliments/compliment.schema";
import { z } from "zod";
import { handleUnderwork } from "@/shared/default.controller";
import { ensureProfileExists } from "./profile.middleware";
import { validateRequest } from "@/middleware/validate";

const upload = multer({ storage: storageConfig });
const profilesRouter: Router = Router();

// Create user profile
profilesRouter.post(
  "/users/:id/profile",
  createAuthMiddleware("admin", "user"),
  upload.single("imageFile"),
  validateRequest({ body: createUserProfileSchema }),
  controller.handleCreateProfile,
);

profilesRouter.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("user", "admin"),
  validateRequest({
    body: createComplimentSchema,
  }),
  handleUnderwork,
);

profilesRouter.post(
  "/profiles/activate",
  createAuthMiddleware("admin"),
  handleUnderwork,
);

profilesRouter.get(
  "/profiles",
  validateRequest({
    query: z.object({
      gender: z.enum(["male", "female"]).optional(),
    }),
  }),
  controller.handleGetProfiles,
);

profilesRouter.get(
  "/profiles/:profileId",
  validateRequest({
    params: paramsProfileIdSchema,
  }),
  ensureProfileExists,
  controller.handleGetProfile,
);

// Get user profile
profilesRouter.get(
  "/users/:id/profile",
  createAuthMiddleware("admin", "user"),
  handleUnderwork,
);

profilesRouter.get("/profiles/:profileId/compliments", handleUnderwork);

profilesRouter.patch(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  handleUnderwork,
);

profilesRouter.patch(
  "/profiles/:profileId/activate",
  validateRequest({
    body: profileActivationSchema,
    params: paramsProfileIdSchema,
  }),
  ensureProfileExists,
  controller.handleActivateProfile,
);

profilesRouter.patch(
  "/profiles/:profileId/deactivate",
  createAuthMiddleware("admin"),
  ensureProfileExists,
  controller.handleDeactivateProfile,
);

profilesRouter.delete(
  "/users/:userId/profile",
  createAuthMiddleware("admin"),
  controller.handleDeleteProfile,
);

export default profilesRouter;
