import { z } from "zod";
import { DatabaseServices } from "../../../utils/enums";
import { allOperations } from "../../registries";

export const databaseToolSchema = z.object({
  service: z.enum(Object.values(DatabaseServices) as any),
  operation: z.enum(allOperations),
  payload: z.any().optional(),
});

export type DatabaseInput = z.infer<typeof databaseToolSchema>;
