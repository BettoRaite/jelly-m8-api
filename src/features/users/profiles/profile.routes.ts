import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
// import { validateRequest } from "@/middleware/validate";
import * as controller from "./profile.controller";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";
import { createUserProfileSchema, updateProfileSchema } from "./profile.schema";
// import { createComplimentSchema } from "../compliments/compliment.schema";
import {
  ensureUserProfileExists,
  stripUnmodifiableFields,
} from "./profile.middleware";
import { validateRequest } from "@/middleware/validate";
import { ensureResourceExists } from "@/middleware/ensureItemExists";

const upload = multer({ storage: storageConfig });
const profilesRouter: Router = Router();

// Create user profile
profilesRouter.post(
  "/users/:userId/profile",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("user"),
  upload.single("imageFile"),
  validateRequest({ body: createUserProfileSchema }),
  controller.handleCreateProfile,
);

// Get user profile
profilesRouter.get(
  "/users/:userId/profile",
  ensureResourceExists("user"),
  ensureUserProfileExists,
  controller.handleGetProfile,
);

profilesRouter.patch(
  "/users/:userId/profile",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("user"),
  ensureUserProfileExists,
  upload.single("imageFile"),
  validateRequest({
    body: updateProfileSchema,
  }),
  stripUnmodifiableFields,
  controller.handleUpdateProfile,
);

profilesRouter.patch(
  "/users/:userId/profile/activate",
  ensureResourceExists("user"),
  ensureUserProfileExists,
  validateRequest({
    body: updateProfileSchema,
  }),
  controller.handleActivateProfile,
);

profilesRouter.delete(
  "/users/:userId/profile",
  createAuthMiddleware("admin"),
  ensureResourceExists("user"),
  ensureUserProfileExists,
  controller.handleDeleteProfile,
);

export default profilesRouter;
