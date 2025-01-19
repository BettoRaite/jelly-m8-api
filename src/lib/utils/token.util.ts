import jwt from "jsonwebtoken";
import config from "../config/config";
import { JwtPayload } from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

/**
 * This functions generates a valid access token
 *
 * @param {number | string} userId - The user id of the user that owns this jwt
 * @returns Returns a valid access token
 */
export const createAccessToken = (payload: JwtPayload): string => {
  return sign(payload, config.jwt.access_token.secret, {
    expiresIn: config.jwt.access_token.expire,
  });
};
