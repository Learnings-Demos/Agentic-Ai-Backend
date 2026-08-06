import { RunnableSequence } from "@langchain/core/runnables";
import { generateThreadTitleTemplate } from "./generate-thread-title.template";
import { groqModel } from "../../config/models";

export const generateThreadTitleChain = RunnableSequence.from([
  generateThreadTitleTemplate,
  groqModel,
]);
