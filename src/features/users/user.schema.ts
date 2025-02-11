import z from "zod";
import type { UserSelect } from "@/database/schema";

interface CreateUserSchema extends Omit<UserSelect, "id" | "accessSecret"> {}

export const createUserSchema: z.ZodType<CreateUserSchema> = z.object({
  accessSecret: z.string().optional(),
  username: z.string().trim().min(3).toLowerCase(),
  userRole: z.enum(["admin", "user"]),
});

export interface CreateUserPayload extends z.infer<typeof createUserSchema> {
  accessSecret?: string;
}
