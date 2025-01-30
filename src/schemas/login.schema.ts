import z from "zod";

export const userLoginSchema = z.object({
  accessSecret: z.string(),
});
export type UserLoginPayload = z.infer<typeof userLoginSchema>;
