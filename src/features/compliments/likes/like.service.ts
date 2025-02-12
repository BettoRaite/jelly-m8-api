import { type LikeInsert, LikesTable, LikeSelect } from "@/database/schema";
import complimentService from "../../../shared/services/compliment.service";
import db from "@/database";
import { and, eq } from "drizzle-orm";

const createLike = async (payload: LikeInsert) => {
  const [compliment] = await complimentService.getCompliments({
    queryOptions: {
      id: payload.complimentId,
    },
  });
  if (!compliment) {
    throw new TypeError(`Compliment does not exist ${payload}`);
  }
  await complimentService.updateCompliment(compliment.id, {
    likes: compliment.likes + 1,
  });
  await db.insert(LikesTable).values(payload);
};
const deleteLike = async (payload: LikeInsert) => {
  const [compliment] = await complimentService.getCompliments({
    queryOptions: {
      id: payload.complimentId,
    },
  });
  if (!compliment) {
    throw new TypeError(`Compliment does not exist ${payload}`);
  }
  if (compliment.likes === 0) {
    return;
  }
  await complimentService.updateCompliment(compliment.id, {
    likes: compliment.likes - 1,
  });
  await db.delete(LikesTable).where(eq(LikesTable.userId, payload.userId));
};
const getLike = async (query: LikeInsert) => {
  const [like] = await db
    .select()
    .from(LikesTable)
    .where(
      and(
        eq(LikesTable.complimentId, query.complimentId),
        eq(LikesTable.userId, query.userId),
      ),
    )
    .limit(1);
  return like;
};

const likeService = {
  createLike,
  deleteLike,
  getLike,
};

export default likeService;
