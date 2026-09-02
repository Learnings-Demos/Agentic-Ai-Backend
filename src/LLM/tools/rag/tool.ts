import { tool } from "@langchain/core/tools";
import { Tools } from "../../../utils/enums";
import { ragToolDescription } from "./description";
import { ragToolSchema } from "./schema";
import { ragToolHandler } from "./handler";

const ragToolOptions = {
  name: Tools.RAG,
  description: ragToolDescription,
  schema: ragToolSchema,
};

export const ragTool = tool(ragToolHandler, ragToolOptions);
