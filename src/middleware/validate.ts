import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { type ZodSchema } from "zod";
import { RequireAtLeastOne } from "@/lib/types/types";

type RequestValidationSchema = RequireAtLeastOne<
  Record<"body" | "query" | "params", ZodSchema>
>;
type RequestValidationFields = keyof RequestValidationSchema;

const validate =
  (schemas: RequestValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const keys = Object.keys(schemas) as RequestValidationFields[];
    for (const k of keys) {
      const schema = schemas[k];
      const result = schema?.safeParse(req[k]);
      if (result?.success) {
        return next();
      }

      const errors = result?.error.errors.map((err) => ({
        field: err.path.join(", "),
        message: err.message,
      }));

      res.status(httpStatus.BAD_REQUEST).json({ errors });
      break;
    }
  };

export default validate;
