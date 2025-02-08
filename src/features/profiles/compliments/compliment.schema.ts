import { hasAtLeastOneField } from "@/lib/utils/object";
import z, { coerce } from "zod";

export const createComplimentSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export const updateComplimentSchema = z
  .object({
    title: z.string().min(3),
    content: z.string().min(3),
  })
  .partial()
  .refine(
    (data) => hasAtLeastOneField(data),
    "At least one field is required.",
  );

export type CreateComplimentPayload = z.infer<typeof createComplimentSchema>;
export type UpdateComplimentPayload = z.infer<typeof updateComplimentSchema>;

export const paramsComplimentIdSchema = z.object({
  complimentId: coerce.number().positive(),
});

export type ParamsComplimentId = z.infer<typeof paramsComplimentIdSchema>;
