import { tool } from "@langchain/core/tools";
import { toolDescriptions, toolNames } from "../tools.constants";
import { databaseToolHandler } from "./database.handler";
import { databaseToolSchema } from "./database.schema";

const databaseToolOptions = {
  name: toolNames.database,
  description: toolDescriptions.database,
  schema: databaseToolSchema,
};

export const databaseTool = tool(databaseToolHandler, databaseToolOptions);
