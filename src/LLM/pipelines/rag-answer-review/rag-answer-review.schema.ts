import { z } from "zod";

export const ragAnswerReviewSchema = z.object({
  relevant: z.boolean(),
  reason: z.string().nullable(),
});

export type RagAnswerReview = z.infer<typeof ragAnswerReviewSchema>;
