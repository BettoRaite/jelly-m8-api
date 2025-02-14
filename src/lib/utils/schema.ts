import { z } from "zod";

/**
 * Creates a Zod schema for validating sort columns.
 * @param allowedColumns - An array of allowed column names (keys of T).
 * @returns A Zod schema for validating sort strings.
 */
export const createSortValidation = <T extends Record<string, unknown>>(
  ...allowedColumns: (keyof T)[]
) => {
  return z
    .string()
    .transform((val) => (val ? val.split(",") : []))
    .refine(
      (columns) => {
        if (columns.length === 0) return false;
        // Check if all columns are allowed
        return columns.every((column) =>
          allowedColumns.includes(column as keyof T),
        );
      },
      (val) => ({
        message: `Invalid sort value: '${
          val || "undefined"
        }'. Allowed values are: ${allowedColumns.join(", ")}`,
      }),
    );
};
