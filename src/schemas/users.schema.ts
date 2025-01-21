import z from "zod";
import type { UsersSelect } from "@/database/schema";

export const createUserSchema: z.ZodType<
  Omit<UsersSelect, "id" | "accessKey" | "profilePicUrl">
> = z.object({
  name: z.string().trim().min(3),
  role: z.enum(["admin", "user"]),
  profilePicUrl: z.string().optional(),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
