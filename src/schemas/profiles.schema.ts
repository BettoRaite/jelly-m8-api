import z from "zod";
import { ProfilesInsert } from "@/database/schema";

export const createProfileSchema: z.ZodType<ProfilesInsert> = z.object({
  name: z.string().trim().min(3),
  bio: z.string().trim().min(3),
});

export type CreateProfilePayload = z.infer<typeof createProfileSchema>;
