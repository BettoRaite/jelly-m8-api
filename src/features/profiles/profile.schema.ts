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

export const paramsProfileIdSchema = z.object({
  profileId: z.coerce.number().positive(),
});
export type ParamsProfileId = z.infer<typeof paramsProfileIdSchema>;

export const profileActivationSchema = z.object({
  activationSecret: z.string().trim().min(3),
});
export type ProfileActivationPayload = z.infer<typeof profileActivationSchema>;
