import type { NextFunction, Response, Request } from "express";
import httpStatus from "http-status";
import { z } from "zod";
import userService from "@/features/users/user.service";
import profileService from "@/features/profiles/profile.service";
import {
  type ParamsProfileId,
  paramsProfileIdSchema,
} from "@/features/profiles/profile.schema";
import { paramsComplimentIdSchema } from "@/features/profiles/compliments/compliment.schema";
import complimentService from "@/shared/services/compliment.service";

// Configuration object for different resources
const RESOURCE_CONFIG = {
  user: {
    schema: z.object({
      userId: z.coerce.number().positive(),
    }),
    serviceFn: (data: { userId: number }) =>
      userService.getUserBy({ id: data.userId }),
  },
  profile: {
    schema: paramsProfileIdSchema,
    serviceFn: (data: ParamsProfileId) =>
      profileService.getProfileBy({ id: data.profileId }),
  },
  compliment: {
    schema: paramsComplimentIdSchema,
    serviceFn: (data: { complimentId: number }) =>
      complimentService.getComplimentBy({ id: data.complimentId }),
  },
} as const;

type ResourceType = keyof typeof RESOURCE_CONFIG;

/**
 * Middleware to ensure that a resource exists based on the resource type.
 * @param resource - The type of resource to check (user, profile, or compliment).
 */
export const ensureResourceExists = (
  resource: ResourceType,
  {
    returnResourceResponse = false,
  }: {
    returnResourceResponse?: boolean;
  } = {},
) => {
  const config = RESOURCE_CONFIG[resource];

  return async (req: Request, res: Response, next: NextFunction) => {
    // Validate request parameters against the schema
    const validationResult = config.schema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: "Invalid parameters",
        details: validationResult.error.errors,
      });
    }

    const { data } = validationResult;

    // Check if the resource exists
    const resourceExists = await config.serviceFn(data);

    if (!resourceExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} not found`,
      });
    }
    if (returnResourceResponse) {
      return res.status(httpStatus.OK).json({
        data: resourceExists,
      });
    }
    next();
  };
};
