import z from "zod";
import type { ProfilesInsert } from "@/database/schema";

export const createProfileSchema: z.ZodType<
  Omit<ProfilesInsert, "profileImageUrl">
> = z.object({
  name: z.string().trim().min(3),
  bio: z.string().trim().min(3),
});

export type CreateProfilePayload = z.infer<typeof createProfileSchema>;
