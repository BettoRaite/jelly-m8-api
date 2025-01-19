import z from "zod";

export const userLoginSchema = z.object({
  accessKey: z.string(),
});
export type UserLoginPayload = z.infer<typeof userLoginSchema>;
