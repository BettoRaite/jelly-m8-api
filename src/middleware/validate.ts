import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodSchema } from "zod";
import type { RequireAtLeastOne } from "@/lib/types/types";
type RequestValidationSchema = RequireAtLeastOne<
  Record<"body" | "query" | "params", ZodSchema>
>;
type RequestValidationFields = keyof RequestValidationSchema;

export const validateRequest = (schemas: RequestValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const keys = Object.keys(schemas) as RequestValidationFields[];
    const errors: Array<{ field: string; message: string }> = [];

    for (const k of keys) {
      const schema = schemas[k];
      if (!schema) continue; // Skip if schema is undefined

      const result = schema.safeParse(req[k]);
      if (!result.success) {
        // Collect validation errors
        errors.push(
          ...result.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        );
      } else {
        // Override the request field with the parsed data
        req[k] = result.data;
      }
    }

    if (errors.length > 0) {
      // Send all validation errors in a single response
      return res.status(httpStatus.BAD_REQUEST).json({ errors });
    }

    // If no errors, proceed to the next middleware
    next();
  };
};
