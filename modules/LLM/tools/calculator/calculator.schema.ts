import { z } from "zod";

export const calculatorToolSchema = z.object({
  a: z.number(),
  b: z.number(),
  operation: z.enum(["add", "subtract", "multiply", "divide"]),
});

export type CalculatorToolInput = z.infer<typeof calculatorToolSchema>;
