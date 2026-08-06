import { z } from "zod";

export const supervisorDecisionSchema = z.object({
  agent: z.enum(["finance", "email", "utility", "chat", "database"]),
});

export type SupervisorDecision = z.infer<typeof supervisorDecisionSchema>;
