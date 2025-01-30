import z from "zod";
import type { UserProfileInsert } from "@/database/schema";

export const createUserProfileSchema: z.ZodType<
  Omit<UserProfileInsert, "profileImageUrl" | "activationSecret" | "userId">
> = z.object({
  displayName: z.string().trim().min(3),
  biography: z.string().trim().min(3),
  gender: z.enum(["male", "female"]),
});

export type CreateUserProfilePayload = z.infer<typeof createUserProfileSchema>;
