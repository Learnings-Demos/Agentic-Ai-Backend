import { z } from "zod";

export const queryRewriteSchema = z.object({
  rewrittenQuery: z.string(),
});

export type QueryRewriteSchemaReview = z.infer<typeof queryRewriteSchema>;
