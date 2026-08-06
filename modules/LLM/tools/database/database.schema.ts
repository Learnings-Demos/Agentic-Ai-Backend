import { z } from "zod";
import { DatabaseServices } from "../../../../utils/enums";

export const databaseToolSchema = z.object({
  service: z.enum(DatabaseServices),
  operation: z.string().describe("Database operation to execute."),
  payload: z.any().optional(),
});

export type DatabaseInput = z.infer<typeof databaseToolSchema>;
