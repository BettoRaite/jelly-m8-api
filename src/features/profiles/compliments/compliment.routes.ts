import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import { ensureResourceExists } from "@/middleware/ensureItemExists";
import * as controller from "./compliment.controller";
import { validateRequest } from "@/middleware/validate";
import {
  createComplimentSchema,
  updateComplimentSchema,
} from "./compliment.schema";
import {
  ensureComplimentExists,
  isComplimentOwner,
} from "./compliment.middleware";
import { z } from "zod";

const profileComplimentsRouter: Router = Router();

// Create a compliment for a profile
// Only authenticated users can create compliments
profileComplimentsRouter.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  validateRequest({
    body: createComplimentSchema,
  }),
  controller.handleCreateCompliment,
);
// Get all compliments associated with a profile
profileComplimentsRouter.get(
  "/profiles/:profileId/compliments",
  ensureResourceExists("profile"),
  validateRequest({
    query: z
      .object({
        userId: z.coerce.number(),
        asc: z.enum(["createdAt"]),
        desc: z.enum(["createdAt"]),
      })
      .partial(),
  }),
  controller.handleGetCompliments,
);
profileComplimentsRouter.get(
  "/profiles/:profileId/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  ensureResourceExists("compliment"),
  controller.handleGetCompliment,
);
// Update a compliment
// Only owner of the compliment or admin can edit it
profileComplimentsRouter.patch(
  "/profiles/:profileId/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  ensureComplimentExists,
  isComplimentOwner,
  validateRequest({
    body: updateComplimentSchema,
  }),
  controller.handleUpdateCompliment,
);
// Delete a compliment
// Only owner of the compliment or admin can delete it
profileComplimentsRouter.delete(
  "/profiles/:profileId/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  ensureComplimentExists,
  isComplimentOwner,
  controller.handleDeleteCompliment,
);

export default profileComplimentsRouter;
