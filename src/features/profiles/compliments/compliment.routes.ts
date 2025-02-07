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

const complimentRoutes: Router = Router();

// Create a compliment for a profile
// Only authenticated users can create compliments
complimentRoutes.post(
  "/profiles/:profileId/compliments",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  validateRequest({
    body: createComplimentSchema,
  }),
  controller.handleCreateCompliment,
);
// Get all compliments associated with a profile
complimentRoutes.get(
  "/profiles/:profileId/compliments",
  ensureResourceExists("profile"),
  controller.handleGetCompliments,
);
// Update a compliment
// Only owner of the compliment or admin can edit it
complimentRoutes.patch(
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
complimentRoutes.delete(
  "/profiles/:profileId/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  ensureResourceExists("profile"),
  ensureComplimentExists,
  isComplimentOwner,
  controller.handleDeleteCompliment,
);

export default complimentRoutes;
