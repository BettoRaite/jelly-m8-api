import db from "@/database";
import { constructSortQuery } from "@/database/helpers/constructSortQuery";
import { constructWhereQuery } from "@/database/helpers/constructWhereQuery";
import {
  type QuestionSelect,
  QuestionsTable,
  type QuestionInsert,
} from "@/database/schema";
import type { QueryConfig } from "@/lib/types/types";
import { and } from "drizzle-orm";

const createQuestion = async (payload: QuestionInsert) => {
  await db.insert(QuestionsTable).values(payload);
};

const getQuestions = async (queryConfig: QueryConfig<QuestionSelect>) => {
  const { pagination, sorting = {} } = queryConfig;
  const where = constructWhereQuery({
    table: QuestionsTable,
    ...queryConfig,
  });
  const sort = constructSortQuery({
    table: QuestionsTable,
    ...sorting,
  });
  return await db
    .select()
    .from(QuestionsTable)
    .where(and(...where))
    .orderBy(...sort)
    .limit(pagination?.pageSize ?? 100);
};

const questionService = {
  createQuestion,
  getQuestions,
};

export default questionService;
