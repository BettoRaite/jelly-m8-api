import z from "zod";
// import type { UserProfileInsert } from "@/database/schema";
import { hasAtLeastOneField } from "@/lib/utils/object";

export const createUserProfileSchema = z
  .object({
    displayName: z.string().trim().min(3),
    biography: z.string().trim().min(3),
    gender: z.enum(["male", "female"]),
    imageName: z.string().optional(),
  })
  .strict();

export type CreateUserProfilePayload = z.infer<typeof createUserProfileSchema>;

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(3),
    biography: z.string().trim().min(3),
    gender: z.enum(["male", "female"]),
    isActivated: z.preprocess((val) => {
      if (val === undefined) return undefined;
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return "error";
    }, z.boolean().optional()),
    activationSecret: z.string().trim().min(3),
  })
  .strict()
  .partial()
  .refine(
    (data) => hasAtLeastOneField(data),
    "Must container at least one field",
  );

export const userUpdateProfileSchema = z
  .object({
    displayName: z.string().trim().min(3).optional(),
    biography: z.string().trim().min(3).optional(),
    gender: z.enum(["male", "female"]).optional(),
  })
  .strict()
  .refine(
    (data) => hasAtLeastOneField(data),
    "Must contain at least one field",
  );

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export const paramsProfileIdSchema = z.object({
  profileId: z.coerce.number().positive(),
});
export type ParamsProfileId = z.infer<typeof paramsProfileIdSchema>;

export const profileActivationSchema = z
  .object({
    activationSecret: z.string().trim().min(3),
  })
  .strict();
export type ProfileActivationPayload = z.infer<typeof profileActivationSchema>;
