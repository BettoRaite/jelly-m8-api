import type { QueryOperators } from "@/lib/types/types";
import type { Table, SQLWrapper } from "drizzle-orm";
import { OPERATORS } from "@/lib/constants";

export const constructWhereQuery = <T extends Record<string, unknown>>({
  table,
  queryOptions = {},
  strict = false,
  operators = {},
}: {
  table: Table;
  queryOptions?: Partial<T>;
  strict?: boolean;
  operators?: QueryOperators<T>;
}): SQLWrapper[] => {
  const keys = Object.keys(queryOptions);

  // Throw an error if no query options are provided and strict mode is enabled
  if (keys.length === 0 && strict) {
    throw new Error(`Query options are empty: ${JSON.stringify(queryOptions)}`);
  }

  // Construct the WHERE clause conditions
  const whereQuery = keys.map((key) => {
    const operator = operators[key] ?? "eq"; // Default to "eq" if no operator is specified
    const value = queryOptions[key as keyof T];

    // Validate that the operator exists in the OPERATORS map
    if (!OPERATORS[operator]) {
      throw new Error(`Invalid operator: ${operator}`);
    }

    // Apply the operator to the table column and value
    return OPERATORS[operator](table[key], value as number | string);
  });

  return whereQuery;
};

/**
 * Formats specific fields of an object into `%value%` for SQL LIKE queries.
 * @param obj - The object containing fields to format.
 * @param fieldsToFormat - An array of keys to format (optional). If not provided, all string fields will be formatted.
 * @returns A new object with the specified fields formatted or the object itself if number of fields is 0.
 */

export const formatObjectLikeQuery = <
  T extends Record<string, string | number>,
>(
  obj: T,
  ...fieldsToFormat: (keyof T)[]
): T => {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return obj;
  }
  const formattedObj = { ...obj };

  // Determine which fields to format
  const keysToFormat = fieldsToFormat.length > 0 ? fieldsToFormat : keys;

  for (const key of keysToFormat) {
    const value = obj[key];
    if (typeof value === "string" || typeof value === "number") {
      // Format the value if it's a string or number
      formattedObj[key] = `%${value}%`;
    }
  }
  return formattedObj;
};
