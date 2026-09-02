import { tool } from "@langchain/core/tools";
import { Tools } from "../../../utils/enums";
import { databaseToolDescription } from "./description";
import { databaseToolSchema } from "./schema";
import { databaseToolHandler } from "./handler";

const databaseToolOptions = {
  name: Tools.DATABASE,
  description: databaseToolDescription,
  schema: databaseToolSchema,
};

export const databaseTool = tool(databaseToolHandler, databaseToolOptions);
