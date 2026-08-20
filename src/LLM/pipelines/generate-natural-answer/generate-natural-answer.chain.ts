import { RunnableSequence } from "@langchain/core/runnables";
import { generateFinalizeResponseTemplate } from "./generate-natural-answer.template";
import { groqModel } from "../../../../config/llm/models";

export const generateFinalizeResponseChain = RunnableSequence.from([
  generateFinalizeResponseTemplate,
  groqModel,
]);
