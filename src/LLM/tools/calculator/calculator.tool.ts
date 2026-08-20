import { tool } from "@langchain/core/tools";
import { calculatorToolHandler } from "./calculator.handler";
import { calculatorToolSchema } from "./calculator.schema";
import { toolsDescription, toolsMapping } from "../tools.constants";

const calculatorToolOptions = {
  name: toolsMapping.calculator,
  description: toolsDescription.calculator,
  schema: calculatorToolSchema,
};

export const calculatorTool = tool(
  calculatorToolHandler,
  calculatorToolOptions
);
