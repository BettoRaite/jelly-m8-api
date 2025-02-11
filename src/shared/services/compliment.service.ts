import db from "@/database";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type ComplimentInsert,
  ComplimentsTable,
  type ComplimentSelect,
  UserProfilesTable,
} from "@/database/schema";
import type { AtLeastOne, QueryConfig } from "@/lib/types/types";
import { and, eq, getTableColumns } from "drizzle-orm";
import type { UpdateComplimentPayload } from "@/features/profiles/compliments/compliment.schema";

const createCompliment = async (payload: ComplimentInsert) => {
  await db.insert(ComplimentsTable).values(payload).returning();
};

const getComplimentBy = async (queryOptions: AtLeastOne<ComplimentSelect>) => {
  const query = constructWhereQuery({
    queryOptions,
    table: ComplimentsTable,
    strict: true,
  });
  return (
    await db
      .select()
      .from(ComplimentsTable)
      .where(and(...query))
  ).at(0);
};

export const getCompliments = async ({
  queryOptions = {},
  operators = {},
  pagination: { pageSize = 100 } = {},
}: QueryConfig<ComplimentSelect>) => {
  const query = constructWhereQuery({
    queryOptions,
    table: ComplimentsTable,
    operators,
  });
  const items = await db
    .select({
      ...getTableColumns(ComplimentsTable),
      author: getTableColumns(UserProfilesTable),
    })
    .from(ComplimentsTable)
    .where(and(...query))
    .innerJoin(
      UserProfilesTable,
      eq(ComplimentsTable.userId, UserProfilesTable.userId),
    )
    .orderBy()
    .limit(pageSize);
  return items;
};

const updateCompliment = async (
  complimentId: number,
  payload: Partial<ComplimentInsert>,
) => {
  return await db
    .update(ComplimentsTable)
    .set({
      ...payload,
    })
    .where(eq(ComplimentsTable.id, complimentId));
};

const deleteCompliment = async (complimentId: number) => {
  return await db
    .delete(ComplimentsTable)
    .where(eq(ComplimentsTable.id, complimentId));
};

const complimentService = {
  createCompliment,
  getComplimentBy,
  getCompliments,
  updateCompliment,
  deleteCompliment,
};

export default complimentService;
