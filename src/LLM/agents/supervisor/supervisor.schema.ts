import { z } from "zod";

export const supervisorDecisionSchema = z.object({
  agent: z.enum(["email", "utility", "chat", "database", "rag"]),
});

export type SupervisorDecision = z.infer<typeof supervisorDecisionSchema>;
