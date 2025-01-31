import {
  eq,
  SQL,
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
  const keys = Object.keys(queryOptions);
  if (keys.length === 0 && strict) {
    throw new Error(`query options is empty: ${queryOptions}`);
  }
  const whereQuery: SQLWrapper[] = [];
  for (const k of keys) {
    whereQuery.push(
      eq(
        table[k as keyof typeof T],
        queryOptions[k as keyof T] as number | string,
      ),
    );
  }
  return whereQuery;
};
