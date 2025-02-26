import { type LikeInsert, LikesTable } from "@/database/schema";
import complimentService from "../../../shared/services/compliment.service";
import db from "@/database";
import { and, eq } from "drizzle-orm";
import { ApiError } from "@/lib/errors";
import httpStatus from "http-status";

const createLike = async (payload: LikeInsert) => {
  await db.transaction(async (tx) => {
    const [existingLike] = await tx
      .select()
      .from(LikesTable)
      .where(
        and(
          eq(LikesTable.complimentId, payload.complimentId),
          eq(LikesTable.userId, payload.userId),
        ),
      )
      .limit(1);

    if (existingLike) {
      throw new ApiError("Like already exists", httpStatus.CONFLICT);
    }

    await tx.insert(LikesTable).values(payload);

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
  });
};

const deleteLike = async (payload: LikeInsert) => {
  await db.transaction(async (tx) => {
    await tx
      .delete(LikesTable)
      .where(
        and(
          eq(LikesTable.complimentId, payload.complimentId),
          eq(LikesTable.userId, payload.userId),
        ),
      );

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
  });
};

const getLikes = async (query: LikeInsert) => {
  return db
    .select()
    .from(LikesTable)
    .where(
      and(
        eq(LikesTable.complimentId, query.complimentId),
        eq(LikesTable.userId, query.userId),
      ),
    )
    .limit(1);
};

const likeService = {
  createLike,
  deleteLike,
  getLikes,
};

export default likeService;
