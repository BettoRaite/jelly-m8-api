import type { UserLoginPayload } from "./login.schema";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { createAccessToken } from "@/lib/utils/token.util";
import config from "@/lib/config/config";
import {
  accessTokenCookieConfig,
  clearAccessTokenCookieConfig,
} from "@/lib/config/cookieConfig";
import * as userService from "../users/user.service";

export const handleLogin = async (req: Request, res: Response) => {
  const { accessSecret } = req.body as UserLoginPayload;

  const user = await userService.getUserBy({
    accessSecret,
  });
  // In case the access secret is invalid
  if (!user) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
  // User role for authorization, accessSecret for authentication
  const { userRole, accessSecret: storedAS } = user;
  const token = createAccessToken({
    userRole,
    userId: user.id,
    accessSecret: storedAS,
  });
  // Setting token on cookies
  res.cookie(
    config.jwt.access_token.cookieName,
    token,
    accessTokenCookieConfig,
  );

  res.status(httpStatus.OK).json({
    message: "Successfully signed in.",
  });
};

export const handleLogout = async (req: Request, res: Response) => {
  const { userId } = req.payload ?? {};
  if (!userId) {
    return res.status(httpStatus.FORBIDDEN);
  }

  res.clearCookie(
    config.jwt.access_token.cookieName,
    clearAccessTokenCookieConfig,
  );
  res.status(httpStatus.OK).json({
    message: "Successfully signed out.",
  });
};
