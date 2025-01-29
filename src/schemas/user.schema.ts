import z from "zod";
import type { UsersSelect } from "@/database/schema";

interface CreateProfileSchema
  extends Omit<UsersSelect, "id" | "accessKey" | "profileImageUrl"> {}

export const createUserSchema: z.ZodType<CreateProfileSchema> = z.object({
  name: z.string().trim().min(3),
  role: z.enum(["admin", "user"]),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
