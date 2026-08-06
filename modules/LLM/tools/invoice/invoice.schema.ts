import { z } from "zod";

export const invoiceSchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    sendEmail: z
      .boolean()
      .describe(
        "Whether the created invoice should be emailed to the customer after successful creation."
      ),
  })
  .strip(); // Ignore extra properties

export type invoiceInput = z.infer<typeof invoiceSchema>;
