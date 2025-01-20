import { eq } from "drizzle-orm";
import db from ".";
import { compliments } from "./schema";

export const checkUserComplimentOwnership = async (
  userId: number,
  complimentId: number
) => {
  const result = await db
    .select()
    .from(compliments)
    .where(eq(compliments.id, complimentId));
  return result[0]?.userId === userId;
};

export const getComplimentById = async (complimentId: number) =>
  (
    await db.select().from(compliments).where(eq(compliments.id, complimentId))
  )[0];
