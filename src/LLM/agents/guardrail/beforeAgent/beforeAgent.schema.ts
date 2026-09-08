import { z } from "zod";

export const beforeAgentSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().nullable(),
});
