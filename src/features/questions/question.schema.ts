import type { QuestionInsert } from "@/database/schema";
import { type ZodType, z } from "zod";

// export const createQuestionSchema: ZodType<
//   Partial<QuestionInsert, "isApproved" | "createdAt" | "">
// > = z.object({
//   content: z.string().trim().min(3).max(255),
// });
