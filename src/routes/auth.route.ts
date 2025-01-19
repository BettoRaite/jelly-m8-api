import { Router } from "express";
// import { loginSchema } from '../../validations/auth.validation';
import * as authController from "@/controller/auth.controller";
import validate from "@/middleware/validate";
import { userLoginSchema } from "@/schemas/login.schema";
import createAuthMiddleware from "@/middleware/auth";

const authRouter: Router = Router();

authRouter.post(
  "/auth/login",
  validate({ body: userLoginSchema }),
  authController.handleLogin
);

authRouter.post(
  "/auth/logout",
  createAuthMiddleware("admin", "user"),
  authController.handleLogout
);

export default authRouter;
