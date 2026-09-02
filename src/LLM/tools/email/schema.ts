import { z } from "zod";

export const emailToolSchema = z.object({
  request: z.string().min(1).describe("The user's email-related request"),
});

export type EmailToolInput = z.infer<typeof emailToolSchema>;
