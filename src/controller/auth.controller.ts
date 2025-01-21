import db from "@/database";
import { users } from "@/database/schema";
import type { UserLoginPayload } from "@/schemas/login.schema";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
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
  let user = result[0];
  // Simplied admin login
  if (config.node_env === "development" && accessKey === "admin") {
    user = (await db.select().from(users).where(eq(users.role, "admin")))[0];
  }
  // In case the access key is invalid
  if (!user) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
  const { role, accessKey: storedAK } = user;
  const token = createAccessToken({
    role,
    userId: user.id,
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
