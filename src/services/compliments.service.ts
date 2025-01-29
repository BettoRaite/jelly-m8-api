import { eq } from "drizzle-orm";
import db from ".";
import { ComplimentTable } from "./schema";

export const checkUserComplimentOwnership = async (
  userId: number,
  complimentId: number,
) => {
  const result = await db
    .select()
    .from(ComplimentTable)
    .where(eq(ComplimentTable.id, complimentId));
  return result[0]?.userId === userId;
};

export const getComplimentById = async (complimentId: number) =>
  (
    await db
      .select()
      .from(ComplimentTable)
      .where(eq(ComplimentTable.id, complimentId))
  )[0];
