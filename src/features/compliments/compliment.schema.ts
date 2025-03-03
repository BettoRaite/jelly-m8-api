import z from "zod";

export const createComplimentSchema = z.object({
  content: z.string().min(3),
  visibility: z.enum(["private", "public"]),
});

export type CreateComplimentPayload = z.infer<typeof createComplimentSchema>;
