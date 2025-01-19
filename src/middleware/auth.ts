/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "@/lib/config/config";
import { Roles } from "@/lib/types/types";
import { getUserByAccessKey } from "@/database/users.db";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { verify } = jwt;

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined =
    req.cookies[config.jwt.access_token.cookieName];

  if (!token) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  verify(
    token,
    config.jwt.access_token.secret,
    async (err: unknown, payload: JwtPayload) => {
      if (err) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }

      req.payload = payload;

      if (payload.role === "user") {
        try {
          const user = await getUserByAccessKey(payload.accessKey as string);
          if (!user) {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
          }
        } catch (err) {
          return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
      }

      // Call next() only after all checks are done
      return next();
    }
  );
};

const isAuthorized = (...roles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.payload?.role as Roles;
    // Checking if roles include the role of the user, thus authorizing the request
    if (!role || !roles.includes(role)) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    next();
  };
};

const createAuthMiddleware = (...roles: Roles[]) => {
  return [isAuthenticated, isAuthorized(...roles)];
};

export default createAuthMiddleware;
