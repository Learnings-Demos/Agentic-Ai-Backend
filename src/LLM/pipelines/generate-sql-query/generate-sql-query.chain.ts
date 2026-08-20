import { RunnableSequence } from "@langchain/core/runnables";
import { generateSqlQueryTemplate } from "./generate-sql-query.template";
import { groqModel } from "../../../../config/llm/models";

export const generateSqlQueryChain = RunnableSequence.from([
  generateSqlQueryTemplate,
  groqModel,
]);
