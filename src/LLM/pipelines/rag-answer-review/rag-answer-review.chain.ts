import { RunnableSequence } from "@langchain/core/runnables";
import { ragAnswerReviewTemplate } from "./rag-answer-review.template";
import { groqModel } from "../../../../config/llm/models";
import { ragAnswerReviewSchema } from "./rag-answer-review.schema";

export const ragAnswerReviewChain = RunnableSequence.from([
  ragAnswerReviewTemplate,
  groqModel.withStructuredOutput(ragAnswerReviewSchema),
]);
