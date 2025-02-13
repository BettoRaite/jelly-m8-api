import type { QuerySort } from "@/lib/types/types";
import { type Table, asc, desc } from "drizzle-orm";

interface SortQueryBuilderParams<T> extends QuerySort<T> {
  table: Table;
  throwOnNonArray?: boolean;
}

export const constructSortQuery = <T>(params: SortQueryBuilderParams<T>) => {
  const { table, asc: ascCols, desc: descCols, throwOnNonArray } = params;
  if (!Array.isArray(ascCols)) {
    if (throwOnNonArray) {
      throw new Error("ascCols must be an array");
    }
    return [];
  }
  if (!Array.isArray(descCols)) {
    if (throwOnNonArray) {
      throw new Error("descCols must be an array");
    }
    return [];
  }
  const sort = [];
  for (const k of ascCols) {
    sort.push(asc(table[k]));
  }
  for (const k of descCols) {
    sort.push(desc(table[k]));
  }
  return sort;
};
