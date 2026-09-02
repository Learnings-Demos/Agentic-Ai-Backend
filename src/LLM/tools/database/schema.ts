import { z } from "zod";
import { DatabaseServices } from "../../../utils/enums";
import { serviceRegistry } from "../../registries";

export const allOperations: any = [
  ...Object.values(serviceRegistry).reduce((acc, registry) => {
    return [...acc, ...Object.keys(registry.operations)];
  }, [] as string[]),
  "generate_sql",
  "forbidden_operation",
];

export const databaseToolSchema = z.object({
  service: z.enum(Object.values(DatabaseServices) as any),
  operation: z.enum(allOperations),
  payload: z.any().optional(),
});

export type DatabaseInput = z.infer<typeof databaseToolSchema>;
