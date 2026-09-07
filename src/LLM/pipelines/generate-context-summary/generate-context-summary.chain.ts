import { RunnableSequence } from "@langchain/core/runnables";
import { generateContextSummaryTemplate } from "./generate-context-summary.template";
import { groqModel } from "../../../../config/llm/models";

export const generateContextSummaryChain = RunnableSequence.from([
  generateContextSummaryTemplate,
  groqModel,
]);
