import { Router } from "express";
import createAuthMiddleware from "@/middleware/auth";
import validate from "@/middleware/validate";
import { createComplimentSchema } from "@/schemas/compliment.schema";
import {
  handleDeleteCompliment,
  handleUpdateCompliment,
} from "@/controller/compliments.controller";

const complimentsRouter: Router = Router();

complimentsRouter.patch(
  "/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  validate({
    body: createComplimentSchema.optional(),
  }),
  handleUpdateCompliment
);

complimentsRouter.delete(
  "/compliments/:complimentId",
  createAuthMiddleware("admin", "user"),
  handleDeleteCompliment
);

export default complimentsRouter;
