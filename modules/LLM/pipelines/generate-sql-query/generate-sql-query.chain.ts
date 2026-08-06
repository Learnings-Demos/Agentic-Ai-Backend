import { RunnableSequence } from "@langchain/core/runnables";
import { groqModel } from "../../config/models";
import { generateSqlQueryTemplate } from "./generate-sql-query.template";

export const generateSqlQueryChain = RunnableSequence.from([
  generateSqlQueryTemplate,
  groqModel,
]);
