import {
  eq,
  type Table,
 type SQLWrapper,
} from "drizzle-orm";

export const constructWhereQuery = <T extends Record<string, unknown>>({
  table,
  queryOptions,
  strict,
}: {
  table: Table;
  queryOptions: Partial<T>;
  strict?: boolean;
}) => {
  const keys: string[] = Object.keys(queryOptions);
  if (keys.length === 0 && strict) {
    throw new Error(`query options is empty: ${queryOptions}`);
  }
  const whereQuery: SQLWrapper[] = [];
  for (const k of keys) {
    whereQuery.push(
      eq(
        table[k],
        queryOptions[k as keyof T] as number | string,
      ),
    );
  }
  return whereQuery;
};
