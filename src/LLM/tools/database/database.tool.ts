import { tool } from "@langchain/core/tools";
import { toolsDescription, toolsMapping } from "../tools.constants";
import { databaseToolHandler } from "./database.handler";
import { databaseToolSchema } from "./database.schema";

const databaseToolOptions = {
  name: toolsMapping.database,
  description: toolsDescription.database,
  schema: databaseToolSchema,
};

export const databaseTool = tool(databaseToolHandler, databaseToolOptions);
