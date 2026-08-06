import { z } from "zod";

export const emailSchema = z.object({
  to: z.string().describe("Recipient email address"),

  subject: z.string().min(1).describe("Subject of the email"),

  body: z.string().min(1).describe("Body content of the email"),
});

export type EmailInput = z.infer<typeof emailSchema>;
