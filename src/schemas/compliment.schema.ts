import z from "zod";

export const createComplimentSchema = z.object({
  content: z.string().min(3),
});

export type CreateComplimentPayload = z.infer<typeof createComplimentSchema>;
