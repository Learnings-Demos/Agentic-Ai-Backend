import { RunnableSequence } from "@langchain/core/runnables";
import { queryRewriteTemplate } from "./query-rewrite.template";
import { groqModel } from "../../../../config/llm/models";
import { queryRewriteSchema } from "./query-rewrite.schema";

export const queryRewriteChain = RunnableSequence.from([
  queryRewriteTemplate,
  groqModel.withStructuredOutput(queryRewriteSchema),
]);
