import db from "@/database";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type ComplimentInsert,
  ComplimentsTable,
  type ComplimentSelect,
  ComplimentLikesTable,
} from "@/database/schema";
import type { AtLeastOne } from "@/lib/types/types";
import { and, eq } from "drizzle-orm";
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

const getCompliments = async () => {
  return await db.select().from(ComplimentsTable);
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
