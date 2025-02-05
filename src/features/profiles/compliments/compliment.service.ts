import db from "@/database";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type ComplimentInsert,
  ComplimentsTable,
  type ComplimentSelect,
  UserProfilesTable,
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
  return await db
    .select({
      ...ComplimentsTable,
      author: UserProfilesTable,
    })
    .from(ComplimentsTable)
    .innerJoin(
      UserProfilesTable,
      eq(ComplimentsTable.userId, UserProfilesTable.userId),
    );
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

type ComplimentService = {
  createCompliment: (payload: ComplimentInsert) => Promise<void>;
  getComplimentBy: (
    queryOptions: AtLeastOne<ComplimentSelect>,
  ) => Promise<ComplimentSelect | undefined>;
  getCompliments: () => Promise<ComplimentSelect[]>;
  updateCompliment: (
    complimentId: number,
    payload: UpdateComplimentPayload,
  ) => Promise<never[]>;
  deleteCompliment: (complimentId: number) => Promise<never[]>;
};

const complimentService: ComplimentService = {
  createCompliment,
  getComplimentBy,
  getCompliments,
  updateCompliment,
  deleteCompliment,
};

export default complimentService;
