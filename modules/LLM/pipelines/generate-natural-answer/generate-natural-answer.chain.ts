import { RunnableSequence } from "@langchain/core/runnables";
import { groqModel } from "../../config/models";
import { generateFinalizeResponseTemplate } from "./generate-natural-answer.template";

export const generateFinalizeResponseChain = RunnableSequence.from([
  generateFinalizeResponseTemplate,
  groqModel,
]);
