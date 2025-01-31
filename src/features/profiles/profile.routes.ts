import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import * as controller from "./profile.controller";
import multer from "multer";
import { storageConfig } from "@/lib/config/storage";
import { createUserProfileSchema } from "./profile.schema";
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
  "/profiles",
  createAuthMiddleware("admin"),
  upload.single("profileImage"),
  validate({ body: createProfileSchema }),
  profilesController.handleCreateProfile,
);

profilesRouter.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("user", "admin"),
  validate({
    body: createComplimentSchema,
  }),
  handleAddComplimentToProfile,
);

profilesRouter.post(
  "/profiles/activate",
  createAuthMiddleware("admin"),
  handleActivateProfiles,
);

profilesRouter.get("/profiles", handleGetProfiles);

profilesRouter.get(
  "/profiles/:profileId/compliments",
  handleGetProfileCompliments,
);

profilesRouter.patch(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  handleUpdateProfile,
);

profilesRouter.delete(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  handleDeleteProfile,
);

export default profilesRouter;
