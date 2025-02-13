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
    .optional() // Allow the field to be optional
    .refine(
      (val) => {
        if (!val) return false; // If no value, it's valid (optional)
        const columns = val.split(",");
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
