import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import {
  handleActivateProfiles,
  handleAddComplimentToProfile,
  handleCreateProfile,
  handleDeleteProfile,
  handleGetProfileCompliments,
  handleGetProfiles,
  handleUpdateProfile,
} from "@/controller/profiles.controller";
import { createProfileSchema } from "@/schemas/profiles.schema";
import { createComplimentSchema } from "@/schemas/compliment.schema";

const profilesRouter: Router = Router();

profilesRouter.post(
  "/profiles",
  createAuthMiddleware("admin"),
  validate({
    body: createProfileSchema,
  }),
  handleCreateProfile
);

profilesRouter.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("user", "admin"),
  validate({
    body: createComplimentSchema,
  }),
  handleAddComplimentToProfile
);

profilesRouter.post(
  "/profiles/activate",
  createAuthMiddleware("admin"),
  handleActivateProfiles
);

profilesRouter.get("/profiles", handleGetProfiles);

profilesRouter.get(
  "/profiles/:profileId/compliments",
  handleGetProfileCompliments
);

profilesRouter.patch(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  handleUpdateProfile
);

profilesRouter.delete(
  "/profiles/:profileId",
  createAuthMiddleware("admin"),
  handleDeleteProfile
);

export default profilesRouter;
