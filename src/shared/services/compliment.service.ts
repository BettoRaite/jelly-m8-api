import db from "@/database";
import { constructSortQuery } from "@/database/helpers/constructSortQuery";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type ComplimentInsert,
  ComplimentsTable,
  type ComplimentSelect,
  UserProfilesTable,
} from "@/database/schema";
import type { AtLeastOne, QueryConfig } from "@/lib/types/types";
import { aliasedTable, and, eq, getTableColumns } from "drizzle-orm";

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

const author = aliasedTable(UserProfilesTable, "author");
const recipient = aliasedTable(UserProfilesTable, "recipient");

export const getCompliments = async ({
  queryOptions = {},
  operators = {},
  pagination: { pageSize = 100 } = {},
  sorting = {},
}: QueryConfig<ComplimentSelect>) => {
  const query = constructWhereQuery({
    queryOptions,
    table: ComplimentsTable,
    operators,
  });
  const sort = constructSortQuery({
    table: ComplimentsTable,
    ...sorting,
  });
  const items = await db
    .select({
      ...getTableColumns(ComplimentsTable),
      author: getTableColumns(author),
      recipient: getTableColumns(recipient),
    })
    .from(ComplimentsTable)
    .where(and(...query))
    .innerJoin(author, eq(ComplimentsTable.userId, author.userId))
    .leftJoin(recipient, eq(ComplimentsTable.profileId, recipient.id))
    .orderBy(...sort)
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
