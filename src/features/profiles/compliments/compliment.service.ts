import db from "@/database";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type ComplimentInsert,
  ComplimentsTable,
  type ComplimentSelect,
  UserProfilesTable,
} from "@/database/schema";
import type { AtLeastOne, Pagination } from "@/lib/types/types";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import type { UpdateComplimentPayload } from "./compliment.schema";

const createCompliment = async (payload: ComplimentInsert) => {
  await db.insert(ComplimentsTable).values(payload);
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

export const getCompliments = async (
  queryOptions: AtLeastOne<ComplimentSelect>,
  { pageSize = 100 }: Pagination = {},
) => {
  const query = constructWhereQuery({
    queryOptions,
    table: ComplimentsTable,
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
  payload: UpdateComplimentPayload,
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
