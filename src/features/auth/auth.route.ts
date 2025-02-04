import { Router } from "express";
// import { loginSchema } from '../../validations/auth.validation';
import * as authController from "./auth.controller";
import { validateRequest } from "@/middleware/validate";
import { userLoginSchema } from "./login.schema";
import createAuthMiddleware from "@/middleware/auth";

const authRouter: Router = Router();

authRouter.post(
  "/auth/login",
  validateRequest({ body: userLoginSchema }),
  authController.handleLogin,
);

authRouter.post(
  "/auth/logout",
  createAuthMiddleware("admin", "user"),
  authController.handleLogout,
);

export default authRouter;
