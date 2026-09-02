import { z } from "zod";

export const ragToolSchema = z.object({
  request: z.string().min(1).describe("The user's document/knowledge-base related request"),
});

export type RagToolInput = z.infer<typeof ragToolSchema>;
