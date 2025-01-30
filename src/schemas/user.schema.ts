import z from "zod";
import type { UserSelect } from "@/database/schema";

interface CreateUserSchema extends Omit<UserSelect, "id" | "accessSecret"> {}

export const createUserSchema: z.ZodType<CreateUserSchema> = z.object({
  username: z.string().trim().min(3),
  userRole: z.enum(["admin", "user"]),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
