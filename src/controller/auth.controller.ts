import db from "@/database";
import { users } from "@/database/schema";
import { UserLoginPayload } from "@/schemas/login.schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { createAccessToken } from "@/lib/utils/token.util";
import config from "@/lib/config/config";
import {
  accessTokenCookieConfig,
  clearAccessTokenCookieConfig,
} from "@/lib/config/cookieConfig";

export const handleLogin = async (req: Request, res: Response) => {
  const { accessKey } = req.body as UserLoginPayload;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.accessKey, accessKey));
  const user = result[0];
  // In case the access key is invalid
  if (!user) {
    return res.status(httpStatus.FORBIDDEN);
  }
  const { role, accessKey: storedAK } = user;
  const token = createAccessToken({
    role,
    userId: String(user.id),
    accessKey: storedAK,
  });
  // Setting token on cookies
  res.cookie(
    config.jwt.access_token.cookieName,
    token,
    accessTokenCookieConfig
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
    clearAccessTokenCookieConfig
  );
  res.status(httpStatus.OK).json({
    message: "Successfully signed out.",
  });
};
