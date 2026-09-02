import { tool } from "@langchain/core/tools";
import { Tools } from "../../../utils/enums";
import { calculatorToolDescription } from "./description";
import { calculatorToolSchema } from "./schema";
import { calculatorToolHandler } from "./handler";

const calculatorToolOptions = {
  name: Tools.CALCULATOR,
  description: calculatorToolDescription,
  schema: calculatorToolSchema,
};

export const calculatorTool = tool(
  calculatorToolHandler,
  calculatorToolOptions
);
